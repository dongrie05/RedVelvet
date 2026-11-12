import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { authorizeAdmin } from '@/lib/adminAuth'

export async function POST(request: NextRequest) {
  const access = await authorizeAdmin(request)
  if ('error' in access) return NextResponse.json({ error: access.error }, { status: access.status })
  const body = await request.json().catch(() => null)
  if (!Array.isArray(body?.products) || body.products.length === 0 || body.products.length > 1000) return NextResponse.json({ error: 'Lista de produtos inválida.' }, { status: 400 })
  const codes = new Set<string>()
  for (const p of body.products) {
    if (!p || typeof p.codigo !== 'string' || !p.codigo.trim() || p.codigo.length > 50 || codes.has(p.codigo) || typeof p.nome !== 'string' || !p.nome.trim() || p.nome.length > 255 || typeof p.referencia !== 'string' || p.referencia.length > 100 || typeof p.categoria !== 'string' || !p.categoria.trim() || p.categoria.length > 100 || typeof p.preco !== 'number' || !Number.isFinite(p.preco) || p.preco < 0 || p.preco > 99999999 || typeof p.iva !== 'number' || !Number.isFinite(p.iva) || p.iva < 0 || p.iva > 100 || !Number.isSafeInteger(p.stock) || p.stock < 0 || p.stock > 1000000) return NextResponse.json({ error: 'Dados inválidos ou códigos repetidos. Nenhuma alteração foi iniciada.' }, { status: 400 })
    codes.add(p.codigo)
  }
  const failures: string[] = []
  let created = 0, updated = 0
  for (const p of body.products) {
    const { data: existing, error: lookupError } = await access.db.from('products').select('id,stock').eq('codigo', p.codigo).maybeSingle()
    if (lookupError) { failures.push(p.codigo); continue }
    if (existing) {
      let q = access.db.from('products').update({ preco: p.preco, stock: p.stock, iva: p.iva }).eq('id', existing.id)
      q = existing.stock === null ? q.is('stock', null) : q.eq('stock', existing.stock)
      const { data, error } = await q.select('id').maybeSingle()
      if (error || !data) failures.push(p.codigo); else updated++
    } else {
      const { error } = await access.db.from('products').insert({ codigo: p.codigo, nome: p.nome, descricao: p.nome, referencia: p.referencia || p.codigo, categoria: p.categoria, preco: p.preco, iva: p.iva, stock: p.stock })
      if (error) failures.push(p.codigo); else created++
    }
  }
  if (created || updated) { revalidatePath('/'); revalidatePath('/shop'); revalidatePath('/product/[id]', 'page') }
  return NextResponse.json({ created, updated, failures })
}
