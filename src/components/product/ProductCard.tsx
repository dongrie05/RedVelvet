'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Product } from '@/lib/supabase'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [selectedSize, setSelectedSize] = useState<string>('')

  useEffect(() => {
    if (Array.isArray(product.tamanhos) && product.tamanhos.length > 0) {
      setSelectedSize(product.tamanhos[0])
    } else {
      setSelectedSize('')
    }
  }, [product.tamanhos])

  const handleAddToCart = () => {
    console.log('Adding to cart:', product.nome)
    if (Array.isArray(product.tamanhos) && product.tamanhos.length > 0 && !selectedSize) {
      alert('Selecione um tamanho antes de adicionar ao carrinho.')
      return
    }
    addToCart({
      produto_id: product.id,
      nome: product.nome,
      preco: product.preco,
      quantidade: 1,
      tamanho: selectedSize || undefined,
      imagem_url: product.imagem_url
    })
    // notify header to bump badge immediately (optimistic)
    try {
      // fly to cart animation
      const card = document.querySelector(`[data-prod='${product.id}']`) as HTMLElement | null
      const cart = document.getElementById('cart-badge') || document.getElementById('cart-icon')
      const imgEl = card?.querySelector('img') as HTMLImageElement | null
      if (card && cart) {
        const rect = (imgEl || card).getBoundingClientRect()
        const cartRect = cart.getBoundingClientRect()
        const srcCx = rect.left + rect.width / 2
        const srcCy = rect.top + rect.height / 2
        const dstCx = cartRect.left + cartRect.width / 2
        const dstCy = cartRect.top + cartRect.height / 2
        const size = Math.max(14, Math.min(28, rect.width * 0.15))
        const clone = document.createElement('div')
        clone.style.position = 'fixed'
        clone.style.left = srcCx - size / 2 + 'px'
        clone.style.top = srcCy - size / 2 + 'px'
        clone.style.width = size + 'px'
        clone.style.height = size + 'px'
        clone.style.borderRadius = '9999px'
        clone.style.background = '#C41E3A33'
        clone.style.border = '1px solid #C41E3A'
        clone.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)'
        clone.style.zIndex = '9999'
        clone.style.pointerEvents = 'none'
        clone.style.transition = 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 650ms'
        clone.style.transformOrigin = 'center'
        document.body.appendChild(clone)
        const dx = dstCx - srcCx
        const dy = dstCy - srcCy
        requestAnimationFrame(() => {
          clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.2)`
          clone.style.opacity = '0.1'
        })
        setTimeout(() => { clone.remove(); window.dispatchEvent(new Event('cart:added')) }, 700)
      } else {
        window.dispatchEvent(new Event('cart:added'))
      }
    } catch (_) {}
    
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  return (
    <Link href={`/product/${product.id}`} className="block" data-prod={product.id}>
      <div className="group bg-white border border-redvelvet-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-redvelvet-200 hover:-translate-y-2 relative cursor-pointer" data-prod={product.id}>
        {/* Product Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100">
        {product.imagem_url ? (
          <Image
            src={product.imagem_url}
            alt={product.nome}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 w-8 h-8 border border-redvelvet-300 rotate-45"></div>
              <div className="absolute top-12 right-8 w-6 h-6 border border-redvelvet-300 rotate-12"></div>
              <div className="absolute bottom-8 left-8 w-10 h-10 border border-redvelvet-300 rotate-45"></div>
              <div className="absolute bottom-16 right-4 w-4 h-4 border border-redvelvet-300 rotate-12"></div>
            </div>
            <div className="text-center space-y-3 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-redvelvet-100 to-redvelvet-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Heart size={28} className="text-redvelvet-500" />
              </div>
              <span className="text-redvelvet-600 text-sm font-medium tracking-wide">Imagem em breve</span>
            </div>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* No intrusive toast; badge animates instead */}
        
        {/* Wishlist button */}
        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-4 right-4 p-3 backdrop-blur-md border rounded-full transition-all duration-300 ${
            isInWishlist(product.id)
              ? 'bg-redvelvet-500 border-redvelvet-500 hover:bg-redvelvet-600 shadow-lg'
              : 'bg-white/80 border-redvelvet-200 hover:bg-white hover:shadow-lg opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart 
            size={18} 
            className={`${
              isInWishlist(product.id)
                ? 'text-white fill-current'
                : 'text-redvelvet-500'
            }`} 
          />
        </button>

        {/* Category badge */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-redvelvet-700 border border-redvelvet-200 rounded-full shadow-lg">
            {product.categoria}
          </span>
        </div>

        {/* Stock indicator */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-redvelvet-900 text-white px-6 py-3 rounded-full border border-redvelvet-800 shadow-xl">
              <span className="text-sm font-semibold uppercase tracking-wider">Esgotado</span>
            </div>
          </div>
        )}


        {/* Rating stars */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full border border-redvelvet-200 shadow-lg flex items-center space-x-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-xs font-semibold text-redvelvet-700">4.5</span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-redvelvet-500 uppercase tracking-widest">
            {product.categoria}
          </span>
          <div className="w-1 h-1 bg-redvelvet-300 rounded-full"></div>
          <span className="text-xs text-redvelvet-400">
            {product.codigo}
          </span>
        </div>

        {/* Product Name */}
            <h3 className="heading-luxury text-xl mb-2 hover:text-redvelvet-500 transition-colors duration-300 line-clamp-2 group-hover:underline">
              {product.nome}
            </h3>

        {/* Description */}
        <p className="text-luxury text-sm line-clamp-2 leading-relaxed text-redvelvet-600">
          {product.descricao}
        </p>

        {/* Price Section */}
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-redvelvet-500">
              {formatPrice(product.preco)}
            </span>
          </div>
          {Array.isArray(product.tamanhos) && product.tamanhos.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-redvelvet-600">Tamanho:</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="border border-redvelvet-300 text-[11px] px-2 py-0.5 rounded-none focus:outline-none focus:border-redvelvet-500 bg-white min-w-20"
              >
                {product.tamanhos.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Stock indicator */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-redvelvet-500 text-xs font-semibold uppercase tracking-wider">
              ⚡ Apenas {product.stock} em stock
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleAddToCart()
          }}
          disabled={product.stock === 0}
          className={`group flex items-center justify-center space-x-3 py-3 px-6 rounded-none transition-all duration-300 uppercase tracking-wider text-sm font-semibold w-full ${
            product.stock === 0
              ? 'bg-redvelvet-200 text-redvelvet-400 cursor-not-allowed border border-redvelvet-200'
              : 'bg-redvelvet-500 hover:bg-redvelvet-600 text-white border border-redvelvet-500 hover:border-redvelvet-600 hover:shadow-lg'
          }`}
        >
          <ShoppingCart size={16} className="group-hover:scale-110 transition-transform duration-300" />
          <span>
            {product.stock === 0 ? 'Esgotado' : 'Adicionar'}
          </span>
        </button>
      </div>
    </div>
    </Link>
  )
}