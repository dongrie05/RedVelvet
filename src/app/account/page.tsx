'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Heart, Loader2, LogOut, MessageCircle, Package, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWishlist } from '@/hooks/useWishlist'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/product/ProductCard'
import PasswordInput from '@/components/auth/PasswordInput'
import { authErrorPt } from '@/lib/authErrors'
import { BUSINESS } from '@/lib/business'
import { formatPrice } from '@/lib/shop'

type Line = { nome: string; quantidade: number; total?: number; preco_unitario?: number; tamanho?: string | null; produto_id?: string }
type OrderRow = {
  id: string; numero_pedido?: string; total: number; subtotal?: number; custo_envio?: number
  status: string; created_at: string; lista_produtos: Line[] | null
  endereco_envio?: { morada?: string; cidade?: string; codigo_postal?: string; pais_nome?: string } | null
}

const STATUS: Record<string, { label: string; tone: string; step: number }> = {
  pending: { label: 'A aguardar pagamento', tone: 'bg-[#fbf1dc] text-[#7a5410]', step: 0 },
  paid: { label: 'Paga · em preparação', tone: 'bg-[#eef7f1] text-[#22603b]', step: 1 },
  shipped: { label: 'Enviada', tone: 'bg-[#e9f0fb] text-[#23477a]', step: 2 },
  delivered: { label: 'Entregue', tone: 'bg-[#1c1012]/[.06] text-[#1c1012]/70', step: 3 },
}
const STEPS = ['Paga', 'Enviada', 'Entregue']

type Tab = 'encomendas' | 'favoritos' | 'dados'
const TABS: { id: Tab; label: string }[] = [
  { id: 'encomendas', label: 'Encomendas' },
  { id: 'favoritos', label: 'Favoritos' },
  { id: 'dados', label: 'Dados pessoais' },
]

const chip = (active: boolean) =>
  `inline-flex h-[38px] shrink-0 items-center gap-1 rounded-full border px-4 text-sm transition-colors ${
    active ? 'border-[#210a0f] bg-[#210a0f] text-[#f7efe9]' : 'border-[#1c1012]/15 text-[#1c1012]/80 hover:border-[#1c1012]/35 hover:text-[#1c1012]'
  }`
const darkBtn = 'inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#210a0f] px-6 text-[15px] font-medium text-[#f7efe9] transition-colors hover:bg-[#3a1219] disabled:cursor-wait disabled:opacity-70'
const notice = {
  ok: 'rounded-xl border border-[#cfe5d6] bg-[#eef7f1] p-3.5 text-sm text-[#22603b]',
  err: 'rounded-xl border border-[#f5c2c9] bg-[#fdecee] p-3.5 text-sm text-[#8a1c2b]',
}

function OrderCard({ order }: { order: OrderRow }) {
  const s = STATUS[order.status] ?? { label: order.status, tone: 'bg-[#1c1012]/[.06] text-[#1c1012]/70', step: 0 }
  const lines = Array.isArray(order.lista_produtos) ? order.lista_produtos : []
  const count = lines.reduce((n, l) => n + (l.quantidade || 1), 0)
  const numero = order.numero_pedido || order.id.slice(0, 8).toUpperCase()
  const addr = order.endereco_envio
  const wa = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Olá! Tenho uma questão sobre a encomenda ${numero}.`)}`

  return (
    <details className="group rounded-[20px] bg-white">
      <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2.5 p-5 md:flex md:p-6 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 md:flex-1">
          <p className="text-[15px] font-medium text-[#1c1012]">{numero}</p>
          <p className="mt-0.5 text-[13px] text-[#6b5a5c]">
            {new Date(order.created_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })} · {count} {count === 1 ? 'artigo' : 'artigos'}
          </p>
        </div>
        <ChevronDown size={18} className="justify-self-end text-[#1c1012]/50 transition-transform duration-200 group-open:rotate-180 md:order-last" aria-hidden />
        <span className={`justify-self-start rounded-full px-2.5 py-1 text-xs font-medium ${s.tone}`}>{s.label}</span>
        <span className="justify-self-end text-[15px] font-medium tabular-nums text-[#1c1012]">{formatPrice(Number(order.total))}</span>
      </summary>

      <div className="border-t border-[#1c1012]/[.08] px-5 pb-6 pt-5 md:px-6">
        {s.step > 0 && (
          <ol className="mb-6 grid grid-cols-3 gap-2" aria-label="Progresso da encomenda">
            {STEPS.map((label, i) => (
              <li key={label}>
                <div className={`h-1 rounded-full ${i < s.step ? 'bg-[#2f7d4f]' : 'bg-[#1c1012]/10'}`} />
                <p className={`mt-2 text-xs ${i < s.step ? 'text-[#1c1012]' : 'text-[#6b5a5c]'}`}>{label}</p>
              </li>
            ))}
          </ol>
        )}
        {order.status === 'pending' && (
          <p className="mb-5 text-sm text-[#6b5a5c]">Ainda não recebemos o pagamento. Se pagou por Multibanco, a confirmação pode demorar algumas horas.</p>
        )}
        <ul className="space-y-2.5 text-sm">
          {lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-4">
              <span className="text-[#1c1012]/85">
                {l.quantidade}× {l.produto_id ? <Link href={`/product/${l.produto_id}/`} className="hover:underline hover:underline-offset-4">{l.nome}</Link> : l.nome}
                {l.tamanho ? <span className="text-[#6b5a5c]"> · {l.tamanho}</span> : null}
              </span>
              <span className="tabular-nums text-[#1c1012]">{formatPrice(Number(l.total ?? (l.preco_unitario ?? 0) * l.quantidade))}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 border-t border-[#1c1012]/[.08] pt-4 text-sm text-[#1c1012]">
          {order.subtotal != null && <div className="flex justify-between"><dt className="text-[#6b5a5c]">Subtotal</dt><dd className="tabular-nums">{formatPrice(Number(order.subtotal))}</dd></div>}
          {order.custo_envio != null && <div className="flex justify-between"><dt className="text-[#6b5a5c]">Envio</dt><dd className="tabular-nums">{Number(order.custo_envio) === 0 ? 'Grátis' : formatPrice(Number(order.custo_envio))}</dd></div>}
          <div className="flex justify-between font-medium"><dt>Total</dt><dd className="tabular-nums">{formatPrice(Number(order.total))}</dd></div>
        </dl>
        <div className="mt-5 flex flex-col gap-4 text-sm sm:flex-row sm:items-end sm:justify-between">
          {addr?.morada && (
            <p className="text-[#6b5a5c]">
              <span className="block text-xs uppercase tracking-[0.18em]">Enviar para</span>
              {addr.morada}, {addr.codigo_postal} {addr.cidade}{addr.pais_nome ? ` · ${addr.pais_nome}` : ''}
            </p>
          )}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#1c1012] underline underline-offset-4">
            <MessageCircle size={15} /> Ajuda com esta encomenda
          </a>
        </div>
      </div>
    </details>
  )
}

function AccountContent() {
  const { user, signOut, loading, updateProfile, updatePassword } = useAuth()
  const { wishlist, removeFromWishlist } = useWishlist()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const tab = (TABS.find((t) => t.id === params.get('tab'))?.id ?? 'encomendas') as Tab
  const [orders, setOrders] = useState<OrderRow[] | null>(null)
  const [ordersError, setOrdersError] = useState(false)

  const [profile, setProfile] = useState({ nome: '', telefone: '', endereco: '' })
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [savingPw, setSavingPw] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login/?next=/account/')
  }, [user, loading, router])

  useEffect(() => {
    if (user) setProfile({ nome: user.nome || '', telefone: user.telefone || '', endereco: user.endereco || '' })
  }, [user])

  useEffect(() => {
    if (!user) return
    // RLS devolve apenas as encomendas do próprio cliente (por conta ou email)
    supabase
      .from('orders')
      .select('id, numero_pedido, total, subtotal, custo_envio, status, created_at, lista_produtos, endereco_envio')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('Erro a carregar encomendas', error); setOrdersError(true); setOrders([]) }
        else setOrders((data || []) as OrderRow[])
      })
  }, [user])

  const setTab = (t: Tab) => router.replace(t === 'encomendas' ? pathname : `${pathname}?tab=${t}`, { scroll: false })

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile.nome.trim()) { setProfileMsg({ ok: false, text: 'O nome não pode ficar vazio.' }); return }
    setSavingProfile(true); setProfileMsg(null)
    const { error } = await updateProfile({ nome: profile.nome.trim(), telefone: profile.telefone.trim(), endereco: profile.endereco.trim() })
    setProfileMsg(error ? { ok: false, text: authErrorPt(error.message) } : { ok: true, text: 'Dados guardados. Vão aparecer já preenchidos no checkout.' })
    setSavingProfile(false)
  }

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) { setPwMsg({ ok: false, text: 'Use pelo menos 8 caracteres.' }); return }
    setSavingPw(true); setPwMsg(null)
    const { error } = await updatePassword(newPassword)
    setPwMsg(error ? { ok: false, text: authErrorPt(error.message) } : { ok: true, text: 'Palavra-passe alterada.' })
    if (!error) setNewPassword('')
    setSavingPw(false)
  }

  const handleSignOut = async () => { await signOut(); router.push('/') }

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f7f3ee]">
        <Loader2 size={28} className="animate-spin text-[#1c1012]/40" aria-label="A carregar" />
      </div>
    )
  }

  const firstName = (user.nome || '').trim().split(/\s+/)[0]

  return (
    <div className="min-h-[70vh] bg-[#f7f3ee]">
      <header className="container-luxury pb-8 pt-[clamp(32px,5vw,64px)]">
        <p className="rv-rise flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.28em] text-redvelvet-500">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-redvelvet-500" /> A minha conta
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="rv-rise font-serif text-[clamp(36px,4.6vw,64px)] font-normal leading-none tracking-[-0.025em] text-[#1c1012]" style={{ animationDelay: '.06s' }}>
              Olá{firstName ? ',' : ''} <em className="italic text-[#8a5a60]">{firstName ? `${firstName}.` : 'de novo.'}</em>
            </h1>
            <p className="mt-2 text-sm text-[#6b5a5c]">{user.email}</p>
          </div>
          <button type="button" onClick={handleSignOut} className="inline-flex items-center gap-1.5 text-sm text-[#6b5a5c] hover:text-[#1c1012]">
            <LogOut size={15} /> Terminar sessão
          </button>
        </div>
        <nav aria-label="Secções da conta" className="-mx-8 mt-8 flex gap-2 overflow-x-auto px-8 [scrollbar-width:none] sm:-mx-12 sm:px-12 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} className={chip(tab === t.id)} aria-current={tab === t.id ? 'page' : undefined}>
              {t.label}
              {t.id === 'encomendas' && orders && orders.length > 0 && <sup className="text-[10px] opacity-60">{orders.length}</sup>}
              {t.id === 'favoritos' && wishlist.length > 0 && <sup className="text-[10px] opacity-60">{wishlist.length}</sup>}
            </button>
          ))}
        </nav>
      </header>

      <div className="container-luxury pb-[120px]">
        {tab === 'encomendas' && (
          orders === null ? (
            <div className="space-y-3" aria-label="A carregar encomendas">
              {[0, 1].map((i) => <div key={i} className="h-[84px] animate-pulse rounded-[20px] bg-white/60" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-[24px] bg-white px-6 py-16 text-center">
              <Package size={28} className="mx-auto text-redvelvet-500" />
              <p className="mt-4 font-serif text-[26px] text-[#1c1012]">Ainda sem <em className="italic text-[#8a5a60]">encomendas.</em></p>
              <p className="mx-auto mt-2 max-w-[28rem] text-[15px] text-[#6b5a5c]">
                {ordersError ? 'Não conseguimos carregar as encomendas agora. Tente mais tarde.' : 'Quando fizer uma compra com este email, ela aparece aqui — mesmo que a tenha feito sem iniciar sessão.'}
              </p>
              <Link href="/shop/" className={`${darkBtn} mt-7`}>Ver a loja</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => <OrderCard key={o.id} order={o} />)}
            </div>
          )
        )}

        {tab === 'favoritos' && (
          wishlist.length === 0 ? (
            <div className="rounded-[24px] bg-white px-6 py-16 text-center">
              <Heart size={28} className="mx-auto text-redvelvet-500" />
              <p className="mt-4 font-serif text-[26px] text-[#1c1012]">Ainda sem <em className="italic text-[#8a5a60]">favoritos.</em></p>
              <p className="mx-auto mt-2 max-w-[28rem] text-[15px] text-[#6b5a5c]">Toque em “Favoritos” na página de uma peça para a guardar aqui.</p>
              <Link href="/shop/" className={`${darkBtn} mt-7`}>Ver a loja</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 md:gap-x-5 md:gap-y-10 xl:grid-cols-4">
              {wishlist.map((p) => (
                <div key={p.id} className="relative">
                  <ProductCard product={p} />
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(p.id)}
                    aria-label={`Remover ${p.nome} dos favoritos`}
                    className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#f7efe9]/95 text-[#1c1012] shadow-[0_4px_14px_rgba(0,0,0,.12)] backdrop-blur hover:bg-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'dados' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <form onSubmit={saveProfile} noValidate className="rounded-[24px] bg-white p-6 md:p-9 lg:col-span-7">
              <h2 className="font-serif text-[22px] font-normal text-[#1c1012]">Dados de envio</h2>
              <p className="mt-1.5 text-sm text-[#6b5a5c]">Usamos estes dados para preencher o checkout mais depressa.</p>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="p-nome" className="rv-label">Nome</label>
                  <input id="p-nome" value={profile.nome} onChange={(e) => setProfile((v) => ({ ...v, nome: e.target.value }))} autoComplete="name" className="rv-input" />
                </div>
                <div>
                  <label htmlFor="p-email" className="rv-label">Email</label>
                  <input id="p-email" value={user.email} readOnly className="rv-input !bg-[#f7f3ee] text-[#6b5a5c]" />
                </div>
                <div>
                  <label htmlFor="p-tel" className="rv-label">Telemóvel</label>
                  <input id="p-tel" type="tel" value={profile.telefone} onChange={(e) => setProfile((v) => ({ ...v, telefone: e.target.value }))} autoComplete="tel" placeholder="912 345 678" className="rv-input" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="p-morada" className="rv-label">Morada</label>
                  <input id="p-morada" value={profile.endereco} onChange={(e) => setProfile((v) => ({ ...v, endereco: e.target.value }))} autoComplete="street-address" placeholder="Rua, número, andar" className="rv-input" />
                </div>
              </div>
              {profileMsg && <div role="status" className={`mt-5 ${profileMsg.ok ? notice.ok : notice.err}`}>{profileMsg.text}</div>}
              <button type="submit" disabled={savingProfile} className={`${darkBtn} mt-6`}>
                {savingProfile ? <><Loader2 size={16} className="animate-spin" /> A guardar…</> : 'Guardar dados'}
              </button>
            </form>

            <div className="space-y-6 lg:col-span-5">
              <form onSubmit={savePassword} noValidate className="rounded-[24px] bg-white p-6 md:p-8">
                <h2 className="font-serif text-[22px] font-normal text-[#1c1012]">Palavra-passe</h2>
                <div className="mt-5">
                  <label htmlFor="p-pw" className="rv-label">Nova palavra-passe</label>
                  <PasswordInput id="p-pw" autoComplete="new-password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPwMsg(null) }} />
                  <p className="mt-1.5 text-[12.5px] text-[#6b5a5c]">Pelo menos 8 caracteres</p>
                </div>
                {pwMsg && <div role="status" className={`mt-4 ${pwMsg.ok ? notice.ok : notice.err}`}>{pwMsg.text}</div>}
                <button type="submit" disabled={savingPw} className={`${darkBtn} mt-5`}>
                  {savingPw ? <><Loader2 size={16} className="animate-spin" /> A guardar…</> : 'Alterar palavra-passe'}
                </button>
              </form>
              <div className="rounded-[24px] border border-[#1c1012]/[.1] p-6 text-sm leading-relaxed text-[#6b5a5c] md:p-8">
                <h2 className="font-serif text-[20px] font-normal text-[#1c1012]">Os seus dados</h2>
                <p className="mt-2">
                  Pode pedir uma cópia ou a eliminação da sua conta e dados a qualquer momento por email para{' '}
                  <a href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent('Pedido RGPD — ' + user.email)}`} className="text-[#1c1012] underline underline-offset-4">{BUSINESS.email}</a>.
                  {' '}Mais informação na <Link href="/privacy/" className="text-[#1c1012] underline underline-offset-4">Política de Privacidade</Link>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AccountPage() {
  return <Suspense><AccountContent /></Suspense>
}
