import { NextResponse } from 'next/server'
import { syncOrderWithMollie } from '@/lib/orders'

export const dynamic = 'force-dynamic'

// A Mollie envia `id=tr_xxx` (form-urlencoded). Nunca confiamos no corpo:
// o estado é sempre lido diretamente da API da Mollie.
export async function POST(req: Request) {
  let id = ''
  try {
    const form = await req.formData()
    id = String(form.get('id') || '')
  } catch {}
  if (!/^tr_[A-Za-z0-9]+$/.test(id)) return new NextResponse('bad request', { status: 400 })
  try {
    await syncOrderWithMollie(id)
    return new NextResponse('ok')
  } catch (e) {
    console.error('Webhook Mollie', e)
    return new NextResponse('error', { status: 500 }) // Mollie volta a tentar
  }
}
