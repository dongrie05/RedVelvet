import 'server-only'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Cliente com service role — APENAS no servidor (API routes / webhooks).
// Nunca importar em componentes 'use client'.
let client: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL em falta')
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  return client
}
