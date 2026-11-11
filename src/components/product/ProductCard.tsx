'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Check, ImageIcon, Plus } from 'lucide-react'
import { Product } from '@/lib/supabase'
import { useCart } from '@/hooks/useCart'
import { formatCategoryDisplay } from '@/lib/categoryUtils'
import { formatPrice } from '@/lib/shop'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  /** Carregar a imagem com prioridade (primeiros cartões visíveis) */
  priority?: boolean
}

export default function ProductCard({ product, onAddToCart, priority = false }: ProductCardProps) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const hasSizes = Array.isArray(product.tamanhos) && product.tamanhos.length > 0
  const soldOut = product.stock <= 0
  const lowStock = !soldOut && product.stock <= 3
  const secondImage = Array.isArray(product.galeria) ? product.galeria.find(Boolean) : undefined
  const href = `/product/${product.id}`

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      produto_id: product.id,
      nome: product.nome,
      preco: product.preco,
      quantidade: 1,
      imagem_url: product.imagem_url,
    })
    onAddToCart?.(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <Link href={href} className="group block focus-visible:outline-none" data-prod={product.id}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-[#ede6de] ring-redvelvet-500 ring-offset-2 group-focus-visible:ring-2">
        {product.imagem_url ? (
          <>
            <Image
              src={product.imagem_url}
              alt={product.nome}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={`object-cover transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03] ${secondImage ? '[@media(hover:hover)]:group-hover:opacity-0' : ''} ${soldOut ? 'opacity-60 grayscale-[35%]' : ''}`}
            />
            {secondImage && (
              <Image
                src={secondImage}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#6b5a5c]/70">
            <ImageIcon size={26} />
            <span className="text-xs">Fotografia em breve</span>
          </div>
        )}

        {(soldOut || lowStock) && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${soldOut ? 'bg-[#f7efe9] text-[#1c1012]' : 'bg-redvelvet-500 text-white'}`}>
            {soldOut ? 'Esgotado' : 'Últimas unidades'}
          </span>
        )}

        {!soldOut && (
          <>
            {/* Desktop: pill no hover */}
            <span className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition-all duration-300 [@media(hover:hover)]:block group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              {hasSizes ? (
                <span className="flex h-11 items-center justify-center rounded-full bg-[#f7efe9]/95 text-sm font-medium text-[#1c1012] backdrop-blur-md">
                  Escolher tamanho
                </span>
              ) : (
                <button
                  type="button"
                  onClick={quickAdd}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#f7efe9]/95 text-sm font-medium text-[#1c1012] backdrop-blur-md transition-colors hover:bg-white"
                >
                  {added ? <><Check size={16} /> Adicionado</> : 'Adicionar ao carrinho'}
                </button>
              )}
            </span>
            {/* Toque: disco + */}
            {!hasSizes && (
              <button
                type="button"
                onClick={quickAdd}
                aria-label={`Adicionar ${product.nome} ao carrinho`}
                className="absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#f7efe9] text-[#1c1012] shadow-[0_4px_14px_rgba(0,0,0,.16)] active:scale-95 [@media(hover:hover)]:hidden"
              >
                {added ? <Check size={18} /> : <Plus size={18} />}
              </button>
            )}
          </>
        )}
      </div>

      <div className="mt-3 px-0.5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b5a5c]">{formatCategoryDisplay(product.categoria)}</p>
        <h3 className="mt-1 line-clamp-2 font-sans text-[15px] font-medium leading-[1.35] tracking-normal text-[#1c1012] group-hover:underline group-hover:decoration-[#1c1012]/30 group-hover:underline-offset-4">
          {product.nome}
        </h3>
        <p className="mt-1.5 text-[15px] tabular-nums text-[#1c1012]">{formatPrice(product.preco)}</p>
      </div>
    </Link>
  )
}
