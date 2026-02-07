'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingCart } from 'lucide-react'
import { Product } from '@/lib/supabase'
import { useCart } from '@/hooks/useCart'

interface WishlistItemCardProps {
  product: Product
  onRemove: (productId: string) => void
}

export default function WishlistItemCard({ product, onRemove }: WishlistItemCardProps) {
  const { addToCart } = useCart()

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price)

  const handleAddToCart = () => {
    addToCart({
      produto_id: product.id,
      nome: product.nome,
      preco: product.preco,
      quantidade: 1,
      imagem_url: product.imagem_url
    })
  }

  return (
    <div className="group border border-redvelvet-100 bg-white hover:border-redvelvet-200 transition-colors duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-[120px,1fr,auto] gap-4 p-4 items-center">
        {/* Thumbnail */}
        <div className="relative h-40 sm:h-24 sm:w-24 bg-gradient-to-br from-cream-50 to-cream-100 border border-redvelvet-100">
          {product.imagem_url ? (
            <Image
              src={product.imagem_url}
              alt={product.nome}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-redvelvet-500 text-sm">Sem imagem</span>
            </div>
          )}

          {/* Remove */}
          <button
            onClick={() => onRemove(product.id)}
            className="absolute top-1 right-1 p-1.5 bg-white/95 border border-redvelvet-200 hover:bg-redvelvet-500 hover:text-white hover:border-redvelvet-500 transition-colors"
            aria-label="Remover"
          >
            <X size={14} />
          </button>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-redvelvet-500 uppercase tracking-widest">{product.categoria}</span>
            <span className="w-1 h-1 bg-redvelvet-300 rounded-full" />
            <span className="text-xs text-redvelvet-400">{product.codigo}</span>
          </div>
          <h3 className="heading-luxury text-lg leading-snug">{product.nome}</h3>
          <p className="text-redvelvet-600 text-sm line-clamp-2">{product.descricao}</p>
          <div className="text-redvelvet-500 font-bold">{formatPrice(product.preco)}</div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 sm:justify-center">
          <button
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-redvelvet-500 hover:bg-redvelvet-600 text-white text-xs uppercase tracking-wider border border-redvelvet-500"
          >
            <ShoppingCart size={14} />
            <span>Adicionar</span>
          </button>
          <Link
            href={`/product/${product.id}`}
            className="inline-flex items-center justify-center px-3 py-2 border text-redvelvet-600 border-redvelvet-300 hover:bg-redvelvet-50 text-xs uppercase tracking-wider"
          >
            Ver produto
          </Link>
        </div>
      </div>
    </div>
  )
}


