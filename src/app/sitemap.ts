import { MetadataRoute } from 'next'
import { SEO_CONFIG } from '@/lib/seoConfig'
import { getAllProducts } from '@/lib/products'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SEO_CONFIG.site.url.replace(/\/$/, '')
  const now = new Date()
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/shop/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/shipping/`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/terms/`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/privacy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/withdrawal/`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
  const products = await getAllProducts().catch(() => [])
  return pages.concat(
    products.map((p) => ({
      url: `${base}/product/${p.id}/`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )
}
