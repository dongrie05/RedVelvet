'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CreditCard, Smartphone, Lock } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { CheckoutForm } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const [formData, setFormData] = useState<CheckoutForm>({
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    endereco: user?.endereco || '',
    cidade: '',
    codigo_postal: '',
    pais: 'Portugal',
    metodo_pagamento: 'card'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof CheckoutForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {}

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório'
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório'
    if (!formData.endereco.trim()) newErrors.endereco = 'Morada é obrigatória'
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória'
    if (!formData.codigo_postal.trim()) newErrors.codigo_postal = 'Código postal é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular sucesso do pagamento
      alert('Pedido realizado com sucesso!')
      
      // Limpar carrinho e redirecionar
      clearCart()
      router.push('/account/orders')
    } catch {
      alert('Erro ao processar o pagamento. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Carrinho vazio
          </h1>
          <p className="text-gray-600 mb-8">
            Adicione produtos ao carrinho antes de finalizar a compra.
          </p>
          <Link href="/shop" className="btn-primary">
            Ir para a Loja
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft size={16} />
            <span>Voltar ao Carrinho</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Billing Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Informações de Faturação
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className={`input-field ${errors.nome ? 'border-red-500' : ''}`}
                    placeholder="O seu nome completo"
                  />
                  {errors.nome && (
                    <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className={`input-field ${errors.telefone ? 'border-red-500' : ''}`}
                    placeholder="+351 XXX XXX XXX"
                  />
                  {errors.telefone && (
                    <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <select
                    name="pais"
                    value={formData.pais}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="Portugal">Portugal</option>
                    <option value="Espanha">Espanha</option>
                    <option value="França">França</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Morada *
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    className={`input-field ${errors.endereco ? 'border-red-500' : ''}`}
                    placeholder="Rua, número, andar"
                  />
                  {errors.endereco && (
                    <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    className={`input-field ${errors.cidade ? 'border-red-500' : ''}`}
                    placeholder="Lisboa"
                  />
                  {errors.cidade && (
                    <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    name="codigo_postal"
                    value={formData.codigo_postal}
                    onChange={handleInputChange}
                    className={`input-field ${errors.codigo_postal ? 'border-red-500' : ''}`}
                    placeholder="1000-000"
                  />
                  {errors.codigo_postal && (
                    <p className="text-red-500 text-sm mt-1">{errors.codigo_postal}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Método de Pagamento
              </h2>

              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="metodo_pagamento"
                    value="card"
                    checked={formData.metodo_pagamento === 'card'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <CreditCard size={20} className="mr-3 text-gray-600" />
                  <div>
                    <div className="font-medium">Cartão de Crédito/Débito</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="metodo_pagamento"
                    value="mbway"
                    checked={formData.metodo_pagamento === 'mbway'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <Smartphone size={20} className="mr-3 text-gray-600" />
                  <div>
                    <div className="font-medium">MB Way</div>
                    <div className="text-sm text-gray-600">Pagamento rápido e seguro</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="metodo_pagamento"
                    value="apple_pay"
                    checked={formData.metodo_pagamento === 'apple_pay'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="mr-3 text-gray-600">🍎</div>
                  <div>
                    <div className="font-medium">Apple Pay</div>
                    <div className="text-sm text-gray-600">Pagamento com Touch ID ou Face ID</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="metodo_pagamento"
                    value="google_pay"
                    checked={formData.metodo_pagamento === 'google_pay'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="mr-3 text-gray-600">📱</div>
                  <div>
                    <div className="font-medium">Google Pay</div>
                    <div className="text-sm text-gray-600">Pagamento rápido e seguro</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Resumo do Pedido
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imagem_url ? (
                        <Image
                          src={item.imagem_url}
                          alt={item.nome}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-gray-400">Img</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.nome}
                      </p>
                      {item.tamanho && (
                        <p className="text-xs text-gray-600">Tamanho: {item.tamanho}</p>
                      )}
                      <p className="text-xs text-gray-600">Qtd: {item.quantidade}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(item.preco * item.quantidade)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                </div>
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
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(cart.total)}</span>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Lock size={16} className="text-green-600" />
                  <span>Pagamento 100% seguro</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Lock size={16} className="text-green-600" />
                  <span>Dados protegidos com SSL</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Lock size={16} className="text-green-600" />
                  <span>Devoluções gratuitas</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full mt-6 py-3 px-6 rounded-lg font-medium transition-colors ${
                  isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {isProcessing ? 'A processar...' : `Efetuar Pedido - ${formatPrice(cart.total)}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
