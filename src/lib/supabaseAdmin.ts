import { createClient } from '@supabase/supabase-js'

// Admin client for server-only operations (webhooks / server routes)
// Requires SUPABASE_SERVICE_ROLE_KEY - NEVER expose to the browser
const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) as string
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export const supabaseAdmin = createClient(supabaseUrl, serviceKey)


