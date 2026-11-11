import 'server-only'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { getMollie } from '@/lib/mollie'

/**
 * Sincroniza o estado de uma encomenda com o pagamento Mollie.
 * Idempotente: pode ser chamado pelo webhook e pela página de sucesso.
 */
export async function syncOrderWithMollie(paymentId: string) {
  const supabase = getSupabaseAdmin()
  const payment = await getMollie().payments.get(paymentId)
  const orderId = (payment.metadata as { order_id?: string } | null)?.order_id
  if (!orderId) return null

  const { data: order } = await supabase
    .from('orders').select('id, status, lista_produtos').eq('id', orderId).single()
  if (!order) return null

  const map: Record<string, string> = {
    paid: 'paid', authorized: 'paid', failed: 'cancelled', canceled: 'cancelled', expired: 'cancelled',
    open: 'pending', pending: 'pending',
  }
  const next = map[payment.status] || 'pending'

  // Só avança estados — nunca volta atrás de 'paid'/'shipped'/'delivered'
  if (['paid', 'shipped', 'delivered'].includes(order.status) || order.status === next) return order.status

  if (next === 'paid') {
    // Marca como paga de forma atómica (evita descontar stock duas vezes)
    const { data: updated } = await supabase
      .from('orders')
      .update({ status: 'paid', data_pagamento: new Date().toISOString(), metodo_pagamento: payment.method ?? null })
      .eq('id', orderId).neq('status', 'paid').select('id')
    if (updated && updated.length > 0) {
      for (const line of (order.lista_produtos as { produto_id: string; quantidade: number }[]) || []) {
        const { error } = await supabase.rpc('decrement_stock', { p_id: line.produto_id, p_qty: line.quantidade })
        if (error) console.error('Falha a descontar stock', line.produto_id, error)
      }
    }
    return 'paid'
  }

  await supabase.from('orders').update({ status: next }).eq('id', orderId).eq('status', order.status)
  return next
}
