import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

export async function authorizeAdmin(request: NextRequest) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const admins = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean)
  if (!url || !anon || !key || !admins.length) return { error: 'Gestão não configurada no servidor.', status: 503 } as const
  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1]
  if (!token) return { error: 'Inicie sessão para continuar.', status: 401 } as const
  const auth = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data, error } = await auth.auth.getUser(token)
  if (error || !data.user?.email || !data.user.email_confirmed_at || !admins.includes(data.user.email.toLowerCase())) return { error: 'Conta sem acesso à gestão.', status: 403 } as const
  return { db: createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) } as const
}
