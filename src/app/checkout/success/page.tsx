'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '351916350502'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

function CheckoutSuccessContent() {
  useSearchParams()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    // Limpar carrinho local sempre que chegar à página de sucesso.
    // As orders oficiais são criadas pelo webhook da Mollie.
    try {
      localStorage.removeItem('redvelvet_cart')
    } catch {}
    setOk(true)
  }, [])

  const whatsappMessage = encodeURIComponent(
    'Olá! Acabei de fazer uma compra na RedVelvet e gostaria de confirmar ou esclarecer algo sobre o meu pedido.'
  )
  const whatsappLink = `${WHATSAPP_URL}?text=${whatsappMessage}`

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-redvelvet-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container-luxury py-16 text-center">
        <h1 className="heading-luxury text-3xl mb-4">Pagamento concluído</h1>
        <p className="text-redvelvet-700 mb-8">Obrigado pela sua compra! Em breve receberá um email com os detalhes do pedido.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium rounded-none transition-colors"
          >
            <MessageCircle size={20} />
            <span>Enviar mensagem no WhatsApp</span>
          </a>
          <Link href="/shop" className="btn-primary">Voltar à loja</Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">A carregar...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}


