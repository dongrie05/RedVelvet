'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ImportPanel from './ImportPanel'

type Product = { id: string; codigo: string; referencia: string; nome: string; categoria: string; preco: number; stock: number }

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    setSignedIn(!!session)
    if (!session) { setProducts([]); setLoading(false); return }
    try {
      const response = await fetch('/api/admin/stock', { headers: { Authorization: `Bearer ${session.access_token}` }, cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setProducts(result.data)
      setMessage('')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Erro ao carregar produtos.') }
    setLoading(false)
  }, [])
  useEffect(() => { void load() }, [load])
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('pt-PT')
    return products.filter(p => [p.nome, p.codigo, p.referencia].some(value => (value || '').toLocaleLowerCase('pt-PT').includes(term)))
  }, [products, query])
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setMessage('Não foi possível iniciar sessão. Confirme os dados.'); setLoading(false); return }
    setPassword(''); await load()
  }
  async function update(product: Product, stock: number) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setMessage('Sessão expirada. Inicie sessão novamente.'); setSignedIn(false); return }
    setBusy(product.id); setMessage('')
    try {
      const response = await fetch('/api/admin/stock', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ id: product.id, stock, previousStock: product.stock }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setProducts(current => current.map(p => p.id === product.id ? { ...p, stock: result.data.stock } : p))
      setMessage(`Stock de ${product.nome} atualizado para ${stock}.`)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Erro ao atualizar stock.') }
    setBusy(null)
  }
  return <main className="min-h-screen bg-cream-50 px-4 py-10"><div className="mx-auto max-w-5xl">
    <Link href="/" className="text-sm text-redvelvet-600">← Voltar à loja</Link>
    <h1 className="mt-4 text-3xl font-bold text-redvelvet-900">Gestão de stock</h1>
    <p className="mt-2 text-redvelvet-700">Registe aqui as vendas da loja física para atualizar a disponibilidade no site.</p>
    {message && <p role="status" className="mt-4 rounded bg-white p-4 text-redvelvet-800">{message}</p>}
    {!signedIn && !loading && <form onSubmit={login} className="mt-8 max-w-md space-y-4 rounded-lg bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Entrar</h2><label className="block">Email<input className="mt-1 w-full rounded border p-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><label className="block">Palavra-passe<input className="mt-1 w-full rounded border p-2" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label><button className="rounded bg-redvelvet-700 px-4 py-2 text-white">Entrar</button></form>}
    {loading && <p className="mt-6">A carregar…</p>}
    {signedIn && <><ImportPanel onDone={() => { void load() }} /><div className="mt-6 flex flex-wrap gap-3"><input aria-label="Pesquisar produtos" placeholder="Pesquisar por nome, código ou referência" value={query} onChange={e => setQuery(e.target.value)} className="min-w-0 flex-1 rounded border bg-white p-3" /><button onClick={() => void load()} className="rounded border bg-white px-4">Atualizar lista</button><button onClick={async () => { await supabase.auth.signOut(); setSignedIn(false); setProducts([]); setMessage('') }} className="rounded border bg-white px-4">Sair</button></div>
    <p className="my-4 text-sm text-redvelvet-700">{filtered.length} produtos · O stock do ZSBMS não é atualizado automaticamente.</p>
    <div className="space-y-3">{filtered.map(product => <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-sm"><div><p className="font-semibold">{product.nome}</p><p className="text-sm text-gray-600">Código {product.codigo} · {product.referencia}</p><p className="mt-1 text-sm">{product.stock > 0 ? `${product.stock} em stock` : 'Esgotado'}</p></div><div className="flex gap-2"><button disabled={busy !== null || product.stock <= 0} onClick={() => void update(product, product.stock - 1)} className="rounded bg-redvelvet-700 px-4 py-2 text-white disabled:opacity-40">Vendi 1</button><button disabled={busy !== null} onClick={() => void update(product, product.stock + 1)} className="rounded border px-4 py-2 disabled:opacity-40">Repor 1</button><button disabled={busy !== null || product.stock <= 0} onClick={() => void update(product, 0)} className="rounded border px-4 py-2 disabled:opacity-40">Esgotar</button></div></div>)}</div></>}
  </div></main>
}
