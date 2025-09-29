import { NextRequest, NextResponse } from 'next/server'
import { mollie } from '@/lib/mollie'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Mollie posts as application/x-www-form-urlencoded and sends payment id in "id"
    const form = await req.formData()
    const paymentId = form.get('id') as string
    if (!paymentId) return NextResponse.json({ ok: false }, { status: 400 })

    const payment = await (mollie as any).payments.get(paymentId)
    const metadata = (payment as any)?.metadata || {}

    const status: string = (payment as any)?.status
    const amountValue = (payment as any)?.amount?.value

    // Idempotency: ensure we do not create duplicate orders
    const numeroPedido = paymentId

    if (status === 'paid') {
      // Ensure we have a customer for the user
      let clienteId: string | null = null
      if (metadata.userId) {
        const { data: customer } = await supabaseAdmin
          .from('customers')
          .select('id')
          .eq('user_id', metadata.userId)
          .single()
        clienteId = customer?.id || null
      }

      // Create order record
      const { error: insertErr } = await supabaseAdmin
        .from('orders')
        .insert({
          cliente_id: clienteId,
          numero_pedido: numeroPedido,
          lista_produtos: metadata.items || [],
          subtotal: metadata.subtotal ?? null,
          custo_envio: metadata.shippingCost ?? 0,
          total: amountValue ? Number(amountValue) : metadata.total ?? null,
          status: 'paid',
          metodo_pagamento: 'mollie',
          data_pagamento: new Date().toISOString(),
        })

      if (insertErr) {
        // Log but continue 200 to avoid repeated retries storms
        console.error('orders insert error', insertErr)
      }

      // Clear cart if we can identify it
      if (clienteId) {
        // Find cart id
        const { data: cart } = await supabaseAdmin
          .from('carts')
          .select('id')
          .eq('cliente_id', clienteId)
          .single()
        if (cart?.id) {
          await supabaseAdmin.from('cart_items').delete().eq('cart_id', cart.id)
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Mollie webhook error', e)
    // Mollie expects 200 for handled; 5xx will retry later
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}


