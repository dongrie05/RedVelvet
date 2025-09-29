'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/supabase'
import { useAuth } from './useAuth'

const WISHLIST_STORAGE_KEY = 'redvelvet_wishlist'

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const { user } = useAuth()

  // Validate UUID v1-v5
  const isUuid = (value: string | null | undefined) => {
    if (!value) return false
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  }

  // Load wishlist from Supabase or localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        // Load from Supabase for authenticated users
        try {
          console.log('❤️ Loading wishlist from Supabase for user:', user.id)
          const { data: customer } = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', user.id)
            .single()

          if (customer) {
            console.log('❤️ Customer found:', customer.id)
            const { data: wishlistData, error } = await supabase
              .from('wishlist')
              .select(`
                produto_id,
                products (
                  id,
                  codigo,
                  referencia,
                  nome,
                  descricao,
                  categoria,
                  preco,
                  stock,
                  tamanhos,
                  imagem_url,
                  iva,
                  created_at,
                  updated_at
                )
              `)
              .eq('cliente_id', customer.id)

            if (error) {
              console.error('Error loading wishlist from Supabase:', error)
              console.log('❤️ Falling back to localStorage')
              // Fallback to localStorage
              loadFromLocalStorage()
            } else {
              console.log('❤️ Wishlist data from Supabase:', wishlistData)
              const products = wishlistData?.map(item => item.products).filter(Boolean).flat() as Product[]
              setWishlist(products || [])
              setWishlistIds(products?.map(p => p.id) || [])
            }
          } else {
            console.log('❤️ No customer found, using localStorage')
            loadFromLocalStorage()
          }
        } catch (error) {
          console.error('Error loading wishlist:', error)
          console.log('❤️ Falling back to localStorage')
          loadFromLocalStorage()
        }
      } else {
        // Load from localStorage for non-authenticated users
        console.log('❤️ No user, loading from localStorage')
        loadFromLocalStorage()
      }
    }

    const loadFromLocalStorage = () => {
      if (typeof window !== 'undefined') {
        const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY)
        if (savedWishlist) {
          try {
            const parsedWishlist = JSON.parse(savedWishlist)
            setWishlist(parsedWishlist)
            setWishlistIds(parsedWishlist.map((p: Product) => p.id))
          } catch (error) {
            console.error('Error loading wishlist from localStorage:', error)
          }
        }
      }
    }

    loadWishlist()
  }, [user, supabase])

  // Save wishlist to localStorage for non-authenticated users
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
    }
  }, [wishlist, user])

  // Add item to wishlist
  const addToWishlist = useCallback(async (product: Product) => {
    console.log('❤️ Adding to wishlist:', product.nome)
    console.log('❤️ User:', user)
    
    const canUseSupabase = !!user && isUuid(product.id)

    if (canUseSupabase) {
      // Add to Supabase for authenticated users
      try {
        console.log('❤️ Looking for customer with user_id:', user.id)
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single()

        console.log('❤️ Customer data:', customer)
        console.log('❤️ Customer error:', customerError)

        if (customer) {
          console.log('❤️ Inserting into wishlist:', {
            cliente_id: customer.id,
            produto_id: product.id
          })
          
          const { error } = await supabase
            .from('wishlist')
            .insert({
              cliente_id: customer.id,
              produto_id: product.id
            })

          if (error) {
            console.error('Error adding to wishlist:', error)
            console.error('Wishlist error details:', JSON.stringify(error, null, 2))
            console.error('Error code:', error.code)
            console.error('Error message:', error.message)
            console.error('Error details:', error.details)
            console.error('Error hint:', error.hint)
            // Fallback to localStorage if Supabase fails
            console.log('❤️ Falling back to localStorage')
          } else {
            console.log('❤️ Successfully added to wishlist!')
          }
        } else {
          console.log('❤️ No customer found, falling back to localStorage')
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error)
        console.log('❤️ Falling back to localStorage')
      }
    } else {
      if (user && !isUuid(product.id)) {
        console.log('❤️ Product id is not a UUID, using localStorage instead:', product.id)
      }
      console.log('❤️ No user, using localStorage')
    }

    // Update local state
    setWishlist(prevWishlist => {
      const isAlreadyInWishlist = prevWishlist.some(item => item.id === product.id)
      if (isAlreadyInWishlist) {
        console.log('❤️ Already in wishlist')
        return prevWishlist
      }
      const newWishlist = [...prevWishlist, product]
      console.log('❤️ New wishlist:', newWishlist)
      return newWishlist
    })

    setWishlistIds(prevIds => {
      if (prevIds.includes(product.id)) return prevIds
      return [...prevIds, product.id]
    })
  }, [user, supabase])

  // Remove item from wishlist
  const removeFromWishlist = useCallback(async (productId: string) => {
    console.log('❤️ Removing from wishlist:', productId)
    
    const canUseSupabase = !!user && isUuid(productId)

    if (canUseSupabase) {
      // Remove from Supabase for authenticated users
      try {
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (customer) {
          const { error } = await supabase
            .from('wishlist')
            .delete()
            .eq('cliente_id', customer.id)
            .eq('produto_id', productId)

          if (error) {
            console.error('Error removing from wishlist:', error)
            console.log('❤️ Falling back to localStorage')
          } else {
            console.log('❤️ Successfully removed from wishlist!')
          }
        } else {
          console.log('❤️ No customer found, falling back to localStorage')
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error)
        console.log('❤️ Falling back to localStorage')
      }
    } else {
      if (user && !isUuid(productId)) {
        console.log('❤️ Product id is not a UUID, using localStorage instead:', productId)
      }
      console.log('❤️ No user, using localStorage')
    }

    // Update local state
    setWishlist(prevWishlist => {
      const newWishlist = prevWishlist.filter(item => item.id !== productId)
      console.log('❤️ Updated wishlist:', newWishlist)
      return newWishlist
    })

    setWishlistIds(prevIds => prevIds.filter(id => id !== productId))
  }, [user, supabase])

  // Toggle item in wishlist
  const toggleWishlist = useCallback((product: Product) => {
    console.log('❤️ Toggling wishlist for:', product.nome)
    const isInWishlist = wishlist.some(item => item.id === product.id)
    console.log('❤️ Currently in wishlist:', isInWishlist)
    if (isInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }, [wishlist, addToWishlist, removeFromWishlist])

  // Check if item is in wishlist
  const isInWishlist = useCallback((productId: string) => {
    return wishlistIds.includes(productId)
  }, [wishlistIds])

  // Clear wishlist
  const clearWishlist = useCallback(() => {
    setWishlist([])
  }, [])

  // Get wishlist count
  const getWishlistCount = useCallback(() => {
    return wishlist.length
  }, [wishlist])

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount
  }
}
