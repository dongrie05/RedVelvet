import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import CategoryTiles from '@/components/home/CategoryTiles'
import VisitSection from '@/components/home/VisitSection'
import ProductCard from '@/components/product/ProductCard'
import AIOptimizedContent from '@/components/seo/AIOptimizedContent'
import { getAllProducts } from '@/lib/products'
import { getCategorySlug } from '@/lib/categoryUtils'
import { BUSINESS } from '@/lib/business'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shop'
import type { Product } from '@/lib/supabase'

export const revalidate = 300

const FEATURED_CODIGOS = ['AMY-GA037', '34SI22362', 'TLGASP']


function pickFeatured(products: Product[]): Product[] {
  const byCode = FEATURED_CODIGOS.map((c) => products.find((p) => p.codigo === c)).filter(Boolean) as Product[]
  const rest = products.filter((p) => !byCode.includes(p) && p.stock > 0 && p.imagem_url)
  return [...byCode, ...rest].slice(0, 3)
}


export default async function Home() {
  const products = await getAllProducts().catch(() => [] as Product[])
  const featured = pickFeatured(products)
  const counts: Record<string, number> = {}
  products.forEach((p) => {
    const slug = getCategorySlug(p.categoria)
    if (slug) counts[slug] = (counts[slug] || 0) + 1
  })

  return (
    <AIOptimizedContent>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-[#210a0f] text-[#f7efe9] min-h-[620px] h-[calc(100dvh-80px)] lg:max-h-[880px]">
        <div className="absolute inset-x-0 top-0 h-[60%] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[62%] rv-settle">
          <Image
            src="/images/categories/hero/hero-main.png"
            alt="Mulher com casaco vermelho RedVelvet"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover object-[50%_15%] lg:object-[50%_20%]"
          />
        </div>
        {/* Fusão da foto com o fundo veludo */}
        <div aria-hidden className="absolute inset-0 z-[1] lg:hidden bg-[linear-gradient(0deg,#210a0f_46%,rgba(33,10,15,.8)_58%,rgba(33,10,15,0)_74%)]" />
        <div aria-hidden className="absolute inset-0 z-[1] hidden lg:block bg-[linear-gradient(90deg,#210a0f_38%,rgba(33,10,15,.92)_50%,rgba(33,10,15,0)_72%)]" />
        <div aria-hidden className="absolute inset-0 z-[1] hidden lg:block bg-[linear-gradient(0deg,#210a0f_0%,rgba(33,10,15,0)_22%)]" />
        <div aria-hidden className="rv-grain absolute inset-0 z-[2]" />

        <div className="container-luxury relative z-10 flex h-full flex-col justify-end pb-7 lg:justify-center lg:pb-28">
          <div className="max-w-[600px]">
            <p className="rv-rise flex items-center gap-3.5 text-xs font-medium uppercase tracking-[0.28em] text-[#f7efe9]/60" style={{ animationDelay: '.1s' }}>
              <span aria-hidden className="h-px w-8 bg-[#f7efe9]/40" />
              Lisboa · Casa &amp; Moda
            </p>
            <h1 className="mt-4 font-serif lg:mt-5 text-[clamp(46px,7vw,104px)] font-normal leading-[0.95] tracking-[-0.03em] text-[#f7efe9]">
              <span className="rv-line"><span style={{ animationDelay: '.2s' }}>Para a casa,</span></span>
              <span className="rv-line"><span className="italic text-[#e9a8ae]" style={{ animationDelay: '.32s' }}>e para si.</span></span>
            </h1>
            <p className="rv-rise mt-5 max-w-[30rem] text-[15.5px] lg:mt-7 leading-relaxed text-[#f7efe9]/72 lg:text-[17px]" style={{ animationDelay: '.5s' }}>
              Decoração, velas aromáticas e roupa escolhidas a dedo na nossa loja de Lisboa.
              Pague com MB WAY e receba em casa em {BUSINESS.shippingDays}.
            </p>
            <div className="rv-rise mt-7 flex flex-col gap-5 lg:mt-9 sm:flex-row sm:items-center sm:gap-8" style={{ animationDelay: '.62s' }}>
              <Link
                href="/shop"
                className="group inline-flex min-h-[52px] items-center justify-between gap-3.5 rounded-full bg-[#f7efe9] py-1.5 pl-[26px] pr-1.5 text-[15px] font-medium text-[#210a0f] transition-transform active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7efe9]"
              >
                Ver a loja
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-redvelvet-500 text-white transition-transform duration-300 group-hover:translate-x-[3px]">
                  <ArrowRight size={18} />
                </span>
              </Link>
              <a href="#visite" className="rv-link self-start text-[15px] text-[#f7efe9]/85 hover:text-[#f7efe9] sm:self-auto">
                Visite-nos em Lisboa
              </a>
            </div>
          </div>

          <p className="rv-rise mt-7 text-[12px] text-[#f7efe9]/55 sm:hidden" style={{ animationDelay: '.8s' }}>
            Envio grátis desde {FREE_SHIPPING_THRESHOLD} € · MB WAY · 14 dias para devolver
          </p>
          <ul className="rv-rise mt-8 hidden flex-col gap-1.5 text-[12.5px] text-[#f7efe9]/55 sm:flex lg:absolute lg:bottom-9 lg:mt-0 lg:flex-row lg:items-center lg:gap-0" style={{ animationDelay: '.8s' }}>
            <li>Envio grátis desde {FREE_SHIPPING_THRESHOLD} €</li>
            <li aria-hidden className="mx-[18px] hidden h-3.5 w-px bg-[#f7efe9]/15 lg:block" />
            <li>MB WAY, Multibanco e cartão</li>
            <li aria-hidden className="mx-[18px] hidden h-3.5 w-px bg-[#f7efe9]/15 lg:block" />
            <li>14 dias para devolver</li>
          </ul>
        </div>
      </section>

      {/* ---------------- COLEÇÕES ---------------- */}
      <section className="bg-[#f7f3ee] py-[clamp(80px,10vw,144px)]">
        <div className="container-luxury">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.28em] text-redvelvet-500">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-redvelvet-500" /> Coleções
              </p>
              <h2 className="mt-4 font-serif text-[clamp(34px,4.4vw,60px)] font-normal leading-[1.02] tracking-[-0.025em] text-[#1c1012]">
                Escolha por onde <em className="italic text-[#8a5a60]">começar.</em>
              </h2>
            </div>
            <Link href="/shop" className="rv-link hidden shrink-0 items-center gap-2 text-sm text-[#1c1012] sm:inline-flex">
              Ver tudo <ArrowRight size={16} />
            </Link>
          </div>

          <CategoryTiles counts={counts} />
        </div>
      </section>

      {/* ---------------- EM DESTAQUE ---------------- */}
      {featured.length > 0 && (
        <section className="bg-white py-[clamp(80px,10vw,128px)]">
          <div className="container-luxury">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.28em] text-redvelvet-500">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-redvelvet-500" /> Em destaque
                </p>
                <h2 className="mt-4 font-serif text-[clamp(34px,4.4vw,60px)] font-normal leading-[1.02] tracking-[-0.025em] text-[#1c1012]">
                  Escolhidas <em className="italic text-[#8a5a60]">para esta estação.</em>
                </h2>
              </div>
              <Link href="/shop" className="btn-secondary inline-flex items-center gap-2">
                Ver coleção completa <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:gap-x-5 md:gap-y-10 lg:grid-cols-3">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <VisitSection />
    </AIOptimizedContent>
  )
}
