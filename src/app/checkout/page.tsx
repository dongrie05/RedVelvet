'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ChevronDown, Loader2, Lock } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { calculateShipping, formatPrice, round2, SHIPPING_COUNTRIES, ShippingCountry } from '@/lib/shop'
import { Guarantees, PaymentPills } from '@/components/checkout/Trust'
import type { CartItem } from '@/types'

type Form = {
  nome: string; email: string; telefone: string; morada: string; cidade: string
  codigo_postal: string; pais: ShippingCountry; nif: string; notas: string
}
type Errors = Partial<Record<keyof Form | 'terms', string>>

function ItemsList({ items }: { items: CartItem[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3.5">
          <div className="relative h-[70px] w-14 shrink-0">
            <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-[#ede6de]">
              {item.imagem_url && <Image src={item.imagem_url} alt={item.nome} fill sizes="56px" className="object-cover" />}
            </div>
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1c1012]/80 px-1 text-[11px] text-white">
              {item.quantidade}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#1c1012]">{item.nome}</p>
            {item.tamanho && <p className="text-[12.5px] text-[#6b5a5c]">Tamanho {item.tamanho}</p>}
          </div>
          <p className="text-sm tabular-nums text-[#1c1012]">{formatPrice(item.preco * item.quantidade)}</p>
        </li>
      ))}
    </ul>
  )
}

function Totals({ subtotal, shipping, total, country }: { subtotal: number; shipping: number; total: number; country: ShippingCountry }) {
  return (
    <dl className="mt-5 space-y-2.5 border-t border-[#1c1012]/[.1] pt-5 text-[15px] text-[#1c1012]">
      <div className="flex justify-between"><dt className="text-[#6b5a5c]">Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
      <div className="flex justify-between gap-4">
        <dt className="text-[#6b5a5c]">Envio <span className="text-[13px]">· {SHIPPING_COUNTRIES[country].label}</span></dt>
        <dd className="tabular-nums">{shipping === 0 ? <span className="text-[#2f7d4f]">Grátis</span> : formatPrice(shipping)}</dd>
      </div>
      <div className="mt-3 flex items-baseline justify-between border-t border-[#1c1012]/[.1] pt-4">
        <dt className="font-medium text-[#1c1012]">Total <span className="text-[12.5px] font-normal text-[#6b5a5c]">IVA incluído</span></dt>
        <dd className="text-[22px] font-medium tabular-nums text-[#1c1012]">{formatPrice(total)}</dd>
      </div>
    </dl>
  )
}

export default function CheckoutPage() {
  const { cart } = useCart()
  const { user } = useAuth()
  const [form, setForm] = useState<Form>({
    nome: '', email: '', telefone: '', morada: '', cidade: '', codigo_postal: '', pais: 'PT', nif: '', notas: '',
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!user) return
    setForm((f) => ({
      ...f,
      nome: f.nome || user.nome || '',
      email: f.email || user.email || '',
      telefone: f.telefone || user.telefone || '',
      morada: f.morada || user.endereco || '',
    }))
  }, [user])

  const shipping = calculateShipping(cart.subtotal, form.pais)
  const total = round2(cart.subtotal + shipping)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name as keyof Form]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const validate = () => {
    const e: Errors = {}
    if (!form.nome.trim()) e.nome = 'Indique o seu nome'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Email inválido'
    if (form.telefone.replace(/\D/g, '').length < 9) e.telefone = 'Telemóvel inválido'
    if (!form.morada.trim()) e.morada = 'Indique a morada'
    if (!form.cidade.trim()) e.cidade = 'Indique a localidade'
    if (form.pais.startsWith('PT') ? !/^\d{4}-\d{3}$/.test(form.codigo_postal.trim()) : !form.codigo_postal.trim())
      e.codigo_postal = form.pais.startsWith('PT') ? 'Formato 1234-567' : 'Indique o código postal'
    if (form.nif && !/^\d{9}$/.test(form.nif.trim())) e.nif = 'O NIF tem 9 dígitos'
    if (!acceptTerms) e.terms = 'Aceite os termos para continuar'
    setErrors(e)
    const first = Object.keys(e)[0]
    if (first) document.getElementById(first)?.focus()
    return !first
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setServerError('')
    if (!validate()) return
    setIsProcessing(true)
    try {
      const res = await fetch('/api/checkout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: cart.items.map((i) => ({ produto_id: i.produto_id, quantidade: i.quantidade, tamanho: i.tamanho })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.url) {
        window.location.href = data.url
        return
      }
      setServerError(data?.error || 'Não foi possível iniciar o pagamento. Tente novamente.')
    } catch {
      setServerError('Erro de ligação. Verifique a internet e tente novamente.')
    }
    setIsProcessing(false)
  }

  if (cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f7f3ee] px-4">
        <div className="text-center">
          <h1 className="font-serif text-[clamp(32px,4vw,48px)] font-normal text-[#1c1012]">O carrinho está <em className="italic text-[#8a5a60]">vazio.</em></h1>
          <p className="mt-3 text-[15.5px] text-[#6b5a5c]">Adicione produtos antes de finalizar a compra.</p>
          <Link href="/shop/" className="mt-8 inline-flex h-12 items-center rounded-full bg-[#210a0f] px-7 text-[15px] font-medium text-[#f7efe9]">Ver a loja</Link>
        </div>
      </div>
    )
  }

  const field = (name: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, full = false, hint?: string) => (
    <div className={full ? 'md:col-span-2' : ''}>
      <label htmlFor={name} className="rv-label">{label}</label>
      <input
        id={name}
        name={name}
        value={form[name]}
        onChange={onChange}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-err` : undefined}
        className="rv-input"
        {...props}
      />
      {errors[name] ? (
        <p id={`${name}-err`} className="mt-1.5 text-[13px] text-redvelvet-600">{errors[name]}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12.5px] text-[#6b5a5c]">{hint}</p>
      ) : null}
    </div>
  )

  const section = 'mt-7 border-t border-[#1c1012]/[.08] pt-7'
  const h2 = 'mb-5 font-serif text-[22px] font-normal text-[#1c1012]'

  return (
    <div className="bg-[#f7f3ee]">
      <div className="container-luxury pb-6 pt-[clamp(24px,4vw,48px)]">
        <Link href="/cart/" className="inline-flex items-center gap-1.5 text-[13px] text-[#6b5a5c] hover:text-[#1c1012]">
          <ArrowLeft size={14} /> Voltar ao carrinho
        </Link>
        <ol className="mt-5 flex items-center gap-2 text-[13px] text-[#6b5a5c]" aria-label="Passos">
          <li>Carrinho</li><li aria-hidden className="text-[#1c1012]/30">·</li>
          <li className="font-medium text-[#1c1012]" aria-current="step">Dados de envio</li><li aria-hidden className="text-[#1c1012]/30">·</li>
          <li>Pagamento</li>
        </ol>
        <h1 className="mt-3 font-serif text-[clamp(32px,4vw,52px)] font-normal leading-none tracking-[-0.025em] text-[#1c1012]">
          Finalizar <em className="italic text-[#8a5a60]">compra.</em>
        </h1>

        {/* Resumo recolhível (telemóvel) */}
        <details className="group mt-6 rounded-2xl bg-white px-4 lg:hidden">
          <summary className="flex h-14 cursor-pointer list-none items-center justify-between text-sm text-[#1c1012] [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-1.5">
              Ver resumo da encomenda <ChevronDown size={16} className="transition-transform duration-200 group-open:rotate-180" />
            </span>
            <span className="text-[15px] font-medium tabular-nums">{formatPrice(total)}</span>
          </summary>
          <div className="pb-5 pt-1">
            <ItemsList items={cart.items} />
            <Totals subtotal={cart.subtotal} shipping={shipping} total={total} country={form.pais} />
          </div>
        </details>
      </div>

      <form onSubmit={handleSubmit} noValidate className="container-luxury grid grid-cols-1 gap-8 pb-24 lg:grid-cols-12 lg:gap-12">
        <div className="rounded-[24px] bg-white p-6 md:p-9 lg:col-span-7">
          <h2 className={h2}>Contacto</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {field('nome', 'Nome completo', { autoComplete: 'name' }, true)}
            {field('email', 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email', placeholder: 'nome@email.com' }, false, 'Enviamos aqui a confirmação.')}
            {field('telefone', 'Telemóvel', { type: 'tel', autoComplete: 'tel', placeholder: '912 345 678' }, false, 'Só para contacto sobre a entrega.')}
          </div>

          <div className={section}>
            <h2 className={h2}>Morada de envio</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="pais" className="rv-label">País / região</label>
                <select id="pais" name="pais" value={form.pais} onChange={onChange} className="rv-input" autoComplete="country">
                  {Object.entries(SHIPPING_COUNTRIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              {field('morada', 'Morada', { autoComplete: 'street-address', placeholder: 'Rua, número, andar' }, true)}
              {field('codigo_postal', 'Código postal', { autoComplete: 'postal-code', placeholder: '1000-000', inputMode: 'numeric' })}
              {field('cidade', 'Localidade', { autoComplete: 'address-level2' })}
              {field('nif', 'NIF (opcional)', { inputMode: 'numeric', maxLength: 9 }, false, 'Para fatura com contribuinte.')}
              <div className="md:col-span-2">
                <label htmlFor="notas" className="rv-label">Notas (opcional)</label>
                <textarea id="notas" name="notas" value={form.notas} onChange={onChange} rows={3} maxLength={500} className="rv-input" placeholder="Ex.: embrulho para oferta, horário de entrega" />
              </div>
            </div>
          </div>

          <div className={section}>
            <h2 className={h2}>Pagamento</h2>
            <p className="text-[14.5px] leading-relaxed text-[#6b5a5c]">
              No passo seguinte paga na página segura da Mollie. Não guardamos os dados do seu cartão.
            </p>
            <PaymentPills className="mt-3.5" />
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-[24px] bg-white p-6 md:p-7 lg:sticky lg:top-[104px]">
            <h2 className="mb-5 hidden font-serif text-2xl font-normal text-[#1c1012] lg:block">Resumo</h2>
            <div className="hidden lg:block"><ItemsList items={cart.items} /></div>
            <div className="lg:block [&>dl]:mt-0 [&>dl]:border-t-0 [&>dl]:pt-0 lg:[&>dl]:mt-5 lg:[&>dl]:border-t lg:[&>dl]:pt-5">
              <Totals subtotal={cart.subtotal} shipping={shipping} total={total} country={form.pais} />
            </div>

            <label className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-[#1c1012]/85">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => { setAcceptTerms(e.target.checked); setErrors((er) => ({ ...er, terms: undefined })) }}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-[#1c1012]/30 text-redvelvet-500 focus:ring-redvelvet-500/30"
              />
              <span>
                Li e aceito os <Link href="/terms/" target="_blank" className="underline underline-offset-2">Termos e Condições</Link> e a{' '}
                <Link href="/privacy/" target="_blank" className="underline underline-offset-2">Política de Privacidade</Link>.
              </span>
            </label>
            {errors.terms && <p className="mt-1.5 text-[13px] text-redvelvet-600">{errors.terms}</p>}

            {serverError && (
              <div role="alert" className="mt-4 rounded-xl border border-[#f5c2c9] bg-[#fdecee] p-3.5 text-sm text-[#8a1c2b]">{serverError}</div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-redvelvet-500 text-[15px] font-medium text-white transition-colors hover:bg-[#a3172f] disabled:cursor-wait disabled:opacity-70"
            >
              {isProcessing ? (
                <><Loader2 size={16} className="animate-spin" /> A abrir pagamento seguro…</>
              ) : (
                <><Lock size={16} /> Encomendar e pagar {formatPrice(total)}</>
              )}
            </button>
            <Guarantees />
          </div>
        </aside>
      </form>
    </div>
  )
}
