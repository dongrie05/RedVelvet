'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Google Analytics 4
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track page views
export function usePageTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    pageview(url)
  }, [pathname, searchParams])
}

// E-commerce tracking
export const trackPurchase = (transactionId: string, value: number, currency: string = 'EUR', items: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    })
  }
}

export const trackAddToCart = (itemId: string, itemName: string, category: string, value: number, quantity: number = 1) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'EUR',
      value: value,
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          item_category: category,
          quantity: quantity,
          price: value,
        },
      ],
    })
  }
}

export const trackViewItem = (itemId: string, itemName: string, category: string, value: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'EUR',
      value: value,
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          item_category: category,
          price: value,
        },
      ],
    })
  }
}

// Search tracking
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultsCount,
    })
  }
}

// Custom events for AI optimization tracking
export const trackAISearch = (query: string, source: string = 'unknown') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ai_search', {
      query: query,
      source: source,
      custom_parameter_1: 'ai_optimized',
    })
  }
}

export const trackFAQView = (question: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'faq_view', {
      question: question,
      custom_parameter_1: 'ai_friendly_content',
    })
  }
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: any
    ) => void
  }
}
