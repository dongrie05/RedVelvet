import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { authorizeAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const access = await authorizeAdmin(request)
  if ('error' in access) return NextResponse.json({ error: access.error }, { status: access.status })
  const { data, error } = await access.db.from('products').select('id,codigo,referencia,nome,categoria,preco,stock').order('nome')
  if (error) return NextResponse.json({ error: 'Não foi possível obter os produtos.' }, { status: 500 })
  return NextResponse.json({ data }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function PATCH(request: NextRequest) {
  const access = await authorizeAdmin(request)
  if ('error' in access) return NextResponse.json({ error: access.error }, { status: access.status })
  const body = await request.json().catch(() => null)
  if (!body || typeof body.id !== 'string' || !Number.isSafeInteger(body.stock) || body.stock < 0 || body.stock > 1000000 || !Number.isSafeInteger(body.previousStock) || body.previousStock < 0) {
    return NextResponse.json({ error: 'Quantidade inválida.' }, { status: 400 })
  }
  const { data, error } = await access.db.from('products').update({ stock: body.stock }).eq('id', body.id).eq('stock', body.previousStock).select('id,stock').maybeSingle()
  if (error) return NextResponse.json({ error: 'Não foi possível atualizar o stock.' }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'O stock foi alterado entretanto. Atualize a lista e tente novamente.' }, { status: 409 })
  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/product/[id]', 'page')
  return NextResponse.json({ data })
}
