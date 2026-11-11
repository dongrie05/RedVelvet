import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Product } from '@/lib/supabase'
import { isCategoryExcluded } from '@/lib/categoryFilterConfig'
import { normalizeCategoryForFilter } from '@/lib/categoryUtils'

const COLUMNS = 'id, codigo, referencia, nome, descricao, categoria, preco, stock, tamanhos, imagem_url, galeria, iva, created_at, updated_at'

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export function normalizeProduct(row: Record<string, unknown>): Product {
  const galeria = Array.isArray(row.galeria) ? (row.galeria as unknown[]).map(String).filter(Boolean) : []
  return {
    ...(row as unknown as Product),
    id: String(row.id),
    preco: Number(row.preco ?? 0),
    stock: Number(row.stock ?? 0),
    iva: Number(row.iva ?? 23),
    galeria,
    tamanhos: Array.isArray(row.tamanhos) ? (row.tamanhos as string[]) : undefined,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const sb = client()
  if (!sb) return null
  const { data } = await sb.from('products').select(COLUMNS).eq('id', id).maybeSingle()
  if (!data) return null
  const p = normalizeProduct(data)
  return isCategoryExcluded(normalizeCategoryForFilter(p.categoria)) ? null : p
}

export async function getAllProducts(): Promise<Product[]> {
  const sb = client()
  if (!sb) return []
  const { data } = await sb.from('products').select(COLUMNS).order('nome')
  return (data || [])
    .map(normalizeProduct)
    .filter((p) => !isCategoryExcluded(normalizeCategoryForFilter(p.categoria)))
}
