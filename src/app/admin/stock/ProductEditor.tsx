'use client'

import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export type EditableProduct = { id: string; nome: string; descricao: string | null; categoria: string; preco: number; tamanhos: string[] | null; imagem_url: string | null; galeria: string[] | null; updated_at: string }

export default function ProductEditor({ product, onClose, onSaved }: { product: EditableProduct; onClose: () => void; onSaved: () => void }) {
  const [nome, setNome] = useState(product.nome)
  const [descricao, setDescricao] = useState(product.descricao || '')
  const [categoria, setCategoria] = useState(product.categoria)
  const [preco, setPreco] = useState(String(product.preco))
  const [tamanhos, setTamanhos] = useState(Array.isArray(product.tamanhos) ? product.tamanhos.join(', ') : '')
  const [images, setImages] = useState<string[]>([product.imagem_url, ...(Array.isArray(product.galeria) ? product.galeria : [])].filter((url): url is string => typeof url === 'string' && !!url).slice(0, 3))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function token() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Sessão expirada. Entre novamente.')
    return session.access_token
  }
  async function upload(file: File) {
    if (images.length >= 3) return
    setBusy(true); setError('')
    try {
      if (file.size > 3 * 1024 * 1024) throw new Error('A fotografia deve ter até 3 MB.')
      const form = new FormData(); form.append('productId', product.id); form.append('file', file)
      const response = await fetch('/api/admin/product-image', { method: 'POST', headers: { Authorization: `Bearer ${await token()}` }, body: form })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setImages(current => [...current, result.url])
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível carregar a fotografia.') }
    setBusy(false)
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const amount = Number(preco.replace(',', '.'))
      if (!preco.trim() || !Number.isFinite(amount) || amount < 0) throw new Error('Indique um preço válido.')
      const response = await fetch('/api/admin/product', { method: 'PATCH', headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: product.id, updated_at: product.updated_at, nome, descricao, categoria, preco: amount, tamanhos: tamanhos.split(',').map(s => s.trim()).filter(Boolean), images }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      onSaved()
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível guardar.') }
    setBusy(false)
  }
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="editor-title"><form onSubmit={save} className="mx-auto my-4 max-w-2xl space-y-4 rounded-lg bg-white p-6 shadow-lg">
    <div className="flex items-start justify-between gap-4"><div><h2 id="editor-title" className="text-2xl font-semibold">Editar produto</h2><p className="text-sm text-gray-600">Adicione fotografias e prepare a informação para a loja.</p></div><button type="button" onClick={onClose} disabled={busy} className="rounded border px-3 py-1">Fechar</button></div>
    {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-800">{error}</p>}
    <label className="block text-sm font-medium">Nome<input value={nome} onChange={e => setNome(e.target.value)} required maxLength={255} className="mt-1 w-full rounded border p-2" /></label>
    <label className="block text-sm font-medium">Descrição<textarea value={descricao} onChange={e => setDescricao(e.target.value)} maxLength={10000} rows={4} className="mt-1 w-full rounded border p-2" /></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Categoria<input value={categoria} onChange={e => setCategoria(e.target.value)} required maxLength={100} className="mt-1 w-full rounded border p-2" /></label><label className="block text-sm font-medium">Preço (€)<input value={preco} onChange={e => setPreco(e.target.value)} required inputMode="decimal" className="mt-1 w-full rounded border p-2" /></label></div>
    <label className="block text-sm font-medium">Tamanhos disponíveis <span className="font-normal text-gray-500">(opcional, separados por vírgulas)</span><input value={tamanhos} onChange={e => setTamanhos(e.target.value)} placeholder="Ex.: S, M, L" className="mt-1 w-full rounded border p-2" /></label>
    <p className="text-sm text-gray-600">O preço será atualizado pelo relatório do ZSBMS quando voltar a importar este produto.</p>
    <div><h3 className="font-semibold">Fotografias ({images.length}/3)</h3><p className="text-sm text-gray-600">A primeira é a imagem principal. JPEG, PNG ou WebP, até 3 MB cada.</p><div className="mt-3 flex flex-wrap gap-3">{images.map((url, index) => <div key={url} className="w-32 rounded border p-2"><Image src={url} alt={`Fotografia ${index + 1}`} width={112} height={112} unoptimized className="h-28 w-full object-cover" /><p className="mt-1 text-xs">{index === 0 ? 'Principal' : `Fotografia ${index + 1}`}</p><div className="mt-1 flex gap-2">{index > 0 && <button type="button" disabled={busy} onClick={() => setImages(current => [url, ...current.filter(v => v !== url)])} className="text-xs underline">Tornar principal</button>}<button type="button" disabled={busy} onClick={() => setImages(current => current.filter(v => v !== url))} className="text-xs underline">Retirar</button></div></div>)}</div>
    {images.length < 3 && <label className="mt-3 inline-block cursor-pointer rounded border px-4 py-2 text-sm">{busy ? 'A carregar…' : 'Adicionar fotografia'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} className="sr-only" onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (file) void upload(file) }} /></label>}</div>
    <div className="flex flex-wrap gap-3"><button type="submit" disabled={busy} className="rounded bg-redvelvet-700 px-5 py-2 text-white disabled:opacity-40">{busy ? 'Aguarde…' : 'Guardar alterações'}</button><button type="button" onClick={onClose} disabled={busy} className="rounded border px-5 py-2">Cancelar</button></div>
  </form></div>
}
