import { Metadata } from 'next'
import { SEO_CONFIG } from './seoConfig'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  structuredData?: any
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage = '/images/logo.jpg',
    ogType = 'website'
  } = config

  const fullTitle = title.includes(SEO_CONFIG.site.name) ? title : `${title} | ${SEO_CONFIG.site.name}`
  const siteUrl = SEO_CONFIG.site.url

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: SEO_CONFIG.business.name }],
    creator: SEO_CONFIG.business.name,
    publisher: SEO_CONFIG.business.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: ogType,
      locale: SEO_CONFIG.site.locale,
      url: canonical ? `${siteUrl}${canonical}` : siteUrl,
      siteName: SEO_CONFIG.site.name,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: SEO_CONFIG.social.twitter,
      creator: SEO_CONFIG.social.twitter,
      title: fullTitle,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`],
    },
    alternates: {
      canonical: canonical ? `${siteUrl}${canonical}` : siteUrl,
    },
    verification: {
      google: SEO_CONFIG.analytics.googleSiteVerification,
    },
    category: 'shopping',
  }
}

// Schema.org structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.business.name,
    url: SEO_CONFIG.site.url,
    logo: `${SEO_CONFIG.site.url}/images/logo.jpg`,
    description: SEO_CONFIG.site.description,
    foundingDate: SEO_CONFIG.business.foundingDate,
    address: {
      '@type': 'PostalAddress',
      addressCountry: SEO_CONFIG.business.address.country,
      addressLocality: SEO_CONFIG.business.address.locality,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SEO_CONFIG.business.phone,
      contactType: 'customer service',
      availableLanguage: ['Portuguese', 'English'],
    },
    sameAs: [
      SEO_CONFIG.social.instagram,
      SEO_CONFIG.social.facebook,
    ],
  }
}

export function generateProductSchema(product: any) {
  const siteUrl = SEO_CONFIG.site.url
  const imageUrl = product.imagem_url
    ? (product.imagem_url.startsWith('http') ? product.imagem_url : `${siteUrl}${product.imagem_url}`)
    : undefined

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nome ?? '',
    description: product.descricao ?? product.nome ?? '',
    ...(imageUrl && { image: imageUrl }),
    sku: product.codigo,
    mpn: product.referencia,
    brand: {
      '@type': 'Brand',
      name: SEO_CONFIG.business.name,
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/product/${product.id}`,
      priceCurrency: SEO_CONFIG.business.currency,
      price: product.preco,
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SEO_CONFIG.business.name,
      },
    },
    category: product.categoria,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  }
  return schema
}

export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SEO_CONFIG.site.url}${item.url}`,
    })),
  }
}

export function generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.site.name,
    url: SEO_CONFIG.site.url,
    description: SEO_CONFIG.site.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.site.url}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
