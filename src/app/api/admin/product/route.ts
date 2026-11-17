import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { authorizeAdmin } from '@/lib/adminAuth'

export async function PATCH(request: NextRequest) {
  const access = await authorizeAdmin(request)
  if ('error' in access) return NextResponse.json({ error: access.error }, { status: access.status })
  const p = await request.json().catch(() => null)
  const validUrl = (s: unknown) => typeof s === 'string' && s.length <= 2048 && (s.startsWith('/images/') || /^https?:\/\//i.test(s))
  if (!p || typeof p.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(p.id) || typeof p.updated_at !== 'string' || typeof p.nome !== 'string' || !p.nome.trim() || p.nome.trim().length > 255 || typeof p.descricao !== 'string' || p.descricao.length > 10000 || typeof p.categoria !== 'string' || !p.categoria.trim() || p.categoria.trim().length > 100 || typeof p.preco !== 'number' || !Number.isFinite(p.preco) || p.preco < 0 || p.preco > 99999999 || !Array.isArray(p.tamanhos) || p.tamanhos.length > 50 || !p.tamanhos.every((t: unknown) => typeof t === 'string' && t.trim().length > 0 && t.trim().length <= 30) || !Array.isArray(p.images) || p.images.length > 3 || !p.images.every(validUrl) || new Set(p.images).size !== p.images.length) {
    return NextResponse.json({ error: 'Verifique os dados e fotografias do produto.' }, { status: 400 })
  }
  const { data, error } = await access.db.from('products').update({ nome: p.nome.trim(), descricao: p.descricao.trim(), categoria: p.categoria.trim(), preco: p.preco, tamanhos: p.tamanhos.length ? p.tamanhos.map((t: string) => t.trim()) : null, imagem_url: p.images[0] || null, galeria: p.images.slice(1) }).eq('id', p.id).eq('updated_at', p.updated_at).select('id').maybeSingle()
  if (error) return NextResponse.json({ error: 'Não foi possível guardar o produto.' }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'O produto foi alterado entretanto. Atualize a lista e tente novamente.' }, { status: 409 })
  revalidatePath('/'); revalidatePath('/shop'); revalidatePath('/product/[id]', 'page')
  return NextResponse.json({ success: true })
}
