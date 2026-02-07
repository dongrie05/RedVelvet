'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [isClearing, setIsClearing] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    setIsUpdating(itemId)
    
    // Simular delay de atualização
    await new Promise(resolve => setTimeout(resolve, 300))
    
    updateQuantity(itemId, newQuantity)
    setIsUpdating(null)
  }

  const handleRemoveItem = async (itemId: string) => {
    setIsUpdating(itemId)
    
    // Simular delay de remoção
    await new Promise(resolve => setTimeout(resolve, 300))
    
    removeFromCart(itemId)
    setIsUpdating(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-16">
          <div className="text-center">
            <div className="mb-8">
              <ShoppingBag size={64} className="text-gray-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                O seu carrinho está vazio
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Adicione alguns produtos para começar a sua compra
              </p>
            </div>
            
            <Link
              href="/shop"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Continuar a Comprar</span>
              <ArrowLeft size={20} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Carrinho</h1>
          <p className="text-lg text-gray-600">
            {cart.items.length} {cart.items.length === 1 ? 'produto' : 'produtos'} no seu carrinho
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.imagem_url ? (
                      <Image
                        src={item.imagem_url}
                        alt={item.nome}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-gray-400">Sem imagem</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {item.nome}
                    </h3>
                    {item.tamanho && (
                      <p className="text-sm text-gray-600 mb-2">
                        Tamanho: <span className="font-medium text-gray-800">{item.tamanho}</span>
                      </p>
                    )}
                    <p className="text-lg font-semibold text-primary-600">
                      {formatPrice(item.preco)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantidade - 1)}
                        disabled={isUpdating === item.id || item.quantidade <= 1}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 min-w-[60px] text-center">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantidade + 1)}
                        disabled={isUpdating === item.id}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isUpdating === item.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal do item:</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(item.preco * item.quantidade)}
                  </span>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="text-center pt-4">
              <button
                onClick={async () => { setIsClearing(true); await clearCart(); setIsClearing(false) }}
                disabled={isClearing}
                className={`text-red-600 hover:text-red-700 text-sm font-medium ${isClearing ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isClearing ? 'A limpar…' : 'Limpar carrinho'}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Portes de Envio</span>
                  <span className="font-medium">
                    {cart.shipping === 0 ? (
                      <span className="text-green-600">Grátis</span>
                    ) : (
                      formatPrice(cart.shipping)
                    )}
                  </span>
                </div>

                {/* Shipping Info */}
                {cart.shipping > 0 && (
                  <div className="text-sm text-gray-500">
                    <p>Envio grátis a partir de €50</p>
                    <p className="text-green-600">
                      Faltam {formatPrice(50 - cart.subtotal)} para envio grátis
                    </p>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Total */}
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(cart.total)}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={async () => {
                    setIsCheckingOut(true)
                    try {
                      const res = await fetch('/api/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          userId: user?.id,
                          items: cart.items.map(i => ({
                            produto_id: i.produto_id,
                            nome: i.nome,
                            preco: i.preco,
                            quantidade: i.quantidade,
                            tamanho: i.tamanho
                          }))
                        })
                      })
                      const data = await res.json()
                      if (data?.url) window.location.href = data.url
                      else alert('Não foi possível iniciar o pagamento. Tente novamente.')
                    } catch (err) {
                      console.error(err)
                      alert('Erro ao iniciar pagamento')
                    } finally {
                      setIsCheckingOut(false)
                    }
                  }}
                  disabled={isCheckingOut}
                  className="w-full btn-primary text-center block py-3"
                >
                  {isCheckingOut ? 'A finalizar…' : 'Finalizar Compra'}
                </button>

                {/* Continue Shopping */}
                <Link
                  href="/shop"
                  className="w-full btn-secondary text-center block py-3"
                >
                  Continuar a Comprar
                </Link>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Envio rápido</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Devoluções gratuitas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
