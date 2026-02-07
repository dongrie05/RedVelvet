import createMollieClient from '@mollie/api-client'

// Mollie server-side client
// Ensure MOLLIE_API_KEY is set in environment (.env.local / Vercel)
export const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY as string })


