import 'server-only'
import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { getMollie } from '@/lib/mollie'

/** Confirma o pagamento na Mollie e aplica a transição e o stock numa só transação. */
export async function syncOrderWithMollie(paymentId: string, expectedOrderId?: string) {
  const supabase = getSupabaseAdmin()
  const payment = await getMollie().payments.get(paymentId)
  const orderId = (payment.metadata as { order_id?: string } | null)?.order_id
  if (!orderId) return null
  if (expectedOrderId && orderId !== expectedOrderId) throw new Error('Pagamento não corresponde à encomenda')
  const { data: order, error: orderError } = await supabase.from('orders')
    .select('id,total,mollie_payment_id').eq('id', orderId).maybeSingle()
  if (orderError) throw orderError
  if (!order) throw new Error('Encomenda do pagamento não encontrada')
  if (order.mollie_payment_id && order.mollie_payment_id !== paymentId) throw new Error('Pagamento não corresponde à encomenda')
  if (payment.amount.currency !== 'EUR' || Number(payment.amount.value).toFixed(2) !== Number(order.total).toFixed(2)) throw new Error('Valor do pagamento não corresponde à encomenda')
  const { data, error } = await supabase.rpc('apply_checkout_payment', {
    p_order_id: orderId, p_payment_id: paymentId, p_status: payment.status, p_method: payment.method ?? null,
  })
  if (error) throw error
  revalidatePath('/'); revalidatePath('/shop'); revalidatePath('/product/[id]', 'page')
  return data as string
}
