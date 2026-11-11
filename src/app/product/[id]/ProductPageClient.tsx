'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Heart, Share2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { Product } from '@/lib/supabase'
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo'
import { formatCategoryDisplay, getCategorySlug } from '@/lib/categoryUtils'
import { formatPrice } from '@/lib/shop'
import { SEO_CONFIG } from '@/lib/seoConfig'

export default function ProductPageClient({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [selectedSize, setSelectedSize] = useState<string>(product.tamanhos?.[0] ?? '')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [added, setAdded] = useState(false)

  // Até 3 fotos: imagem principal + galeria (máx. 2 extras)
  const productImages = useMemo(() => {
    const main = product.imagem_url ? [product.imagem_url] : []
    const galeria = Array.isArray(product.galeria) ? product.galeria : []
    const extra = galeria.slice(0, 2).filter((u): u is string => typeof u === 'string')
    return [...main, ...extra].slice(0, 3)
  }, [product])

  const handleAddToCart = () => {
    if (product.tamanhos && product.tamanhos.length > 0 && !selectedSize) return
    addToCart({
      produto_id: product.id,
      nome: product.nome,
      preco: product.preco,
      quantidade: quantity,
      tamanho: selectedSize || undefined,
      imagem_url: product.imagem_url
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 4000)
  }

  const handleToggleWishlist = () => {
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


  // Generate breadcrumbs for product page (label/href para o componente Breadcrumbs)
  const getBreadcrumbs = () => {
    const categorySlug = getCategorySlug(product.categoria)
    const categoryHref = categorySlug ? `/shop?category=${categorySlug}` : '/shop'
    return [
      { label: 'Início', href: '/' },
      { label: 'Loja', href: '/shop' },
      { label: formatCategoryDisplay(product.categoria), href: categoryHref },
      { label: product.nome }
    ]
  }

  // Schema SEO espera { name, url }; o último item não tem href (página atual)
  const breadcrumbsForSchema = () => {
    const base = getBreadcrumbs()
    const siteUrl = SEO_CONFIG.site.url
    return base.map((item, i) => ({
      name: item.label,
      url: item.href ? `${siteUrl}${item.href}` : `${siteUrl}/product/${product.id}/`
    }))
  }

  // Schemas SEO (em try/catch para não quebrar a página)
  let productSchemaHtml = ''
  let breadcrumbSchemaHtml = ''
  try {
    productSchemaHtml = JSON.stringify(
      generateProductSchema({
        ...product,
        descricao: product.descricao ?? product.nome,
        imagem_url: product.imagem_url ?? undefined
      })
    )
  } catch (_) {
    // ignora erro de schema
  }
  try {
    breadcrumbSchemaHtml = JSON.stringify(generateBreadcrumbSchema(breadcrumbsForSchema()))
  } catch (_) {
    // ignora erro de schema
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {productSchemaHtml && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: productSchemaHtml }}
        />
      )}
      {breadcrumbSchemaHtml && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbSchemaHtml }}
        />
      )}
      <div className="container-luxury py-8">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={getBreadcrumbs()} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images - até 3 fotos (principal + galeria) */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-none overflow-hidden shadow-luxury">
              {productImages.length > 0 && productImages[selectedImage] ? (
                <Image
                  src={productImages[selectedImage]}
                  alt={`${product.nome} - foto ${selectedImage + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
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
            {productImages.length > 1 && (
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(productImages.length, 3)}, minmax(0, 1fr))` }}>
                {productImages.map((url, i) => (
                  <button
                    key={url + i}
                    type="button"
                    className={`relative aspect-square bg-cream-100 rounded-none overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-redvelvet-500 ring-1 ring-redvelvet-500' : 'border-transparent hover:border-redvelvet-300'
                    }`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <Image
                      src={url}
                      alt={`${product.nome} - miniatura ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-redvelvet-500 font-medium uppercase tracking-wide">
                {formatCategoryDisplay(product.categoria)}
              </span>
              <span className="text-redvelvet-400">•</span>
              <span className="text-sm text-redvelvet-600">Código: {product.codigo}</span>
            </div>

            {/* Product Name */}
            <h1 className="heading-luxury text-3xl lg:text-4xl">{product.nome}</h1>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-redvelvet-500">
                {formatPrice(product.preco)}
              </div>
              <div className="text-sm text-redvelvet-600">
                IVA incluído · Envio grátis em Portugal Continental a partir de 50 €
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
                  ✓ {product.stock <= 3 ? `Últimas ${product.stock} unidades` : 'Em stock'}
                </span>
              ) : (
                <span className="text-red-600">✗ Esgotado</span>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-none font-medium transition-colors ${
                  product.stock <= 0
                    ? 'bg-redvelvet-300 text-redvelvet-500 cursor-not-allowed'
                    : 'bg-redvelvet-500 hover:bg-redvelvet-600 text-white'
                }`}
              >
                <ShoppingCart size={20} />
                <span>
                  {product.stock <= 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
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

            {added && (
              <div role="status" className="flex items-center justify-between gap-4 p-4 bg-green-50 border border-green-200 text-green-800 text-sm">
                <span>Produto adicionado ao carrinho.</span>
                <Link href="/cart" className="font-medium underline">Ver carrinho</Link>
              </div>
            )}

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
      </div>
    </div>
  )
}
