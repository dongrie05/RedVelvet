import 'server-only'
import createMollieClient, { MollieClient } from '@mollie/api-client'

let client: MollieClient | null = null

export function getMollie(): MollieClient {
  if (client) return client
  const apiKey = process.env.MOLLIE_API_KEY
  if (!apiKey) throw new Error('MOLLIE_API_KEY em falta')
  client = createMollieClient({ apiKey })
  return client
}

/** URL pública do site (para redirect/webhook da Mollie). */
export function getSiteUrl(req?: Request): string {
  const env = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL
  if (env) return env.replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (req) return new URL(req.url).origin
  return 'http://localhost:3000'
}
