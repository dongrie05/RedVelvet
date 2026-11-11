'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { CartItem, Cart } from '@/types'
import { calculateShipping, MAX_QTY_PER_ITEM, round2 } from '@/lib/shop'

/**
 * Carrinho guardado no browser (localStorage) e partilhado entre todos os
 * componentes (header, página do carrinho, checkout) através de um store.
 * O preço final é SEMPRE recalculado no servidor no checkout.
 */
const CART_STORAGE_KEY = 'redvelvet_cart'
const EMPTY: Cart = { items: [], subtotal: 0, shipping: 0, total: 0 }

let state: Cart = EMPTY
let loaded = false
const listeners = new Set<() => void>()

const keyOf = (produtoId: string, tamanho?: string) => `${produtoId}__${(tamanho || '').trim()}`

function build(items: CartItem[]): Cart {
  const subtotal = round2(items.reduce((s, i) => s + i.preco * i.quantidade, 0))
  const shipping = calculateShipping(subtotal)
  return { items, subtotal, shipping, total: round2(subtotal + shipping) }
}

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    const items: CartItem[] = Array.isArray(parsed?.items)
      ? parsed.items.filter((i: CartItem) => i && i.produto_id && i.quantidade > 0)
      : []
    state = build(items.map((i) => ({ ...i, id: keyOf(i.produto_id, i.tamanho) })))
  } catch {
    state = EMPTY
  }
}

function set(items: CartItem[]) {
  state = build(items)
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state)) } catch {}
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) { loaded = false; load(); listener() }
  }
  window.addEventListener('storage', onStorage)
  return () => { listeners.delete(listener); window.removeEventListener('storage', onStorage) }
}

function getSnapshot() { load(); return state }
function getServerSnapshot() { return EMPTY }

export const useCart = () => {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    load()
    const id = keyOf(item.produto_id, item.tamanho)
    const tamanho = item.tamanho?.trim() || undefined
    const existing = state.items.find((i) => i.id === id)
    const items = existing
      ? state.items.map((i) => i.id === id ? { ...i, quantidade: Math.min(MAX_QTY_PER_ITEM, i.quantidade + item.quantidade) } : i)
      : [...state.items, { ...item, tamanho, id, quantidade: Math.min(MAX_QTY_PER_ITEM, item.quantidade) }]
    set(items)
    try { window.dispatchEvent(new Event('cart:added')) } catch {}
  }, [])

  const removeFromCart = useCallback((itemId: string) => {
    set(state.items.filter((i) => i.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) { set(state.items.filter((i) => i.id !== itemId)); return }
    set(state.items.map((i) => i.id === itemId ? { ...i, quantidade: Math.min(MAX_QTY_PER_ITEM, quantity) } : i))
  }, [])

  const clearCart = useCallback(() => set([]), [])

  const getItemCount = useCallback(() => cart.items.reduce((s, i) => s + (i.quantidade || 0), 0), [cart.items])

  return { cart, addToCart, updateQuantity, removeFromCart, clearCart, getItemCount }
}
