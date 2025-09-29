 'use client'

import { useState, useEffect, useCallback } from 'react'
import { CartItem, Cart } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

const CART_STORAGE_KEY = 'redvelvet_cart'

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0
  })
  const { user } = useAuth()
  const [cartId, setCartId] = useState<string | null>(null)

  const normalizeSize = (t?: string | null) => (t ? t.trim() : '')

  // Calculate totals (defined before effects that depend on it)
  const calculateTotals = useCallback((items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0)
    const shipping = subtotal >= 50 ? 0 : subtotal >= 25 ? 3.50 : 5.90
    const total = subtotal + shipping

    return { subtotal, shipping, total }
  }, [])

  // Load cart from Supabase (if logged) or localStorage
  useEffect(() => {
    const load = async () => {
      if (user) {
        try {
          const { data: customer } = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', user.id)
            .single()

          if (!customer) {
            return
          }

          // Ensure cart exists
          const { data: existingCart } = await supabase
            .from('carts')
            .select('id')
            .eq('cliente_id', customer.id)
            .single()

          let ensuredCartId = existingCart?.id as string | undefined
          if (!ensuredCartId) {
            const { data: created, error: createErr } = await supabase
              .from('carts')
              .insert({ cliente_id: customer.id })
              .select('id')
              .single()
            if (createErr != null) {
              console.error('Error creating cart:', createErr)
            }
            ensuredCartId = created?.id
          }

          if (ensuredCartId) {
            setCartId(ensuredCartId)
            const { data: items, error } = await supabase
              .from('cart_items')
              .select('id, produto_id, quantidade, preco, tamanho, products:products ( imagem_url, nome )')
              .eq('cart_id', ensuredCartId)

            if (error) {
              console.error('Error loading cart items:', error)
            } else {
              // Consolidate possible duplicates (same product and empty size)
              const raw = (items || []).map((it: any) => ({
                id: it.id,
                produto_id: it.produto_id,
                nome: it.products?.nome || 'Produto',
                preco: typeof it.preco === 'string' ? Number(it.preco) : it.preco,
                quantidade: it.quantidade,
                tamanho: normalizeSize(it.tamanho) || undefined,
                imagem_url: it.products?.imagem_url || undefined,
              }))

              const grouped = new Map<string, CartItem>()
              raw.forEach((it) => {
                const key = `${it.produto_id}__${normalizeSize(it.tamanho)}`
                const existing = grouped.get(key)
                if (existing) {
                  existing.quantidade += it.quantidade
                } else {
                  grouped.set(key, { ...it })
                }
              })
              const consolidated = Array.from(grouped.values())
              const totals = calculateTotals(consolidated)
              setCart({ items: consolidated, ...totals })
            }
          }
        } catch (e) {
          console.error('Error loading cart:', e)
        }
      } else if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY)
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart))
          } catch (error) {
            console.error('Error loading cart from localStorage:', error)
          }
        }
      }
    }
    load()
  }, [user, calculateTotals])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart])

  // Ensure badge reflects cleared state even if component order delays
  useEffect(() => {
    // If subtotal and items are zero, normalize items array
    if ((cart.subtotal === 0 || !cart.subtotal) && cart.items.length === 0) {
      // no-op, state already empty; this effect exists to force re-render order in some cases
    }
  }, [cart.items.length, cart.subtotal])

  // Calculate totals

  // Add item to cart
  const addToCart = useCallback(async (item: Omit<CartItem, 'id'>) => {
    if (user && cartId) {
      try {
        // Upsert by unique (cart_id, produto_id, tamanho)
        const size = normalizeSize(item.tamanho)
        const { data: existing } = await supabase
          .from('cart_items')
          .select('id, quantidade')
          .eq('cart_id', cartId)
          .eq('produto_id', item.produto_id)
          .eq('tamanho', size)
          .single()

        if (existing) {
          await supabase
            .from('cart_items')
            .update({ quantidade: existing.quantidade + item.quantidade })
            .eq('id', existing.id)
        } else {
          await supabase
            .from('cart_items')
            .insert({
              cart_id: cartId,
              produto_id: item.produto_id,
              quantidade: item.quantidade,
              preco: item.preco,
              tamanho: size,
            })
        }
        // optimistic local update
        setCart(prev => {
          const idx = prev.items.findIndex(
            i => i.produto_id === item.produto_id && normalizeSize(i.tamanho) === size
          )
          let items = [...prev.items]
          if (idx >= 0) {
            items[idx] = { ...items[idx], quantidade: items[idx].quantidade + item.quantidade }
          } else {
            items.push({ ...item, tamanho: size || undefined, id: `${item.produto_id}_${size || 'default'}` })
          }
          return { ...prev, items, ...calculateTotals(items) }
        })
        // Force recompute badge quickly after optimistic update
        try { window.dispatchEvent(new Event('cart:added')) } catch (_) {}
      } catch (e) {
        console.error('Error adding to cart (supabase):', e)
      }
    } else {
      // Local fallback
      setCart(prevCart => {
        const existingItemIndex = prevCart.items.findIndex(
          cartItem => cartItem.produto_id === item.produto_id && normalizeSize(cartItem.tamanho) === normalizeSize(item.tamanho)
        )
        let newItems: CartItem[]
        if (existingItemIndex >= 0) {
          newItems = prevCart.items.map((cartItem, index) =>
            index === existingItemIndex
              ? { ...cartItem, quantidade: cartItem.quantidade + item.quantidade }
              : cartItem
          )
        } else {
          const newItem: CartItem = {
            ...item,
            tamanho: normalizeSize(item.tamanho) || undefined,
            id: `${item.produto_id}_${normalizeSize(item.tamanho) || 'default'}_${Date.now()}`
          }
          newItems = [...prevCart.items, newItem]
        }
        const totals = calculateTotals(newItems)
        return { items: newItems, ...totals }
      })
    }
  }, [user, cartId, calculateTotals])

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId: string) => {
    if (user && cartId) {
      try {
        await supabase.from('cart_items').delete().eq('id', itemId)
      } catch (e) {
        console.error('Error removing from cart (supabase):', e)
      }
    }
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== itemId)
      const totals = calculateTotals(newItems)
      return { items: newItems, ...totals }
    })
  }, [user, cartId, calculateTotals])

  // Update item quantity
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    if (user && cartId) {
      try {
        await supabase.from('cart_items').update({ quantidade: quantity }).eq('id', itemId)
      } catch (e) {
        console.error('Error updating quantity (supabase):', e)
      }
    }
    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantidade: quantity } : item
      )
      const totals = calculateTotals(newItems)
      return { items: newItems, ...totals }
    })
  }, [calculateTotals, removeFromCart, user, cartId])

  // Clear cart
  const clearCart = useCallback(async () => {
    if (user && cartId) {
      try {
        await supabase.from('cart_items').delete().eq('cart_id', cartId)
      } catch (e) {
        console.error('Error clearing cart (supabase):', e)
      }
    }
    setCart({ items: [], subtotal: 0, shipping: 0, total: 0 })
  }, [user, cartId])

  // Subscribe to realtime changes for live badge updates
  useEffect(() => {
    if (!cartId) return
    const channel = supabase
      .channel(`cart_${cartId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cart_items', filter: `cart_id=eq.${cartId}` }, async () => {
        // Reload items
        try {
          const { data: items } = await supabase
            .from('cart_items')
            .select('id, produto_id, quantidade, preco, tamanho, products:products ( imagem_url, nome )')
            .eq('cart_id', cartId)
          const mapped: CartItem[] = (items || []).map((it: any) => ({
            id: it.id,
            produto_id: it.produto_id,
            nome: it.products?.nome || 'Produto',
            preco: typeof it.preco === 'string' ? Number(it.preco) : it.preco,
            quantidade: it.quantidade,
            tamanho: normalizeSize(it.tamanho) || undefined,
            imagem_url: it.products?.imagem_url || undefined,
          }))
          // consolidate
          const grouped = new Map<string, CartItem>()
          mapped.forEach((it) => {
            const key = `${it.produto_id}__${normalizeSize(it.tamanho)}`
            const existing = grouped.get(key)
            if (existing) existing.quantidade += it.quantidade
            else grouped.set(key, { ...it })
          })
          const consolidated = Array.from(grouped.values())
          setCart({ items: consolidated, ...calculateTotals(consolidated) })
        } catch (_) {}
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [cartId, calculateTotals])

  // Get item count
  const getItemCount = useCallback(() => {
    if (!cart || !Array.isArray(cart.items)) return 0
    return cart.items.reduce((sum, item) => sum + (item.quantidade || 0), 0)
  }, [cart.items])

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemCount
  }
}
