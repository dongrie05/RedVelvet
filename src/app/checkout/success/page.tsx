'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function CheckoutSuccessContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    // Limpar carrinho local sempre que chegar à página de sucesso.
    // As orders oficiais são criadas pelo webhook da Mollie.
    try {
      localStorage.removeItem('redvelvet_cart')
    } catch {}
    setOk(true)
  }, [])

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
        <Link href="/shop" className="btn-primary">Voltar à loja</Link>
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


