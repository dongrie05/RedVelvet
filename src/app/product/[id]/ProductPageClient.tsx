'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Heart, MessageCircle, Minus, Plus, RotateCcw, Share2, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/lib/supabase'
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo'
import { formatCategoryDisplay, getCategorySlug } from '@/lib/categoryUtils'
import { formatPrice, FREE_SHIPPING_THRESHOLD, MAX_QTY_PER_ITEM } from '@/lib/shop'
import { BUSINESS } from '@/lib/business'
import { SEO_CONFIG } from '@/lib/seoConfig'

export default function ProductPageClient({ product, related = [] }: { product: Product; related?: Product[] }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const sizes = product.tamanhos ?? []
  const [size, setSize] = useState<string>(sizes.length === 1 ? sizes[0] : '')
  const [sizeError, setSizeError] = useState(false)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [slide, setSlide] = useState(0)
  const [showBar, setShowBar] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)
  const sizesRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const soldOut = product.stock <= 0
  const maxQty = Math.max(1, Math.min(product.stock, MAX_QTY_PER_ITEM))
  const category = formatCategoryDisplay(product.categoria)
  const categorySlug = getCategorySlug(product.categoria)
  const categoryHref = categorySlug ? `/shop/?category=${categorySlug}` : '/shop/'

  const images = useMemo(() => {
    const main = product.imagem_url ? [product.imagem_url] : []
    const extra = (Array.isArray(product.galeria) ? product.galeria : []).filter((u): u is string => typeof u === 'string' && !!u)
    return [...main, ...extra].slice(0, 3)
  }, [product])

  // Barra fixa no telemóvel quando o botão principal sai do ecrã
  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const add = () => {
    if (soldOut) return false
    if (sizes.length > 0 && !size) {
      setSizeError(true)
      sizesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    addToCart({
      produto_id: product.id,
      nome: product.nome,
      preco: product.preco,
      quantidade: qty,
      tamanho: size || undefined,
      imagem_url: product.imagem_url,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
    return true
  }

  const buyNow = () => { if (add()) router.push('/checkout/') }

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: product.nome, url })
      else { await navigator.clipboard.writeText(url); alert('Link copiado!') }
    } catch {}
  }

  const onCarouselScroll = () => {
    const el = carouselRef.current
    if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth))
  }

  const whatsapp = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Olá! Tenho uma dúvida sobre "${product.nome}".`)}`

  const site = SEO_CONFIG.site.url
  let productSchema = '', breadcrumbSchema = ''
  try {
    productSchema = JSON.stringify(generateProductSchema({ ...product, descricao: product.descricao ?? product.nome }))
    breadcrumbSchema = JSON.stringify(generateBreadcrumbSchema([
      { name: 'Início', url: `${site}/` },
      { name: 'Loja', url: `${site}/shop/` },
      { name: category, url: `${site}${categoryHref}` },
      { name: product.nome, url: `${site}/product/${product.id}/` },
    ]))
  } catch {}

  const ctaLabel = soldOut ? 'Esgotado' : added ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho'

  return (
    <div className="bg-[#f7f3ee]">
      {productSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productSchema }} />}
      {breadcrumbSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />}

      <div className="container-luxury pb-5 pt-6">
        <nav aria-label="Navegação" className="text-[13px] text-[#6b5a5c]">
          <Link href={categoryHref} className="inline-flex items-center gap-1.5 hover:text-[#1c1012] lg:hidden">
            <ArrowLeft size={14} /> {category}
          </Link>
          <ol className="hidden items-center gap-2 lg:flex">
            <li><Link href="/shop/" className="hover:text-[#1c1012]">Loja</Link></li>
            <li aria-hidden className="opacity-40">/</li>
            <li><Link href={categoryHref} className="hover:text-[#1c1012]">{category}</Link></li>
            <li aria-hidden className="opacity-40">/</li>
            <li className="truncate text-[#1c1012]" aria-current="page">{product.nome}</li>
          </ol>
        </nav>
      </div>

      <div className="container-luxury grid grid-cols-1 gap-8 pb-20 lg:grid-cols-12 lg:gap-16">
        {/* Galeria */}
        <div className="lg:col-span-7">
          {/* Mobile: carrossel */}
          <div className="-mx-8 sm:-mx-12 lg:hidden">
            <div ref={carouselRef} onScroll={onCarouselScroll} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(images.length ? images : ['']).map((src, i) => (
                <div key={i} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-[#ede6de]">
                  {src && <Image src={src} alt={`${product.nome} — foto ${i + 1}`} fill priority={i === 0} sizes="100vw" className="object-cover" />}
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
                {images.map((_, i) => (
                  <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === slide ? 'bg-[#1c1012]' : 'bg-[#1c1012]/20'}`} />
                ))}
              </div>
            )}
          </div>
          {/* Desktop: imagens empilhadas */}
          <div className="hidden space-y-3 lg:block">
            {(images.length ? images : ['']).map((src, i) => (
              <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#ede6de]">
                {src && <Image src={src} alt={`${product.nome} — foto ${i + 1}`} fill priority={i === 0} sizes="58vw" className="object-cover" />}
              </div>
            ))}
          </div>
        </div>

        {/* Informação */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[104px]">
            <p className="rv-rise text-xs font-medium uppercase tracking-[0.28em] text-redvelvet-500">{category}</p>
            <h1 className="rv-rise mt-3 font-serif text-[clamp(30px,3.2vw,46px)] font-normal leading-[1.05] tracking-[-0.02em] text-[#1c1012]" style={{ animationDelay: '.06s' }}>
              {product.nome}
            </h1>
            <p className="rv-rise mt-3.5 flex items-baseline gap-2" style={{ animationDelay: '.12s' }}>
              <span className="text-[22px] font-medium tabular-nums text-[#1c1012]">{formatPrice(product.preco)}</span>
              <span className="text-[13px] text-[#6b5a5c]">IVA incluído</span>
            </p>
            {product.descricao && product.descricao !== product.nome && (
              <p className="rv-rise mt-5 max-w-[34rem] text-[15.5px] leading-[1.65] text-[#6b5a5c]" style={{ animationDelay: '.18s' }}>{product.descricao}</p>
            )}

            <div className="rv-rise" style={{ animationDelay: '.24s' }}>
              {sizes.length > 0 && (
                <div ref={sizesRef} className="mt-7 scroll-mt-32">
                  <p className="text-[13px] font-medium text-[#1c1012]">
                    Tamanho{size && <span className="font-normal text-[#6b5a5c]"> · {size}</span>}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2" role="radiogroup" aria-label="Tamanho">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={size === s}
                        onClick={() => { setSize(s); setSizeError(false) }}
                        className={`h-11 min-w-12 rounded-xl border px-3.5 text-sm transition-colors ${
                          size === s ? 'border-[#210a0f] bg-[#210a0f] text-[#f7efe9]' : 'border-[#1c1012]/15 text-[#1c1012] hover:border-[#1c1012]/40'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {sizeError && <p className="mt-2 text-sm text-redvelvet-600">Escolha um tamanho.</p>}
                </div>
              )}

              <div ref={ctaRef} className="mt-7 flex gap-2.5">
                {!soldOut && (
                  <div className="flex h-14 items-center rounded-full border border-[#1c1012]/15">
                    <button type="button" aria-label="Diminuir quantidade" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-14 w-11 items-center justify-center text-[#1c1012] disabled:opacity-30" disabled={qty <= 1}>
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center text-[15px] tabular-nums" aria-live="polite">{qty}</span>
                    <button type="button" aria-label="Aumentar quantidade" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} className="flex h-14 w-11 items-center justify-center text-[#1c1012] disabled:opacity-30" disabled={qty >= maxQty}>
                      <Plus size={16} />
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={add}
                  disabled={soldOut}
                  className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-redvelvet-500 text-[15px] font-medium text-white transition-colors hover:bg-[#a3172f] active:scale-[.98] disabled:bg-[#1c1012]/10 disabled:text-[#1c1012]/40"
                >
                  {added && <Check size={18} />} {ctaLabel}
                </button>
              </div>
              {!soldOut && (
                <button type="button" onClick={buyNow} className="mt-2.5 h-[52px] w-full rounded-full border border-[#1c1012]/20 text-[15px] text-[#1c1012] transition-colors hover:bg-[#1c1012]/5">
                  Comprar agora
                </button>
              )}
              {added && (
                <p role="status" className="mt-3 text-sm text-[#2f7d4f]">
                  Adicionado. <Link href="/cart/" className="underline underline-offset-4">Ver carrinho</Link>
                </p>
              )}

              <p className="mt-5 flex items-center gap-2 text-sm text-[#1c1012]/80">
                <span aria-hidden className={`h-2 w-2 rounded-full ${soldOut ? 'bg-[#1c1012]/30' : product.stock <= 3 ? 'bg-redvelvet-500' : 'bg-[#2f7d4f]'}`} />
                {soldOut ? (
                  <span>Esgotado · <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">pergunte-nos pelo WhatsApp</a></span>
                ) : product.stock <= 3 ? (
                  `Últimas ${product.stock} ${product.stock === 1 ? 'unidade' : 'unidades'} · enviado em ${BUSINESS.shippingDays}`
                ) : (
                  `Em stock · enviado em ${BUSINESS.shippingDays}`
                )}
              </p>

              <div className="mt-4 flex gap-5 text-sm text-[#6b5a5c]">
                <button type="button" onClick={() => toggleWishlist(product)} className="inline-flex items-center gap-1.5 hover:text-[#1c1012]" aria-pressed={isInWishlist(product.id)}>
                  <Heart size={16} className={isInWishlist(product.id) ? 'fill-redvelvet-500 text-redvelvet-500' : ''} />
                  {isInWishlist(product.id) ? 'Nos favoritos' : 'Favoritos'}
                </button>
                <button type="button" onClick={share} className="inline-flex items-center gap-1.5 hover:text-[#1c1012]">
                  <Share2 size={16} /> Partilhar
                </button>
              </div>

              <ul className="mt-7 space-y-3.5 border-t border-[#1c1012]/[.12] pt-6 text-sm text-[#1c1012]/80">
                <li className="flex gap-3"><Truck size={18} className="shrink-0 text-redvelvet-500" /> Envio grátis em Portugal Continental desde {FREE_SHIPPING_THRESHOLD} €</li>
                <li className="flex gap-3"><RotateCcw size={18} className="shrink-0 text-redvelvet-500" /> 14 dias para devolver</li>
                <li className="flex gap-3"><ShieldCheck size={18} className="shrink-0 text-redvelvet-500" /> Pagamento seguro com MB WAY, Multibanco ou cartão</li>
                <li className="flex gap-3">
                  <MessageCircle size={18} className="shrink-0 text-redvelvet-500" />
                  <span>Dúvidas? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Fale connosco no WhatsApp</a></span>
                </li>
              </ul>

              <div className="rv-faq mt-6 border-t border-[#1c1012]/[.12]">
                <details className="border-b border-[#1c1012]/[.12]">
                  <summary className="flex cursor-pointer items-center justify-between py-4 text-[15px] font-medium text-[#1c1012]">
                    Detalhes <span data-plus aria-hidden className="text-xl font-light text-redvelvet-500">+</span>
                  </summary>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 pb-4 text-sm text-[#6b5a5c]">
                    <dt>Referência</dt><dd>{product.codigo}</dd>
                    <dt>Coleção</dt><dd>{category}</dd>
                  </dl>
                </details>
                <details className="border-b border-[#1c1012]/[.12]">
                  <summary className="flex cursor-pointer items-center justify-between py-4 text-[15px] font-medium text-[#1c1012]">
                    Envios e devoluções <span data-plus aria-hidden className="text-xl font-light text-redvelvet-500">+</span>
                  </summary>
                  <p className="pb-4 text-sm leading-relaxed text-[#6b5a5c]">
                    Enviamos em {BUSINESS.shippingDays} após a confirmação do pagamento. Pode devolver qualquer artigo até 14 dias após a receção.{' '}
                    <Link href="/shipping/" className="underline underline-offset-4">Ver condições</Link>
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-[#1c1012]/[.08] bg-[#f7f3ee] py-[clamp(64px,8vw,112px)]">
          <div className="container-luxury">
            <h2 className="mb-8 font-serif text-[clamp(28px,3vw,40px)] font-normal tracking-[-0.02em] text-[#1c1012]">
              Também pode <em className="italic text-[#8a5a60]">gostar.</em>
            </h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:gap-x-5 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Barra de compra fixa (telemóvel) */}
      {!soldOut && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#1c1012]/10 bg-[#f7f3ee]/95 px-4 pt-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${showBar ? 'translate-y-0' : 'translate-y-full'}`}
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
          aria-hidden={!showBar}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] text-[#6b5a5c]">{product.nome}{size ? ` · ${size}` : ''}</p>
              <p className="text-[15px] font-medium tabular-nums text-[#1c1012]">{formatPrice(product.preco)}</p>
            </div>
            <button type="button" tabIndex={showBar ? 0 : -1} onClick={add} className="h-12 rounded-full bg-redvelvet-500 px-6 text-[15px] font-medium text-white active:scale-[.98]">
              {added ? 'Adicionado' : 'Adicionar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
