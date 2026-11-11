import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { syncOrderWithMollie } from '@/lib/orders'

export const dynamic = 'force-dynamic'

// Estado da encomenda para a página de sucesso. Requer o token secreto da encomenda.
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const token = new URL(req.url).searchParams.get('t') || ''
  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[0-9a-f-]{36}$/i.test(token)) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  const supabase = getSupabaseAdmin()
  const { data: order } = await supabase
    .from('orders')
    .select('id, numero_pedido, status, total, subtotal, custo_envio, lista_produtos, mollie_payment_id, email_cliente')
    .eq('id', id).eq('access_token', token).single()
  if (!order) return NextResponse.json({ error: 'not found' }, { status: 404 })

  let status = order.status
  if (status === 'pending' && order.mollie_payment_id) {
    try { status = (await syncOrderWithMollie(order.mollie_payment_id)) || status } catch (e) { console.error(e) }
  }
  const { mollie_payment_id: _omit, ...pub } = order
  return NextResponse.json({ ...pub, status })
}
