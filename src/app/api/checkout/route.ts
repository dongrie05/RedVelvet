import { NextRequest, NextResponse } from 'next/server'
import { mollie } from '@/lib/mollie'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, items } = body as { userId?: string, items: Array<{ produto_id: string, nome: string, preco: number, quantidade: number, tamanho?: string }>} 

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'SEM_ITENS' }, { status: 400 })
    }

    const subtotal = items.reduce((sum, it) => sum + (it.preco * it.quantidade), 0)
    const shippingCost = subtotal >= 50 ? 0 : subtotal >= 25 ? 3.50 : 5.90
    const total = subtotal + shippingCost

    const description = items.length === 1
      ? `${items[0].nome} x${items[0].quantidade}`
      : `RedVelvet - ${items.length} itens`

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Do not force a payment method; Mollie Hosted Checkout will show all enabled methods
    const payment = await (mollie as any).payments.create({
      amount: { currency: 'EUR', value: total.toFixed(2) },
      description,
      redirectUrl: `${origin}/checkout/success`,
      webhookUrl: `${origin}/api/payments/mollie/webhook`,
      locale: 'pt_PT',
      metadata: {
        userId: userId || null,
        items,
        shippingCost,
        subtotal,
        total,
      }
    })

    const url = (payment as any)?._links?.checkout?.href
    if (!url) return NextResponse.json({ error: 'SEM_URL_CHECKOUT' }, { status: 500 })

    return NextResponse.json({ id: (payment as any).id, url })
  } catch (e) {
    console.error('checkout error (mollie)', e)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}


