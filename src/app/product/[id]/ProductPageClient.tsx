'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Heart, Share2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { Product } from '@/lib/supabase'
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo'
import { formatCategoryDisplay, getCategorySlug } from '@/lib/categoryUtils'

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

export default function ProductPageClient() {
  const params = useParams()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [product, setProduct] = useState<Product | null>(null)
  const [hasFetched, setHasFetched] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    setSelectedImage(0)
  }, [params?.id])

  useEffect(() => {
    const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : ''
    setHasFetched(false)
    if (!id) {
      setProduct(null)
      setHasFetched(true)
      return
    }
    fetch('/api/products', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const list = (data?.data || []) as Product[]
        const normalized = list.map((p: Product) => ({
          ...p,
          preco: typeof p.preco === 'string' ? Number(p.preco) : p.preco,
          iva: typeof p.iva === 'string' ? Number(p.iva) : p.iva
        })) as Product[]
        const found = normalized.find((p) => p.id === id) || null
        setProduct(found)
        if (found?.tamanhos && found.tamanhos.length > 0) {
          setSelectedSize(found.tamanhos[0])
        }
        setHasFetched(true)
      })
      .catch(() => {
        setProduct(null)
        setHasFetched(true)
      })
  }, [params?.id])

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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          {!hasFetched ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-redvelvet-500 mx-auto mb-4"></div>
              <p className="text-redvelvet-600">A carregar produto...</p>
            </>
          ) : (
            <>
              <p className="text-redvelvet-600 text-lg mb-6">Produto não encontrado.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-redvelvet-500 hover:text-redvelvet-600 font-medium"
              >
                <ArrowLeft size={20} />
                Voltar à loja
              </Link>
            </>
          )}
        </div>
      </div>
    )
  }

  // Até 3 fotos: imagem principal + galeria (máx. 2 extras)
  const productImages = useMemo(() => {
    if (!product) return []
    const main = product.imagem_url ? [product.imagem_url] : []
    const galeria = Array.isArray(product.galeria) ? product.galeria : []
    const extra = galeria.slice(0, 2).filter((u): u is string => typeof u === 'string')
    return [...main, ...extra].slice(0, 3)
  }, [product])

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
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return base.map((item, i) => ({
      name: item.label,
      url: item.href ? `${siteUrl}${item.href}` : (typeof window !== 'undefined' ? window.location.href : `${siteUrl}/product/${product.id}`)
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
      </div>
    </div>
  )
}
