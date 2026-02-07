'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Create customer if doesn't exist
  const createCustomerIfNotExists = async (userData: User) => {
    try {
      console.log('🔍 Checking if customer exists for user:', userData.id)
      
      // Check if customer already exists
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', userData.id)
        .single()

      if (existingCustomer) {
        console.log('✅ Customer already exists:', existingCustomer.id)
        return
      }

      // Create new customer
      console.log('👤 Creating new customer for user:', userData.id)
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert({
          user_id: userData.id,
          nome: userData.nome || userData.email?.split('@')[0] || 'Cliente',
          email: userData.email || '',
          telefone: userData.telefone || null,
          morada: userData.endereco || null
        })
        .select('id')
        .single()

      if (error) {
        console.error('❌ Error creating customer:', error)
      } else {
        console.log('✅ Customer created successfully:', newCustomer.id)
      }
    } catch (error) {
      console.error('❌ Exception creating customer:', error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          nome: session.user.user_metadata?.nome,
          telefone: session.user.user_metadata?.telefone,
          endereco: session.user.user_metadata?.endereco
        }
        setUser(userData)
        
        // Create customer if doesn't exist
        await createCustomerIfNotExists(userData)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            nome: session.user.user_metadata?.nome,
            telefone: session.user.user_metadata?.telefone,
            endereco: session.user.user_metadata?.endereco
          }
          setUser(userData)
          
          // Create customer if doesn't exist
          await createCustomerIfNotExists(userData)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, nome?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome
        }
      }
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  const updateProfile = async (updates: Partial<User>) => {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        nome: updates.nome,
        telefone: updates.telefone,
        endereco: updates.endereco
      }
    })
    return { data, error }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile
  }
}
