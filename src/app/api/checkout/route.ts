import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { getMollie, getSiteUrl } from '@/lib/mollie'
import {
  calculateShipping, isShippingCountry, MAX_QTY_PER_ITEM, round2, SHIPPING_COUNTRIES,
} from '@/lib/shop'

export const dynamic = 'force-dynamic'

type InItem = { produto_id: string; quantidade: number; tamanho?: string }
type Customer = {
  nome: string; email: string; telefone: string; morada: string
  cidade: string; codigo_postal: string; pais: string; nif?: string; notas?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(req: Request) {
  let body: { items?: unknown; customer?: Record<string, unknown> }
  try { body = await req.json() } catch { return bad('Pedido inválido') }

  // ---- Validar cliente ----
  const c = body.customer || {}
  const customer: Customer = {
    nome: str(c.nome), email: str(c.email).toLowerCase(), telefone: str(c.telefone, 30),
    morada: str(c.morada, 300), cidade: str(c.cidade, 100), codigo_postal: str(c.codigo_postal, 20),
    pais: str(c.pais, 20), nif: str(c.nif, 20) || undefined, notas: str(c.notas, 500) || undefined,
  }
  if (!customer.nome || !EMAIL_RE.test(customer.email) || !customer.telefone || !customer.morada ||
      !customer.cidade || !customer.codigo_postal) {
    return bad('Preencha todos os dados de envio obrigatórios.')
  }
  if (!isShippingCountry(customer.pais)) return bad('País de envio não suportado.')
  if (customer.pais.startsWith('PT') && !/^\d{4}-\d{3}$/.test(customer.codigo_postal)) {
    return bad('Código postal inválido (formato 1234-567).')
  }
  if (customer.nif && !/^\d{9}$/.test(customer.nif)) return bad('NIF inválido (9 dígitos).')

  // ---- Validar itens ----
  const rawItems = Array.isArray(body.items) ? (body.items as InItem[]) : []
  if (rawItems.length === 0 || rawItems.length > 50) return bad('Carrinho vazio.')
  const merged = new Map<string, InItem>()
  for (const it of rawItems) {
    const id = str(it?.produto_id, 64)
    const qty = Math.floor(Number(it?.quantidade))
    if (!id || !Number.isFinite(qty) || qty < 1 || qty > MAX_QTY_PER_ITEM) return bad('Quantidade inválida.')
    const tamanho = str(it?.tamanho, 30) || undefined
    const key = `${id}__${tamanho || ''}`
    const prev = merged.get(key)
    merged.set(key, { produto_id: id, tamanho, quantidade: (prev?.quantidade || 0) + qty })
  }
  const items = [...merged.values()]

  let supabase
  try { supabase = getSupabaseAdmin() } catch (e) {
    console.error(e); return bad('Loja temporariamente indisponível.', 503)
  }

  // ---- Preços e stock vêm SEMPRE da base de dados ----
  const ids = [...new Set(items.map((i) => i.produto_id))]
  const { data: products, error } = await supabase
    .from('products').select('id, nome, codigo, preco, stock, tamanhos, iva').in('id', ids)
  if (error) { console.error(error); return bad('Erro ao validar produtos.', 500) }
  const byId = new Map((products || []).map((p) => [String(p.id), p]))

  const qtyByProduct = new Map<string, number>()
  items.forEach((i) => qtyByProduct.set(i.produto_id, (qtyByProduct.get(i.produto_id) || 0) + i.quantidade))

  const lines = []
  for (const it of items) {
    const p = byId.get(it.produto_id)
    if (!p) return bad('Um dos produtos já não está disponível. Atualize o carrinho.', 409)
    const stock = Number(p.stock ?? 0)
    if (stock < (qtyByProduct.get(it.produto_id) || 0)) {
      return bad(`Stock insuficiente para "${p.nome}" (disponível: ${Math.max(0, stock)}).`, 409)
    }
    const sizes: string[] = Array.isArray(p.tamanhos) ? p.tamanhos : []
    if (sizes.length > 0 && (!it.tamanho || !sizes.includes(it.tamanho))) {
      return bad(`Escolha um tamanho válido para "${p.nome}".`)
    }
    const preco = round2(Number(p.preco))
    if (!(preco > 0)) return bad(`"${p.nome}" não está à venda.`, 409)
    lines.push({
      produto_id: String(p.id), codigo: p.codigo, nome: p.nome, tamanho: it.tamanho || null,
      quantidade: it.quantidade, preco_unitario: preco, iva: Number(p.iva ?? 23),
      total: round2(preco * it.quantidade),
    })
  }

  const subtotal = round2(lines.reduce((s, l) => s + l.total, 0))
  const shipping = calculateShipping(subtotal, customer.pais)
  const total = round2(subtotal + shipping)

  // Associar a cliente registado (se existir com o mesmo email)
  const { data: existingCustomer } = await supabase
    .from('customers').select('id').eq('email', customer.email).maybeSingle()

  const numero = `RV-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

  const { data: order, error: orderErr } = await supabase.from('orders').insert({
    cliente_id: existingCustomer?.id ?? null,
    numero_pedido: numero,
    lista_produtos: lines,
    subtotal, custo_envio: shipping, total,
    status: 'pending',
    nome_cliente: customer.nome,
    email_cliente: customer.email,
    telefone_cliente: customer.telefone,
    nif_cliente: customer.nif ?? null,
    notas: customer.notas ?? null,
    endereco_envio: {
      morada: customer.morada, cidade: customer.cidade, codigo_postal: customer.codigo_postal,
      pais: customer.pais, pais_nome: SHIPPING_COUNTRIES[customer.pais].label,
    },
  }).select('id, numero_pedido, access_token').single()

  if (orderErr || !order) {
    console.error('Erro a criar encomenda', orderErr)
    return bad('Não foi possível criar a encomenda. Tente novamente.', 500)
  }

  // ---- Pagamento Mollie ----
  try {
    const site = getSiteUrl(req)
    const isLocal = site.includes('localhost') || site.includes('127.0.0.1')
    const payment = await getMollie().payments.create({
      amount: { currency: 'EUR', value: total.toFixed(2) },
      description: `RedVelvet ${order.numero_pedido}`,
      redirectUrl: `${site}/checkout/success/?order=${order.id}&t=${order.access_token}`,
      // Mollie não consegue chamar localhost — em dev o estado é lido no regresso
      ...(isLocal ? {} : { webhookUrl: `${site}/api/webhooks/mollie/` }),
      locale: 'pt_PT' as never,
      metadata: { order_id: order.id, numero_pedido: order.numero_pedido },
      billingEmail: customer.email,
    } as Parameters<ReturnType<typeof getMollie>['payments']['create']>[0])

    await supabase.from('orders').update({ mollie_payment_id: payment.id }).eq('id', order.id)

    const url = payment.getCheckoutUrl()
    if (!url) throw new Error('Mollie sem checkout URL')
    return NextResponse.json({ url, order: order.numero_pedido })
  } catch (e) {
    console.error('Erro Mollie', e)
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id)
    return bad('O serviço de pagamento não respondeu. Tente novamente dentro de momentos.', 502)
  }
}
