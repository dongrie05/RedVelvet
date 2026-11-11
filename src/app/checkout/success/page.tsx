'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Clock, MessageCircle, XCircle } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { BUSINESS } from '@/lib/business'
import { formatPrice } from '@/lib/shop'

type OrderInfo = { numero_pedido: string; status: string; total: number; email_cliente?: string }

function CheckoutSuccessContent() {
  const params = useSearchParams()
  const orderId = params.get('order') || ''
  const token = params.get('t') || ''
  const { clearCart } = useCart()
  const [order, setOrder] = useState<OrderInfo | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!orderId || !token) { setFailed(true); return }
    let tries = 0
    let timer: ReturnType<typeof setTimeout>
    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/?t=${token}`, { cache: 'no-store' })
        if (!res.ok) throw new Error()
        const data: OrderInfo = await res.json()
        setOrder(data)
        if (data.status === 'paid') clearCart()
        // Multibanco/transferência podem ficar pendentes; voltamos a verificar uns segundos
        if (data.status === 'pending' && ++tries < 6) timer = setTimeout(poll, 2500)
      } catch {
        setFailed(true)
      }
    }
    poll()
    return () => clearTimeout(timer)
  }, [orderId, token, clearCart])

  const whatsappLink = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
    `Olá! Tenho uma questão sobre a encomenda ${order?.numero_pedido ?? ''} na RedVelvet.`
  )}`

  if (!order && !failed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-redvelvet-500" aria-label="A confirmar pagamento" />
      </div>
    )
  }

  const paid = order?.status === 'paid'
  const cancelled = order?.status === 'cancelled'

  return (
    <div className="min-h-[60vh] bg-cream-50">
      <div className="container-luxury py-16 text-center max-w-2xl">
        {paid ? (
          <>
            <CheckCircle2 size={56} className="mx-auto text-green-700 mb-6" />
            <h1 className="heading-luxury text-3xl mb-4">Obrigado pela sua encomenda!</h1>
            <p className="text-redvelvet-700 mb-2">Encomenda <strong>{order!.numero_pedido}</strong> · {formatPrice(Number(order!.total))}</p>
            <p className="text-redvelvet-700 mb-8">O pagamento foi confirmado. Vamos preparar o envio ({BUSINESS.shippingDays}).</p>
          </>
        ) : cancelled ? (
          <>
            <XCircle size={56} className="mx-auto text-red-600 mb-6" />
            <h1 className="heading-luxury text-3xl mb-4">Pagamento não concluído</h1>
            <p className="text-redvelvet-700 mb-8">O pagamento foi cancelado ou expirou. O seu carrinho continua guardado.</p>
            <Link href="/checkout" className="btn-primary">Tentar novamente</Link>
          </>
        ) : order ? (
          <>
            <Clock size={56} className="mx-auto text-redvelvet-500 mb-6" />
            <h1 className="heading-luxury text-3xl mb-4">A aguardar confirmação do pagamento</h1>
            <p className="text-redvelvet-700 mb-2">Encomenda <strong>{order.numero_pedido}</strong></p>
            <p className="text-redvelvet-700 mb-8">
              Se pagou por Multibanco, a confirmação pode demorar algumas horas. Assim que recebermos o pagamento, a encomenda segue.
            </p>
          </>
        ) : (
          <>
            <h1 className="heading-luxury text-3xl mb-4">Não encontrámos a encomenda</h1>
            <p className="text-redvelvet-700 mb-8">Se efetuou um pagamento, contacte-nos e indicamos o estado.</p>
          </>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium transition-colors">
            <MessageCircle size={20} /> <span>Falar connosco no WhatsApp</span>
          </a>
          <Link href="/shop" className="btn-secondary">Continuar a comprar</Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">A carregar...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
