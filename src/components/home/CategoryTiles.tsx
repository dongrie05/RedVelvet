import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export const CATEGORIES = [
  { name: 'Decoração', slug: 'decorative-elements', src: '/images/categories/decorative-elements/decorative-elements.png', pos: '50% 40%', alt: 'Prateleira com peças de decoração' },
  { name: 'Velas', slug: 'velas', src: '/images/categories/candles/candles-hero.png', pos: '50% 50%', alt: 'Velas aromáticas acesas' },
  { name: 'Roupa', slug: 'roupa', src: '/images/categories/clothing/clothing-hero.jpg', pos: '50% 25%', alt: 'Peça de roupa em fundo vermelho' },
] as const

export default function CategoryTiles({ counts = {} }: { counts?: Record<string, number> }) {
  return (
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3 md:gap-5">
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={`/shop?category=${c.slug}`}
          className="group relative block aspect-[4/3] overflow-hidden rounded-[28px] bg-[#e9e2da] md:aspect-[4/5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-redvelvet-500"
        >
          <Image
            src={c.src}
            alt={c.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
            style={{ objectPosition: c.pos }}
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,6,9,.72)_0%,rgba(20,6,9,0)_55%)]" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
            <div>
              <h3 className="font-serif text-[30px] font-normal leading-none text-white">{c.name}</h3>
              {counts[c.slug] > 0 && <p className="mt-1.5 text-[13px] text-white/75">{counts[c.slug]} peças</p>}
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[.16] text-white backdrop-blur-md transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={18} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
