// Performance optimizations for Core Web Vitals
export const PERFORMANCE_CONFIG = {
  // Image optimization
  images: {
    formats: ['webp', 'avif'],
    quality: 85,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    placeholder: 'blur',
  },
  
  // Font optimization
  fonts: {
    display: 'swap',
    preload: true,
  },
  
  // Resource hints
  preload: {
    criticalImages: [
      '/images/categories/hero/hero-main.png',
      '/images/categories/clothing/clothing-hero.jpg',
      '/images/categories/candles/candles-hero.png',
      '/images/categories/decorative-elements/decorative-elements.png',
    ],
    criticalFonts: [
      '/fonts/inter-var.woff2',
    ],
  },
  
  // Bundle optimization
  bundle: {
    splitChunks: true,
    treeShaking: true,
    minification: true,
  },
  
  // Caching strategies
  cache: {
    static: '1y',
    images: '1y',
    fonts: '1y',
    api: '5m',
  },
}

// Critical CSS extraction
export const CRITICAL_CSS = `
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
`

// Resource loading optimization
export function optimizeResourceLoading() {
  if (typeof window === 'undefined') return

  // Preload critical resources
  const preloadLink = (href: string, as: string, type?: string) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (type) link.type = type
    document.head.appendChild(link)
  }

  // Preload critical images
  PERFORMANCE_CONFIG.preload.criticalImages.forEach(image => {
    preloadLink(image, 'image', 'image/png')
  })

  // Preload critical fonts
  PERFORMANCE_CONFIG.preload.criticalFonts.forEach(font => {
    preloadLink(font, 'font', 'font/woff2')
  })
}

// Lazy loading optimization
export function setupLazyLoading() {
  if (typeof window === 'undefined') return

  // Intersection Observer for lazy loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.removeAttribute('data-src')
          observer.unobserve(img)
        }
      }
    })
  }, {
    rootMargin: '50px 0px',
    threshold: 0.1
  })

  // Observe all lazy images
  document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img)
  })
}

// Performance monitoring
export function trackCoreWebVitals() {
  if (typeof window === 'undefined') return

  // Track Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    const lastEntry = entries[entries.length - 1]
    
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        name: 'LCP',
        value: Math.round(lastEntry.startTime),
        event_category: 'Performance',
        event_label: 'Core Web Vitals'
      })
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // Track First Input Delay (FID)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    entries.forEach(entry => {
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          name: 'FID',
          value: Math.round(entry.processingStart - entry.startTime),
          event_category: 'Performance',
          event_label: 'Core Web Vitals'
        })
      }
    })
  }).observe({ entryTypes: ['first-input'] })

  // Track Cumulative Layout Shift (CLS)
  let clsValue = 0
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    entries.forEach(entry => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
      }
    })
    
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        name: 'CLS',
        value: Math.round(clsValue * 1000),
        event_category: 'Performance',
        event_label: 'Core Web Vitals'
      })
    }
  }).observe({ entryTypes: ['layout-shift'] })
}

// Image optimization utilities
export function getOptimizedImageProps(src: string, alt: string, priority = false) {
  return {
    src,
    alt,
    priority,
    quality: PERFORMANCE_CONFIG.images.quality,
    sizes: PERFORMANCE_CONFIG.images.sizes,
    placeholder: PERFORMANCE_CONFIG.images.placeholder,
    loading: priority ? 'eager' : 'lazy',
  }
}

// Bundle analysis helper
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return

  const resources = performance.getEntriesByType('resource')
  const jsResources = resources.filter(r => r.name.includes('.js'))
  const cssResources = resources.filter(r => r.name.includes('.css'))
  
  const totalJS = jsResources.reduce((sum, r) => sum + r.transferSize, 0)
  const totalCSS = cssResources.reduce((sum, r) => sum + r.transferSize, 0)
  
  console.log('Bundle Analysis:', {
    totalJS: `${(totalJS / 1024).toFixed(2)} KB`,
    totalCSS: `${(totalCSS / 1024).toFixed(2)} KB`,
    totalResources: resources.length,
  })
  
  if (window.gtag) {
    window.gtag('event', 'bundle_analysis', {
      js_size: totalJS,
      css_size: totalCSS,
      total_resources: resources.length,
      event_category: 'Performance'
    })
  }
}
