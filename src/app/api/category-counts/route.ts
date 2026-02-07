import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export type CategoryCounts = {
  'decorative-elements': number
  velas: number
  roupa: number
}

function normalize(s: string) {
  return (s || '')
    .replace(/\uFFFD/g, '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function isVelas(s: string) {
  return s.includes('VELAS')
}
function isVestuario(s: string) {
  return s.includes('VESTUARIO')
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    return NextResponse.json(
      { error: 'Supabase não configurado', counts: { 'decorative-elements': 0, velas: 0, roupa: 0 } },
      { status: 200 }
    )
  }

  const supabase = createClient(url, anonKey)
  const { data: rows, error } = await supabase
    .from('products')
    .select('categoria')

  if (error) {
    return NextResponse.json(
      { error: error.message, counts: { 'decorative-elements': 0, velas: 0, roupa: 0 } },
      { status: 200 }
    )
  }

  const list = (rows || []) as { categoria: string | null }[]
  let velas = 0
  let roupa = 0
  for (const row of list) {
    const cat = normalize(row.categoria || '')
    if (isVelas(cat)) velas += 1
    else if (isVestuario(cat)) roupa += 1
  }
  const decorativeElements = Math.max(0, list.length - velas - roupa)

  const counts: CategoryCounts = {
    'decorative-elements': decorativeElements,
    velas,
    roupa
  }

  return NextResponse.json({ counts })
}
