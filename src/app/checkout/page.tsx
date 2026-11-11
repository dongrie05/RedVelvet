'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Lock, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { calculateShipping, formatPrice, round2, SHIPPING_COUNTRIES, ShippingCountry } from '@/lib/shop'

type Form = {
  nome: string; email: string; telefone: string; morada: string; cidade: string
  codigo_postal: string; pais: ShippingCountry; nif: string; notas: string
}
type Errors = Partial<Record<keyof Form | 'terms', string>>

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
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Email inválido'
    if (form.telefone.replace(/\D/g, '').length < 9) e.telefone = 'Telefone inválido'
    if (!form.morada.trim()) e.morada = 'Morada é obrigatória'
    if (!form.cidade.trim()) e.cidade = 'Localidade é obrigatória'
    if (form.pais.startsWith('PT') ? !/^\d{4}-\d{3}$/.test(form.codigo_postal.trim()) : !form.codigo_postal.trim())
      e.codigo_postal = form.pais.startsWith('PT') ? 'Formato 1234-567' : 'Código postal é obrigatório'
    if (form.nif && !/^\d{9}$/.test(form.nif.trim())) e.nif = 'NIF deve ter 9 dígitos'
    if (!acceptTerms) e.terms = 'Tem de aceitar os termos para continuar'
    setErrors(e)
    return Object.keys(e).length === 0
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
      <div className="min-h-[60vh] bg-cream-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="heading-luxury text-2xl mb-4">O carrinho está vazio</h1>
          <p className="text-redvelvet-600 mb-8">Adicione produtos ao carrinho antes de finalizar a compra.</p>
          <Link href="/shop" className="btn-primary">Ir para a Loja</Link>
        </div>
      </div>
    )
  }

  const field = (name: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, full = false) => (
    <div className={full ? 'md:col-span-2' : ''}>
      <label htmlFor={name} className="block text-sm font-medium text-redvelvet-900 mb-2">{label}</label>
      <input
        id={name}
        name={name}
        value={form[name]}
        onChange={onChange}
        aria-invalid={!!errors[name]}
        className={`input-field ${errors[name] ? 'border-red-500' : ''}`}
        {...props}
      />
      {errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container-luxury py-8 lg:py-12">
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-redvelvet-500 hover:text-redvelvet-600 mb-4">
            <ArrowLeft size={16} /> <span>Voltar ao carrinho</span>
          </Link>
          <h1 className="heading-luxury text-3xl">Finalizar compra</h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <section className="bg-white border border-redvelvet-100 p-6">
              <h2 className="text-xl font-serif font-semibold text-redvelvet-900 mb-6">Contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {field('nome', 'Nome completo *', { autoComplete: 'name' }, true)}
                {field('email', 'Email *', { type: 'email', autoComplete: 'email', placeholder: 'nome@email.com' })}
                {field('telefone', 'Telemóvel *', { type: 'tel', autoComplete: 'tel', placeholder: '912 345 678' })}
              </div>
            </section>

            <section className="bg-white border border-redvelvet-100 p-6">
              <h2 className="text-xl font-serif font-semibold text-redvelvet-900 mb-6">Morada de envio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="pais" className="block text-sm font-medium text-redvelvet-900 mb-2">País / região *</label>
                  <select id="pais" name="pais" value={form.pais} onChange={onChange} className="input-field">
                    {Object.entries(SHIPPING_COUNTRIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                {field('morada', 'Morada *', { autoComplete: 'street-address', placeholder: 'Rua, número, andar' }, true)}
                {field('codigo_postal', 'Código postal *', { autoComplete: 'postal-code', placeholder: '1000-000', inputMode: 'numeric' })}
                {field('cidade', 'Localidade *', { autoComplete: 'address-level2' })}
                {field('nif', 'NIF para fatura (opcional)', { inputMode: 'numeric', maxLength: 9 })}
                <div className="md:col-span-2">
                  <label htmlFor="notas" className="block text-sm font-medium text-redvelvet-900 mb-2">Notas (opcional)</label>
                  <textarea id="notas" name="notas" value={form.notas} onChange={onChange} rows={3} maxLength={500} className="input-field" placeholder="Ex.: embrulho para oferta, horário de entrega" />
                </div>
              </div>
            </section>

            <section className="bg-white border border-redvelvet-100 p-6">
              <h2 className="text-xl font-serif font-semibold text-redvelvet-900 mb-3">Pagamento</h2>
              <p className="text-sm text-redvelvet-700">
                Será redirecionado para a página segura da Mollie para pagar com <strong>MB WAY, Multibanco, cartão, Apple Pay</strong> ou outro método disponível.
              </p>
            </section>
          </div>

          <aside className="lg:col-span-2">
            <div className="bg-white border border-redvelvet-100 p-6 lg:sticky lg:top-28">
              <h2 className="text-xl font-serif font-semibold text-redvelvet-900 mb-6">Resumo</h2>
              <ul className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 bg-cream-100 overflow-hidden flex-shrink-0">
                      {item.imagem_url && <Image src={item.imagem_url} alt={item.nome} fill sizes="56px" className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-redvelvet-900 truncate">{item.nome}</p>
                      <p className="text-xs text-redvelvet-600">
                        {item.tamanho ? `Tamanho ${item.tamanho} · ` : ''}Qtd. {item.quantidade}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-redvelvet-900">{formatPrice(item.preco * item.quantidade)}</p>
                  </li>
                ))}
              </ul>

              <dl className="space-y-3 border-t border-redvelvet-100 pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-redvelvet-600">Subtotal</dt><dd>{formatPrice(cart.subtotal)}</dd></div>
                <div className="flex justify-between">
                  <dt className="text-redvelvet-600">Envio</dt>
                  <dd>{shipping === 0 ? <span className="text-green-700">Grátis</span> : formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-redvelvet-100 pt-3">
                  <dt>Total <span className="text-xs font-normal text-redvelvet-500">(IVA incluído)</span></dt>
                  <dd className="text-redvelvet-500">{formatPrice(total)}</dd>
                </div>
              </dl>

              <label className="flex items-start gap-3 mt-6 text-sm text-redvelvet-800">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => { setAcceptTerms(e.target.checked); setErrors((er) => ({ ...er, terms: undefined })) }}
                  className="mt-1"
                />
                <span>
                  Li e aceito os <Link href="/terms" target="_blank" className="underline">Termos e Condições</Link> e a{' '}
                  <Link href="/privacy" target="_blank" className="underline">Política de Privacidade</Link>.
                </span>
              </label>
              {errors.terms && <p className="text-red-600 text-sm mt-1">{errors.terms}</p>}

              {serverError && (
                <div role="alert" className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{serverError}</div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-6 py-4 px-6 font-medium bg-redvelvet-500 hover:bg-redvelvet-600 text-white disabled:opacity-60 disabled:cursor-wait transition-colors"
              >
                {isProcessing ? 'A redirecionar para o pagamento…' : `Encomendar e pagar ${formatPrice(total)}`}
              </button>

              <ul className="mt-6 space-y-2 text-xs text-redvelvet-600">
                <li className="flex items-center gap-2"><Lock size={14} className="text-green-700" /> Pagamento seguro processado pela Mollie</li>
                <li className="flex items-center gap-2"><Truck size={14} className="text-green-700" /> Envio grátis em Portugal Continental a partir de 50 €</li>
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-green-700" /> 14 dias para devolução</li>
              </ul>
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}
