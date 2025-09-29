'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Heart, Star, Share2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { Product } from '@/lib/supabase'

// Mock data - será substituído por dados reais do Supabase
const mockProduct: Product = {
  id: '1',
  codigo: 'DEC001',
  referencia: 'REF001',
  nome: 'Vela Aromática Lavanda',
  descricao: 'Vela artesanal com aroma relaxante de lavanda, perfeita para criar um ambiente acolhedor. Feita com cera de soja 100% natural e pavio de algodão, esta vela oferece uma queima limpa e duradoura. O aroma suave de lavanda ajuda a relaxar e criar uma atmosfera tranquila em qualquer espaço.',
  categoria: 'Velas',
  preco: 24.90,
  stock: 15,
  tamanhos: ['Pequena', 'Média', 'Grande'],
  imagem_url: '/images/vela-lavanda.jpg',
  iva: 23,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const mockReviews = [
  {
    id: '1',
    cliente_id: '1',
    produto_id: '1',
    rating: 5,
    comentario: 'Excelente qualidade! O aroma é muito agradável e a vela dura bastante tempo.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    cliente_id: '2',
    produto_id: '1',
    rating: 4,
    comentario: 'Muito boa, recomendo!',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function ProductPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews] = useState(mockReviews)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    // Simular carregamento do produto
    setProduct(mockProduct)
    
    // Selecionar o primeiro tamanho por padrão se existir
    if (mockProduct.tamanhos && mockProduct.tamanhos.length > 0) {
      setSelectedSize(mockProduct.tamanhos[0])
    }
  }, [params.id])

  const handleAddToCart = async () => {
    if (!product) return

    // Validar se um tamanho foi selecionado quando necessário
    if (product.tamanhos && product.tamanhos.length > 0 && !selectedSize) {
      alert('Por favor, selecione um tamanho antes de adicionar ao carrinho.')
      return
    }

    setIsAddingToCart(true)
    
    // Simular delay de adição ao carrinho
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addToCart({
      produto_id: product.id,
      nome: product.nome,
      preco: product.preco,
      quantidade: quantity,
      tamanho: selectedSize || undefined,
      imagem_url: product.imagem_url
    })
    
    setIsAddingToCart(false)
    
    // Mostrar feedback de sucesso
    alert('Produto adicionado ao carrinho!')
  }

  const handleToggleWishlist = () => {
    if (!product) return
    toggleWishlist(product)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.nome,
          text: product?.descricao,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Erro ao partilhar:', err)
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copiado para a área de transferência!')
      } catch (err) {
        console.log('Erro ao copiar link:', err)
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-redvelvet-500 mx-auto mb-4"></div>
          <p className="text-redvelvet-600">A carregar produto...</p>
        </div>
      </div>
    )
  }

  // Generate breadcrumbs for product page
  const getBreadcrumbs = () => {
    return [
      { label: 'Início', href: '/' },
      { label: 'Loja', href: '/shop' },
      { label: product.categoria, href: `/shop?category=${product.categoria.toLowerCase()}` },
      { label: product.nome }
    ]
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container-luxury py-8">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={getBreadcrumbs()} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-none overflow-hidden shadow-luxury">
              {product.imagem_url ? (
                <Image
                  src={product.imagem_url}
                  alt={product.nome}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-cream-200 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-redvelvet-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Heart size={24} className="text-redvelvet-500" />
                    </div>
                    <span className="text-redvelvet-500 text-sm font-medium">Sem imagem</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Additional images placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`aspect-square bg-cream-200 rounded-none cursor-pointer border-2 ${
                    selectedImage === i - 1 ? 'border-redvelvet-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(i - 1)}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-redvelvet-400">Img {i}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-redvelvet-500 font-medium uppercase tracking-wide">
                {product.categoria}
              </span>
              <span className="text-redvelvet-400">•</span>
              <span className="text-sm text-redvelvet-600">Código: {product.codigo}</span>
            </div>

            {/* Product Name */}
            <h1 className="heading-luxury text-3xl lg:text-4xl">{product.nome}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length} avaliações)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-redvelvet-500">
                {formatPrice(product.preco)}
              </div>
              <div className="text-sm text-redvelvet-600">
                IVA incluído • Envio grátis a partir de €50
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-luxury leading-relaxed">{product.descricao}</p>
            </div>

            {/* Size Selection */}
            {product.tamanhos && product.tamanhos.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-redvelvet-900">
                  Tamanho
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.tamanhos.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-none text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-redvelvet-500 bg-redvelvet-500 text-white'
                          : 'border-redvelvet-300 text-redvelvet-700 hover:border-redvelvet-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-redvelvet-900">
                Quantidade
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-redvelvet-300 rounded-none hover:bg-redvelvet-50 transition-colors"
                >
                  <Minus size={16} className="text-redvelvet-600" />
                </button>
                <span className="px-4 py-2 border border-redvelvet-300 rounded-none min-w-[60px] text-center text-redvelvet-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 border border-redvelvet-300 rounded-none hover:bg-redvelvet-50 transition-colors"
                >
                  <Plus size={16} className="text-redvelvet-600" />
                </button>
              </div>
            </div>

            {/* Stock Info */}
            <div className="text-sm">
              {product.stock > 0 ? (
                <span className="text-green-600">
                  ✓ {product.stock} unidades em stock
                </span>
              ) : (
                <span className="text-red-600">✗ Esgotado</span>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-none font-medium transition-colors ${
                  product.stock === 0 || isAddingToCart
                    ? 'bg-redvelvet-300 text-redvelvet-500 cursor-not-allowed'
                    : 'bg-redvelvet-500 hover:bg-redvelvet-600 text-white'
                }`}
              >
                <ShoppingCart size={20} />
                <span>
                  {isAddingToCart ? 'A adicionar...' : 'Adicionar ao Carrinho'}
                </span>
              </button>

              <div className="flex space-x-4">
                <button 
                  onClick={handleToggleWishlist}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 border rounded-none transition-colors ${
                    isInWishlist(product.id)
                      ? 'bg-redvelvet-500 border-redvelvet-500 text-white'
                      : 'border-redvelvet-300 text-redvelvet-700 hover:bg-redvelvet-50'
                  }`}
                >
                  <Heart 
                    size={20} 
                    className={isInWishlist(product.id) ? 'fill-current' : ''} 
                  />
                  <span>{isInWishlist(product.id) ? 'Nos Favoritos' : 'Favoritos'}</span>
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 border border-redvelvet-300 rounded-none text-redvelvet-700 hover:bg-redvelvet-50 transition-colors"
                >
                  <Share2 size={20} />
                  <span>Partilhar</span>
                </button>
              </div>
            </div>

            {/* Back button */}
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 text-redvelvet-500 hover:text-redvelvet-600 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Voltar à Loja</span>
            </Link>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="heading-luxury text-2xl lg:text-3xl mb-8">Avaliações</h2>
          
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="card-luxury p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-redvelvet-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-redvelvet-600">
                      {new Date(review.created_at).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                  {review.comentario && (
                    <p className="text-luxury">{review.comentario}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-redvelvet-600">Ainda não há avaliações para este produto.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
