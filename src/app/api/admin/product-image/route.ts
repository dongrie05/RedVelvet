import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { authorizeAdmin } from '@/lib/adminAuth'

const MAX_SIZE = 3 * 1024 * 1024
export async function POST(request: NextRequest) {
  const access = await authorizeAdmin(request)
  if ('error' in access) return NextResponse.json({ error: access.error }, { status: access.status })
  if (Number(request.headers.get('content-length') || 0) > MAX_SIZE + 65536) return NextResponse.json({ error: 'A fotografia deve ter até 3 MB.' }, { status: 413 })
  const form = await request.formData().catch(() => null)
  const id = form?.get('productId'), file = form?.get('file')
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id) || !(file instanceof File) || file.size < 12 || file.size > MAX_SIZE) return NextResponse.json({ error: 'Selecione uma fotografia válida com até 3 MB.' }, { status: 400 })
  const bytes = new Uint8Array(await file.arrayBuffer())
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  const png = [137,80,78,71,13,10,26,10].every((v, i) => bytes[i] === v)
  const webp = String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  const format = jpeg ? { extension: 'jpg', mime: 'image/jpeg' } : png ? { extension: 'png', mime: 'image/png' } : webp ? { extension: 'webp', mime: 'image/webp' } : null
  if (!format) return NextResponse.json({ error: 'Use uma fotografia JPEG, PNG ou WebP.' }, { status: 400 })
  const { data: product, error: lookupError } = await access.db.from('products').select('id').eq('id', id).maybeSingle()
  if (lookupError || !product) return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 })
  const path = `admin/${id}/${randomUUID()}.${format.extension}`
  const bucket = access.db.storage.from('products')
  const { error } = await bucket.upload(path, bytes, { contentType: format.mime, upsert: false })
  if (error) return NextResponse.json({ error: 'Não foi possível carregar a fotografia.' }, { status: 500 })
  return NextResponse.json({ url: bucket.getPublicUrl(path).data.publicUrl })
}
