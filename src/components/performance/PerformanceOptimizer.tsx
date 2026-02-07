'use client'

import { useEffect } from 'react'
import { optimizeResourceLoading, setupLazyLoading, trackCoreWebVitals, analyzeBundleSize } from '@/lib/performance'

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Initialize performance optimizations
    optimizeResourceLoading()
    setupLazyLoading()
    trackCoreWebVitals()
    
    // Analyze bundle size after page load
    const timer = setTimeout(() => {
      analyzeBundleSize()
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return null
}

// Component for optimized image loading
interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  sizes?: string
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false, 
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      sizes={sizes}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: width && height ? `${width}px ${height}px` : undefined,
      }}
    />
  )
}

// Component for critical CSS injection
export function CriticalCSS() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical above-the-fold styles */
          .container-luxury {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }
          
          .heading-luxury {
            font-family: var(--font-inter), system-ui, sans-serif;
            font-weight: 600;
            line-height: 1.2;
            color: #1a1a1a;
          }
          
          .text-luxury {
            font-family: var(--font-inter), system-ui, sans-serif;
            line-height: 1.6;
            color: #4a4a4a;
          }
          
          .btn-primary {
            background-color: #dc2626;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0;
            font-weight: 500;
            transition: background-color 0.2s ease;
          }
          
          .btn-primary:hover {
            background-color: #b91c1c;
          }
          
          /* Prevent layout shift */
          .aspect-square {
            aspect-ratio: 1 / 1;
          }
          
          .aspect-[4/5] {
            aspect-ratio: 4 / 5;
          }
          
          .aspect-[4/3] {
            aspect-ratio: 4 / 3;
          }
        `
      }}
    />
  )
}

// Component for resource hints
export function ResourceHints() {
  return (
    <>
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Preconnect to critical origins */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Preload critical resources */}
      <link
        rel="preload"
        as="image"
        href="/images/categories/hero/hero-main.png"
        type="image/png"
      />
      <link
        rel="preload"
        as="image"
        href="/images/categories/clothing/clothing-hero.jpg"
        type="image/jpeg"
      />
      <link
        rel="preload"
        as="image"
        href="/images/categories/candles/candles-hero.png"
        type="image/png"
      />
      <link
        rel="preload"
        as="image"
        href="/images/categories/decorative-elements/decorative-elements.png"
        type="image/png"
      />
    </>
  )
}
