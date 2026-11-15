import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { authorizeAdmin } from '@/lib/adminAuth'
import { syncOrderWithMollie } from '@/lib/orders'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const access = await authorizeAdmin(request)
  if ('error' in access) return NextResponse.json({ error: access.error }, { status: access.status })
  const { data, error, count } = await access.db.from('orders')
    .select('id,numero_pedido,status,stock_reserved,stock_reservation_version,payment_attempt_started,mollie_payment_id,created_at,total,email_cliente,nome_cliente,telefone_cliente,endereco_envio,lista_produtos', { count: 'exact' })
    .in('status', ['pending', 'payment_setup_error', 'paid_stock_issue', 'paid'])
    .order('created_at', { ascending: false }).limit(100)
  if (error) return NextResponse.json({ error: 'Não foi possível obter os pagamentos pendentes.' }, { status: 500 })
  return NextResponse.json({ data, total: count ?? data?.length ?? 0 }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: NextRequest) {
  const access = await authorizeAdmin(request)
  if ('error' in access) return NextResponse.json({ error: access.error }, { status: access.status })
  const body = await request.json().catch(() => null)
  if (!body || typeof body.orderId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.orderId) || (body.paymentId !== undefined && (typeof body.paymentId !== 'string' || !/^tr_[A-Za-z0-9]+$/.test(body.paymentId)))) return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  if (body.action && !['verify', 'cancel_unstarted', 'mark_shipped', 'resolve_stock_issue'].includes(body.action)) return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 })
  if (body.action === 'resolve_stock_issue') {
    const { error: resolveError } = await access.db.rpc('resolve_paid_stock_issue', { p_order_id: body.orderId })
    if (resolveError) return NextResponse.json({ error: 'Não foi possível atribuir stock. Confirme as quantidades e volte a tentar.' }, { status: 409 })
    revalidatePath('/'); revalidatePath('/shop'); revalidatePath('/product/[id]', 'page')
    return NextResponse.json({ status: 'paid' })
  }
  if (body.action === 'mark_shipped') {
    const { data: shipped, error: shipError } = await access.db.from('orders')
      .update({ status: 'shipped', data_envio: new Date().toISOString() }).eq('id', body.orderId)
      .eq('status', 'paid').select('id').maybeSingle()
    if (shipError) return NextResponse.json({ error: 'Não foi possível atualizar a encomenda.' }, { status: 500 })
    if (!shipped) return NextResponse.json({ error: 'A encomenda já foi alterada. Atualize a lista.' }, { status: 409 })
    return NextResponse.json({ status: 'shipped' })
  }
  if (body.action === 'cancel_unstarted') {
    const { error: cancelError } = await access.db.rpc('cancel_unstarted_checkout', { p_order_id: body.orderId })
    if (cancelError) return NextResponse.json({ error: 'Não foi possível libertar a reserva: o pagamento pode já ter sido iniciado. Verifique na Mollie.' }, { status: 409 })
    revalidatePath('/'); revalidatePath('/shop'); revalidatePath('/product/[id]', 'page')
    return NextResponse.json({ status: 'cancelled' })
  }
  const { data: order, error } = await access.db.from('orders').select('mollie_payment_id').eq('id', body.orderId).maybeSingle()
  if (error || !order) return NextResponse.json({ error: 'Encomenda não encontrada.' }, { status: 404 })
  const paymentId = body.paymentId || order.mollie_payment_id
  if (!paymentId) return NextResponse.json({ error: 'Indique o identificador do pagamento na Mollie para verificar esta encomenda.' }, { status: 400 })
  try {
    const status = await syncOrderWithMollie(paymentId, body.orderId)
    if (!status) return NextResponse.json({ error: 'O pagamento não identifica uma encomenda.' }, { status: 400 })
    return NextResponse.json({ status })
  } catch (e) {
    console.error('Erro na verificação do pagamento', e)
    return NextResponse.json({ error: 'Não foi possível verificar o pagamento. Confirme o identificador na Mollie.' }, { status: 502 })
  }
}
