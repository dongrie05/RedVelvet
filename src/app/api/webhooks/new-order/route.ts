import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email para onde enviar a notificação de novo pedido (dono da loja)
const NOTIFY_EMAIL_TO = process.env.NOTIFY_EMAIL_TO || 'redvelvet.homeliving@gmail.com'
// Remetente (domínio verificado no Resend; em teste pode usar onboarding@resend.dev)
const NOTIFY_EMAIL_FROM = process.env.NOTIFY_EMAIL_FROM || 'RedVelvet <onboarding@resend.dev>'

type OrderRecord = {
  id?: string
  cliente_id?: string
  numero_pedido?: string
  lista_produtos?: unknown
  subtotal?: number
  custo_envio?: number
  total?: number
  status?: string
  metodo_pagamento?: string
  endereco_envio?: Record<string, unknown> | null
  created_at?: string
}

type SupabaseWebhookPayload = {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  schema: string
  record: OrderRecord | null
  old_record: OrderRecord | null
}

function formatCurrency(value: number | undefined): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(Number(value))
}

function buildOrderEmailHtml(record: OrderRecord): string {
  const numero = record.numero_pedido ?? record.id ?? '—'
  const total = formatCurrency(record.total)
  const subtotal = formatCurrency(record.subtotal)
  const envio = formatCurrency(record.custo_envio)
  const metodo = record.metodo_pagamento ?? '—'
  const status = record.status ?? '—'
  const endereco = record.endereco_envio
  const enderecoStr = endereco && typeof endereco === 'object'
    ? [
        [endereco.nome, endereco.endereco, endereco.codigo_postal, endereco.cidade, endereco.pais]
          .filter(Boolean)
          .join(', ')
      ].join(' ')
    : '—'
  const lista = record.lista_produtos
  let produtosStr = '—'
  if (Array.isArray(lista)) {
    produtosStr = lista
      .map((p: { nome?: string; quantidade?: number; preco?: number }) =>
        `• ${p.nome ?? 'Produto'} x${p.quantidade ?? 1} - ${formatCurrency(p.preco)}`
      )
      .join('<br/>')
  } else if (lista && typeof lista === 'object') {
    produtosStr = JSON.stringify(lista)
  }

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #7c2d12;">Novo pedido na RedVelvet</h1>
  <p>Foi registado um novo pedido na loja.</p>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Nº Pedido</strong></td><td style="padding: 8px; border: 1px solid #eee;">${numero}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Total</strong></td><td style="padding: 8px; border: 1px solid #eee;">${total}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Subtotal</strong></td><td style="padding: 8px; border: 1px solid #eee;">${subtotal}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Custo envio</strong></td><td style="padding: 8px; border: 1px solid #eee;">${envio}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Método pagamento</strong></td><td style="padding: 8px; border: 1px solid #eee;">${metodo}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Estado</strong></td><td style="padding: 8px; border: 1px solid #eee;">${status}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Morada de envio</strong></td><td style="padding: 8px; border: 1px solid #eee;">${enderecoStr}</td></tr>
  </table>
  <h2 style="color: #7c2d12;">Produtos</h2>
  <p>${produtosStr}</p>
  <p style="color: #666; font-size: 12px;">Pode também receber o cliente por WhatsApp: <a href="https://wa.me/351916350502">+351 916 350 502</a></p>
</body>
</html>
`.trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SupabaseWebhookPayload
    if (body?.type !== 'INSERT' || body?.table !== 'orders' || !body?.record) {
      return NextResponse.json({ ok: false, message: 'Ignored: not an orders INSERT' }, { status: 200 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set; cannot send new-order email')
      return NextResponse.json(
        { ok: false, message: 'Email not configured' },
        { status: 500 }
      )
    }

    const record = body.record as OrderRecord
    const subject = `Novo pedido RedVelvet: ${record.numero_pedido ?? record.id ?? 'pedido'}`

    const { error } = await resend.emails.send({
      from: NOTIFY_EMAIL_FROM,
      to: NOTIFY_EMAIL_TO,
      subject,
      html: buildOrderEmailHtml(record),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Webhook new-order error:', e)
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

// Alguns clientes fazem GET para verificar o endpoint
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Use POST with Supabase database webhook payload (INSERT on orders).',
  })
}
