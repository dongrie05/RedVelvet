import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// Dev safeguard: log if envs are not configured (helps diagnose empty queries)
if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl.includes('your-project')) {
    // eslint-disable-next-line no-console
    console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL não definido. Configure o .env.local')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseAnonKey === 'your-anon-key') {
    // eslint-disable-next-line no-console
    console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY não definido. Configure o .env.local')
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Product {
  id: string
  codigo: string
  referencia: string
  nome: string
  descricao: string
  categoria: string
  preco: number
  stock: number
  tamanhos?: string[]
  imagem_url?: string
  iva: number
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  nome: string
  email: string
  telefone?: string
  endereco?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  cliente_id: string
  produtos: OrderProduct[]
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  payment_provider_id?: string
  created_at: string
  updated_at: string
}

export interface OrderProduct {
  produto_id: string
  quantidade: number
  preco_unitario: number
  tamanho?: string
}

export interface Review {
  id: string
  cliente_id: string
  produto_id: string
  rating: number
  comentario?: string
  created_at: string
  updated_at: string
}
