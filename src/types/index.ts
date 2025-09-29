export interface CartItem {
  id: string
  produto_id: string
  nome: string
  preco: number
  quantidade: number
  tamanho?: string
  imagem_url?: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
}

export interface User {
  id: string
  email: string
  nome?: string
  telefone?: string
  endereco?: string
}

export interface Category {
  id: string
  nome: string
  slug: string
  descricao?: string
  imagem_url?: string
}

export interface ProductFilter {
  categoria?: string
  preco_min?: number
  preco_max?: number
  disponivel?: boolean
  sort?: 'preco_asc' | 'preco_desc' | 'nome_asc' | 'nome_desc'
}

export interface CheckoutForm {
  nome: string
  email: string
  telefone: string
  endereco: string
  cidade: string
  codigo_postal: string
  pais: string
  metodo_pagamento: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}
