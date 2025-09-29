import { createClient } from '@supabase/supabase-js'

// Admin client for server-only operations (webhooks)
// Requires SUPABASE_SERVICE_ROLE_KEY - NEVER expose to the browser
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)


