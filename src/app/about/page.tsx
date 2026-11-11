import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import CategoryTiles from '@/components/home/CategoryTiles'
import VisitSection from '@/components/home/VisitSection'
import { BUSINESS } from '@/lib/business'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shop'

export const metadata: Metadata = {
  title: 'Sobre nós | RedVelvet',
  description: 'A RedVelvet é uma loja de decoração, velas e roupa em Lisboa, com loja online e envio para todo o país.',
  alternates: { canonical: '/about/' },
}

const PRINCIPLES = [
  {
    title: 'Escolher com cuidado',
    text: 'Cada peça é selecionada pela qualidade, pelo design e pela forma como se junta ao resto da casa — ou ao seu guarda-roupa.',
  },
  {
    title: 'Perto de quem compra',
    text: 'Pode ver tudo ao vivo na loja em Lisboa, ou falar connosco pelo WhatsApp antes de encomendar. Respondemos nós, não um robô.',
  },
  {
    title: 'Comprar sem receios',
    text: `Pagamento com MB WAY, Multibanco ou cartão, envio em ${BUSINESS.shippingDays}, grátis em Portugal Continental desde ${FREE_SHIPPING_THRESHOLD} €, e 14 dias para devolver.`,
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-[#f7f3ee] pb-[clamp(64px,8vw,112px)] pt-[clamp(40px,7vw,96px)]">
        <div className="container-luxury">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="rv-rise flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.28em] text-redvelvet-500">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-redvelvet-500" /> Sobre nós
              </p>
              <h1 className="mt-4 font-serif text-[clamp(40px,6vw,88px)] font-normal leading-[0.98] tracking-[-0.03em] text-[#1c1012]">
                <span className="rv-line"><span style={{ animationDelay: '.1s' }}>Uma loja pequena,</span></span>
                <span className="rv-line"><span className="italic text-[#8a5a60]" style={{ animationDelay: '.22s' }}>escolhida peça a peça.</span></span>
              </h1>
            </div>
            <p className="rv-rise max-w-[28rem] text-[16px] leading-relaxed text-[#6b5a5c] lg:col-span-4" style={{ animationDelay: '.4s' }}>
              A RedVelvet é uma loja de decoração, velas e roupa na Avenida David Morão Ferreira, em Lisboa — e aqui, online,
              para todo o país. Escolhemos cada peça pela forma como faz sentir uma casa, ou quem a veste.
            </p>
          </div>

          {/* Mosaico editorial com as fotografias da marca */}
          <div className="rv-rise mt-12 grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4" style={{ animationDelay: '.5s' }}>
            <div className="relative col-span-2 aspect-[4/3] overflow-hidden rounded-[24px] md:col-span-6 md:row-span-2 md:aspect-auto">
              <Image src="/images/categories/hero/hero-main.png" alt="Casaco vermelho da coleção RedVelvet" fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-[50%_20%]" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] md:col-span-3">
              <Image src="/images/categories/candles/candles-hero.png" alt="Vela aromática acesa" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] md:col-span-3">
              <Image src="/images/categories/decorative-elements/decorative-elements.png" alt="Prateleira com peças de decoração" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover object-[50%_40%]" />
            </div>
            <div className="relative col-span-2 hidden aspect-[16/9] overflow-hidden rounded-[24px] md:col-span-6 md:block md:aspect-[2/1]">
              <Image src="/images/categories/clothing/clothing-hero.jpg" alt="Conjunto de roupa vermelho" fill sizes="50vw" className="object-cover object-[50%_30%]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-[clamp(72px,9vw,128px)]">
        <div className="container-luxury">
          <h2 className="max-w-[18ch] font-serif text-[clamp(32px,4vw,56px)] font-normal leading-[1.02] tracking-[-0.025em] text-[#1c1012]">
            O que nos <em className="italic text-[#8a5a60]">guia.</em>
          </h2>
          <ol className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="border-t border-[#1c1012]/[.12] pt-6">
                <span className="text-xs font-medium tabular-nums tracking-[0.2em] text-redvelvet-500">0{i + 1}</span>
                <h3 className="mt-3 font-serif text-[26px] font-normal leading-tight text-[#1c1012]">{p.title}</h3>
                <p className="mt-3 text-[15.5px] leading-[1.65] text-[#6b5a5c]">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#f7f3ee] py-[clamp(72px,9vw,128px)]">
        <div className="container-luxury">
          <div className="mb-12 flex items-end justify-between gap-6">
            <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-normal leading-[1.02] tracking-[-0.025em] text-[#1c1012]">
              Três coleções, <em className="italic text-[#8a5a60]">uma casa.</em>
            </h2>
            <Link href="/shop/" className="rv-link hidden shrink-0 items-center gap-2 text-sm text-[#1c1012] sm:inline-flex">
              Ver a loja <ArrowRight size={16} />
            </Link>
          </div>
          <CategoryTiles />
        </div>
      </section>

      <VisitSection />
    </>
  )
}
