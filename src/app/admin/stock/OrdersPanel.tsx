'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type PendingOrder = { id: string; numero_pedido: string; status: string; stock_reserved: boolean; stock_reservation_version: number; payment_attempt_started: boolean; mollie_payment_id: string | null; created_at: string; total: number; email_cliente: string | null; nome_cliente: string | null; telefone_cliente: string | null; endereco_envio: { morada?: string; codigo_postal?: string; cidade?: string; pais_nome?: string } | null; lista_produtos: Array<{ nome?: string; quantidade?: number; tamanho?: string | null }> | null }

export default function OrdersPanel({ onChange }: { onChange: () => void }) {
  const [orders, setOrders] = useState<PendingOrder[]>([])
  const [message, setMessage] = useState('')
  const [total, setTotal] = useState(0)
  const [busy, setBusy] = useState(false)
  const [ids, setIds] = useState<Record<string, string>>({})
  const headers = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Sessão expirada. Entre novamente.')
    return { Authorization: `Bearer ${session.access_token}` }
  }
  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/orders', { headers: await headers(), cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setOrders(result.data); setTotal(result.total ?? result.data.length)
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Não foi possível obter encomendas.') }
  }, [])
  useEffect(() => { void load() }, [load])
  async function check(order: PendingOrder, action: 'verify' | 'cancel_unstarted' | 'mark_shipped' | 'resolve_stock_issue' = 'verify') {
    if (action === 'cancel_unstarted' && !window.confirm('Esta reserva não tem pagamento iniciado. Cancelar a encomenda e repor o stock?')) return
    if (action === 'resolve_stock_issue' && !window.confirm('Confirmas que há stock para esta encomenda paga? As unidades serão atribuídas à encomenda.')) return
    if (action === 'mark_shipped' && !window.confirm('Confirmas que esta encomenda já foi enviada?')) return
    setBusy(true); setMessage('')
    try {
      const paymentId = ids[order.id]?.trim() || undefined
      const response = await fetch('/api/admin/orders', { method: 'POST', headers: { ...await headers(), 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: order.id, paymentId, action }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setMessage(`Encomenda ${order.numero_pedido}: estado verificado (${result.status}).`)
      await load(); onChange()
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Não foi possível verificar o pagamento.') }
    setBusy(false)
  }
  return <section className="my-6 rounded-lg bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">Encomendas a acompanhar</h2><p className="text-sm text-gray-600">Prepare as encomendas pagas e acompanhe os pagamentos pendentes.</p></div><button type="button" onClick={() => void load()} disabled={busy} className="rounded border px-4 py-2">Atualizar</button></div>
    {total > orders.length && <p className="mt-3 text-sm">A apresentar {orders.length} de {total} encomendas. Consulte as restantes no Supabase.</p>}
    {message && <p role="status" className="mt-3 rounded bg-cream-50 p-3">{message}</p>}
    {orders.length === 0 ? <p className="mt-4 text-sm">Sem encomendas pagas ou pagamentos pendentes a acompanhar.</p> : <ul className="mt-4 space-y-3">{orders.map(order => <li key={order.id} className="rounded border p-3"><p className="font-semibold">{order.numero_pedido} · {Number(order.total).toFixed(2)} €</p><p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString('pt-PT')} · {order.email_cliente || 'Sem email'}</p><p className="mt-1 text-sm">{order.status === 'paid' ? 'Pagamento confirmado. Preparar e enviar a encomenda.' : order.status === 'paid_stock_issue' ? 'Pagamento confirmado: verificar disponibilidade e contactar o cliente.' : order.status === 'payment_setup_error' ? 'Não foi possível confirmar a criação do pagamento. Consulte a Mollie antes de libertar o stock.' : order.stock_reserved && !order.payment_attempt_started && order.stock_reservation_version === 1 ? 'A reserva foi criada, mas o pagamento não chegou a ser iniciado.' : order.stock_reserved ? 'A aguardar pagamento; stock reservado.' : 'Pagamento pendente sem reserva confirmada; verificar.'}</p>{order.status === 'paid_stock_issue' && <button type="button" disabled={busy} onClick={() => void check(order, 'resolve_stock_issue')} className="mt-3 rounded border px-3 py-2 text-sm disabled:opacity-40">Atribuir stock disponível</button>}{order.status === 'paid' && <div className="mt-3 space-y-2 text-sm"><p><strong>Cliente:</strong> {order.nome_cliente || '—'} · {order.telefone_cliente || '—'}</p><p><strong>Envio:</strong> {[order.endereco_envio?.morada, order.endereco_envio?.codigo_postal, order.endereco_envio?.cidade, order.endereco_envio?.pais_nome].filter(Boolean).join(', ') || '—'}</p><ul className="list-inside list-disc">{Array.isArray(order.lista_produtos) && order.lista_produtos.map((item, index) => <li key={index}>{item.quantidade} × {item.nome}{item.tamanho ? ` · ${item.tamanho}` : ''}</li>)}</ul><button type="button" disabled={busy} onClick={() => void check(order, 'mark_shipped')} className="rounded bg-redvelvet-700 px-3 py-2 text-white disabled:opacity-40">Marcar como enviada</button><p className="text-xs text-gray-600">Esta ação regista o envio; não envia uma mensagem ao cliente.</p></div>}{order.status !== 'paid_stock_issue' && order.status !== 'paid' && <div className="mt-3 flex flex-wrap gap-2">{order.stock_reserved && !order.payment_attempt_started && order.stock_reservation_version === 1 && <button type="button" disabled={busy} onClick={() => void check(order, 'cancel_unstarted')} className="rounded border px-3 py-2 text-sm disabled:opacity-40">Cancelar e repor stock</button>}{!order.mollie_payment_id && <input aria-label={`Identificador Mollie da encomenda ${order.numero_pedido}`} placeholder="ID Mollie (tr_...)" value={ids[order.id] || ''} onChange={e => setIds(v => ({ ...v, [order.id]: e.target.value }))} className="rounded border p-2 text-sm" />}<button type="button" disabled={busy} onClick={() => void check(order)} className="rounded border px-3 py-2 text-sm disabled:opacity-40">Verificar na Mollie</button></div>}</li>)}</ul>}
  </section>
}
