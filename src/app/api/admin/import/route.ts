import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { ImportProduct, validateImportData } from '@/utils/importProducts'

export const dynamic = 'force-dynamic'

function authorized(req: Request) {
  const expected = process.env.ADMIN_SECRET || ''
  const got = req.headers.get('x-admin-secret') || ''
  if (expected.length < 12 || got.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(got), Buffer.from(expected))
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const products: ImportProduct[] = Array.isArray(body?.products) ? body.products : []
  const errors = validateImportData(products)
  if (errors.length) return NextResponse.json({ error: errors.join('; ') }, { status: 400 })

  const rows = products.map((p) => ({
    codigo: p.codigo.trim(), referencia: p.referencia.trim(), nome: p.descricao.trim(),
    descricao: p.descricao.trim(), categoria: p.familia.trim(), preco: p.preco,
    stock: 0, tamanhos: null, imagem_url: null, iva: p.iva || 23,
  }))
  const { data, error } = await getSupabaseAdmin().from('products').insert(rows).select('id')
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ imported: data?.length || 0 })
}
