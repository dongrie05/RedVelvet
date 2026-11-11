'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check, Lock, Minus, Plus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice, FREE_SHIPPING_THRESHOLD, MAX_QTY_PER_ITEM, round2 } from '@/lib/shop'
import { Guarantees, PaymentPills } from '@/components/checkout/Trust'

const COLLECTIONS = [
  { label: 'Decoração', href: '/shop/?category=decorative-elements' },
  { label: 'Velas', href: '/shop/?category=velas' },
  { label: 'Roupa', href: '/shop/?category=roupa' },
]

function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const missing = round2(FREE_SHIPPING_THRESHOLD - subtotal)
  const done = missing <= 0
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  return (
    <div className="pb-2" aria-live="polite">
      <p className="flex items-center gap-2 text-sm text-[#1c1012]/80">
        {done ? (
          <><Check size={16} className="text-[#2f7d4f]" /> Tem envio grátis em Portugal Continental.</>
        ) : (
          <span>Faltam <strong className="font-medium text-[#1c1012]">{formatPrice(missing)}</strong> para envio grátis em Portugal Continental.</span>
        )}
      </p>
      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[#1c1012]/10">
        <div className={`rv-ship-bar h-full rounded-full ${done ? 'bg-[#2f7d4f]' : 'bg-redvelvet-500'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getItemCount } = useCart()
  const count = getItemCount()

  if (cart.items.length === 0) {
    return (
      <div className="bg-[#f7f3ee]">
        <div className="container-luxury flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
          <h1 className="font-serif text-[clamp(32px,4vw,48px)] font-normal tracking-[-0.02em] text-[#1c1012]">
            O carrinho está <em className="italic text-[#8a5a60]">vazio.</em>
          </h1>
          <p className="mt-3 text-[15.5px] text-[#6b5a5c]">Que tal começar por uma das nossas coleções?</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {COLLECTIONS.map((c) => (
              <Link key={c.label} href={c.href} className="inline-flex h-[38px] items-center rounded-full border border-[#1c1012]/15 px-4 text-sm text-[#1c1012]/80 hover:border-[#1c1012]/35 hover:text-[#1c1012]">
                {c.label}
              </Link>
            ))}
          </div>
          <Link href="/shop/" className="mt-6 inline-flex h-12 items-center rounded-full bg-[#210a0f] px-7 text-[15px] font-medium text-[#f7efe9] hover:bg-[#3a1219]">
            Ver a loja
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f7f3ee] pb-28 lg:pb-0">
      <div className="container-luxury pb-6 pt-[clamp(32px,5vw,64px)]">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.28em] text-redvelvet-500">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-redvelvet-500" /> Carrinho
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <h1 className="font-serif text-[clamp(36px,4.6vw,64px)] font-normal leading-none tracking-[-0.025em] text-[#1c1012]">
            O seu <em className="italic text-[#8a5a60]">carrinho.</em>
          </h1>
          <span className="text-sm text-[#6b5a5c]">{count} {count === 1 ? 'artigo' : 'artigos'}</span>
        </div>
      </div>

      <div className="container-luxury grid grid-cols-1 gap-12 pb-24 lg:grid-cols-12">
        <section className="lg:col-span-7" aria-label="Artigos no carrinho">
          <FreeShippingBar subtotal={cart.subtotal} />
          <ul>
            {cart.items.map((item) => {
              const href = `/product/${item.produto_id}/`
              return (
                <li key={item.id} className="grid grid-cols-[88px_1fr] gap-4 border-b border-[#1c1012]/[.12] py-5 md:grid-cols-[104px_1fr]">
                  <Link href={href} className="relative block aspect-[4/5] overflow-hidden rounded-[14px] bg-[#ede6de]">
                    {item.imagem_url && <Image src={item.imagem_url} alt={item.nome} fill sizes="104px" className="object-cover" />}
                  </Link>
                  <div className="flex min-w-0 flex-col">
                    <div className="flex justify-between gap-3">
                      <Link href={href} className="text-[15px] font-medium leading-[1.35] text-[#1c1012] hover:underline hover:underline-offset-4">
                        {item.nome}
                      </Link>
                      <span className="whitespace-nowrap text-[15px] font-medium tabular-nums text-[#1c1012]">
                        {formatPrice(item.preco * item.quantidade)}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-[#6b5a5c]">
                      {[item.tamanho && `Tamanho ${item.tamanho}`, item.quantidade > 1 && `${formatPrice(item.preco)} cada`].filter(Boolean).join(' · ')}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex h-10 items-center rounded-full border border-[#1c1012]/15">
                        <button type="button" aria-label={`Diminuir quantidade de ${item.nome}`} onClick={() => updateQuantity(item.id, item.quantidade - 1)} disabled={item.quantidade <= 1} className="flex h-10 w-10 items-center justify-center text-[#1c1012] disabled:opacity-30">
                          <Minus size={14} />
                        </button>
                        <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">{item.quantidade}</span>
                        <button type="button" aria-label={`Aumentar quantidade de ${item.nome}`} onClick={() => updateQuantity(item.id, item.quantidade + 1)} disabled={item.quantidade >= MAX_QTY_PER_ITEM} className="flex h-10 w-10 items-center justify-center text-[#1c1012] disabled:opacity-30">
                          <Plus size={14} />
                        </button>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="text-[13px] text-[#6b5a5c] underline-offset-4 hover:text-[#1c1012] hover:underline">
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 text-right">
            <button type="button" onClick={() => { if (confirm('Remover todos os artigos do carrinho?')) clearCart() }} className="text-[13px] text-[#6b5a5c] hover:text-[#1c1012]">
              Limpar carrinho
            </button>
          </div>
        </section>

        <aside className="lg:col-span-5">
          <div className="rounded-[24px] bg-white p-7 lg:sticky lg:top-[104px]">
            <h2 className="font-serif text-2xl font-normal text-[#1c1012]">Resumo</h2>
            <dl className="mt-5 space-y-3 text-[15px] text-[#1c1012]">
              <div className="flex justify-between"><dt className="text-[#6b5a5c]">Subtotal</dt><dd className="tabular-nums">{formatPrice(cart.subtotal)}</dd></div>
              <div className="flex justify-between">
                <dt className="text-[#6b5a5c]">Envio <span className="text-[13px]">(Portugal Continental)</span></dt>
                <dd className="tabular-nums">{cart.shipping === 0 ? <span className="text-[#2f7d4f]">Grátis</span> : formatPrice(cart.shipping)}</dd>
              </div>
              <p className="text-[12.5px] text-[#6b5a5c]">Outros destinos são calculados no checkout.</p>
              <div className="mt-4 flex items-baseline justify-between border-t border-[#1c1012]/[.1] pt-4">
                <dt className="font-medium text-[#1c1012]">Total <span className="text-[12.5px] font-normal text-[#6b5a5c]">IVA incluído</span></dt>
                <dd className="text-[22px] font-medium tabular-nums text-[#1c1012]">{formatPrice(cart.total)}</dd>
              </div>
            </dl>
            <Link href="/checkout/" className="mt-6 flex h-14 items-center justify-center gap-2 rounded-full bg-redvelvet-500 text-[15px] font-medium text-white transition-colors hover:bg-[#a3172f]">
              <Lock size={16} /> Finalizar compra
            </Link>
            <PaymentPills className="mt-3.5 justify-center" />
            <div className="mt-4 text-center">
              <Link href="/shop/" className="rv-link text-sm text-[#1c1012]/80">Continuar a comprar</Link>
            </div>
            <Guarantees />
          </div>
        </aside>
      </div>

      {/* Barra fixa (telemóvel) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1c1012]/10 bg-[#f7f3ee]/95 px-4 pt-3 backdrop-blur-md lg:hidden" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-[#6b5a5c]">Total</p>
            <p className="text-[17px] font-medium tabular-nums text-[#1c1012]">{formatPrice(cart.total)}</p>
          </div>
          <Link href="/checkout/" className="flex h-12 items-center rounded-full bg-redvelvet-500 px-6 text-[15px] font-medium text-white">
            Finalizar compra
          </Link>
        </div>
      </div>
    </div>
  )
}
