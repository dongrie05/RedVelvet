import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isCategoryExcluded } from '@/lib/categoryFilterConfig'
import { normalizeCategoryForFilter } from '@/lib/categoryUtils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    return NextResponse.json(
      { error: 'Supabase não configurado', data: [] },
      { status: 200 }
    )
  }

  const supabase = createClient(url, anonKey)
  const { data: rows, error } = await supabase
    .from('products')
    .select('id, codigo, referencia, nome, descricao, categoria, preco, stock, tamanhos, imagem_url, iva, created_at, updated_at')
    .order('nome', { ascending: true })

  if (error) {
    return NextResponse.json(
      { error: error.message, data: [] },
      { status: 200 }
    )
  }

  const mapped = (rows || []).map((row: Record<string, unknown>) => ({
    ...row,
    id: String(row.id),
    preco: typeof row.preco === 'string' ? parseFloat(row.preco) : Number(row.preco),
    stock: typeof row.stock === 'string' ? parseInt(row.stock, 10) : Number(row.stock ?? 0),
    iva: typeof row.iva === 'string' ? parseFloat(row.iva) : Number(row.iva ?? 23),
    created_at: row.created_at ? String(row.created_at) : new Date().toISOString(),
    updated_at: row.updated_at ? String(row.updated_at) : new Date().toISOString()
  }))

  const data = mapped.filter((row: Record<string, unknown>) => {
    const cat = normalizeCategoryForFilter(String(row.categoria ?? ''))
    return !isCategoryExcluded(cat)
  })

  return NextResponse.json({ data })
}
