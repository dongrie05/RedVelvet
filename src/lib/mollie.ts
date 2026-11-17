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
  const configured = env || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  if (configured) {
    const url = new URL(configured)
    if (!['http:', 'https:'].includes(url.protocol) || (process.env.NODE_ENV === 'production' && (url.protocol !== 'https:' || ['localhost', '127.0.0.1'].includes(url.hostname)))) {
      throw new Error('Configure um URL público HTTPS válido para o pagamento.')
    }
    return url.origin
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Configure NEXT_PUBLIC_APP_URL para o pagamento.')
  if (req) return new URL(req.url).origin
  return 'http://localhost:3000'
}
