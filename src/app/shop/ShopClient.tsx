'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/lib/supabase'
import { getCategorySlug } from '@/lib/categoryUtils'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shop'

const CATEGORIES = [
  { value: 'decorative-elements', label: 'Decoração' },
  { value: 'velas', label: 'Velas' },
  { value: 'roupa', label: 'Roupa' },
] as const

type Sort = 'novidades' | 'preco_asc' | 'preco_desc' | 'nome_asc'

const normalize = (s: string | undefined | null) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const chip = (active: boolean) =>
  `inline-flex h-[38px] shrink-0 snap-start items-center gap-1 rounded-full border px-4 text-sm transition-colors ${
    active
      ? 'border-[#210a0f] bg-[#210a0f] text-[#f7efe9]'
      : 'border-[#1c1012]/15 text-[#1c1012]/80 hover:border-[#1c1012]/35 hover:text-[#1c1012]'
  }`

export default function ShopClient({ products }: { products: Product[] }) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const category = params.get('category')
  const query = params.get('q') || ''
  const [inStock, setInStock] = useState(false)
  const [sort, setSort] = useState<Sort>('novidades')

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    products.forEach((p) => {
      const s = getCategorySlug(p.categoria)
      if (s) c[s] = (c[s] || 0) + 1
    })
    return c
  }, [products])

  const visible = useMemo(() => {
    const qn = normalize(query)
    const list = products.filter((p) => {
      if (category && getCategorySlug(p.categoria) !== category) return false
      if (inStock && p.stock <= 0) return false
      if (qn && ![p.nome, p.descricao, p.categoria, p.codigo, p.referencia].some((f) => normalize(f).includes(qn))) return false
      return true
    })
    list.sort((a, b) => {
      // Esgotados sempre no fim
      if ((a.stock > 0) !== (b.stock > 0)) return a.stock > 0 ? -1 : 1
      switch (sort) {
        case 'preco_asc': return a.preco - b.preco
        case 'preco_desc': return b.preco - a.preco
        case 'nome_asc': return a.nome.localeCompare(b.nome, 'pt')
        default: return (b.created_at || '').localeCompare(a.created_at || '')
      }
    })
    return list
  }, [products, category, inStock, query, sort])

  const catLabel = CATEGORIES.find((c) => c.value === category)?.label

  return (
    <div className="min-h-screen bg-[#f7f3ee]">
      <header className="container-luxury pb-7 pt-[clamp(32px,6vw,72px)]">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.28em] text-redvelvet-500">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-redvelvet-500" /> Loja
        </p>
        <h1 className="mt-3 font-serif text-[clamp(38px,5vw,72px)] font-normal leading-none tracking-[-0.025em] text-[#1c1012]">
          {query ? (
            <>Resultados para <em className="italic text-[#8a5a60]">“{query}”</em></>
          ) : catLabel ? (
            catLabel
          ) : (
            <>Toda a <em className="italic text-[#8a5a60]">coleção.</em></>
          )}
        </h1>
        <p className="mt-4 max-w-[36rem] text-[15.5px] leading-relaxed text-[#6b5a5c]">
          Decoração, velas e roupa escolhidas na nossa loja de Lisboa. Envio grátis em Portugal Continental desde {FREE_SHIPPING_THRESHOLD} €.
        </p>
      </header>

      <div className="sticky top-20 z-30 border-y border-[#1c1012]/[.08] bg-[#f7f3ee]/90 backdrop-blur-[10px]">
        <div className="container-luxury flex flex-col gap-2 py-3 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Categorias" className="-mx-8 flex snap-x scroll-px-8 gap-2 overflow-x-auto px-8 sm:-mx-12 sm:px-12 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button type="button" onClick={() => setParam('category', null)} className={chip(!category)} aria-pressed={!category}>
              Tudo <sup className="text-[10px] opacity-60">{products.length}</sup>
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.value} type="button" onClick={() => setParam('category', c.value)} className={chip(category === c.value)} aria-pressed={category === c.value}>
                {c.label} <sup className="text-[10px] opacity-60">{counts[c.value] || 0}</sup>
              </button>
            ))}
            {query && (
              <button type="button" onClick={() => setParam('q', null)} className={chip(false)}>
                “{query}” <X size={14} aria-label="Limpar pesquisa" />
              </button>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setInStock((v) => !v)} className={chip(inStock)} aria-pressed={inStock}>
              Só em stock
            </button>
            <label className="sr-only" htmlFor="sort">Ordenar</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-[38px] max-w-[150px] rounded-full border border-[#1c1012]/15 bg-transparent py-0 pl-4 pr-9 sm:max-w-none text-sm text-[#1c1012]/80 focus:border-[#1c1012]/40 focus:ring-0"
            >
              <option value="novidades">Novidades</option>
              <option value="preco_asc">Preço: mais baixo</option>
              <option value="preco_desc">Preço: mais alto</option>
              <option value="nome_asc">Nome A–Z</option>
            </select>
            <span className="ml-auto whitespace-nowrap text-[13px] text-[#6b5a5c] lg:ml-3">{visible.length} {visible.length === 1 ? 'peça' : 'peças'}</span>
          </div>
        </div>
      </div>

      <div className="container-luxury pb-[120px] pt-8">
        {visible.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 md:gap-x-5 md:gap-y-10 xl:grid-cols-4">
            {visible.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-serif text-[28px] text-[#1c1012]">Nada por aqui… <em className="italic text-[#8a5a60]">ainda.</em></p>
            <p className="mt-3 text-[15px] text-[#6b5a5c]">
              {products.length === 0 ? 'A loja está a ser atualizada. Volte daqui a pouco.' : 'Experimente outra categoria ou retire os filtros.'}
            </p>
            {products.length > 0 && (
              <button
                type="button"
                onClick={() => { setInStock(false); router.replace(pathname, { scroll: false }) }}
                className="mt-8 inline-flex h-12 items-center rounded-full border border-[#1c1012]/20 px-6 text-[15px] text-[#1c1012] hover:bg-[#1c1012]/5"
              >
                Ver toda a coleção
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
