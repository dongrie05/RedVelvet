'use client'

import Script from 'next/script'
import { GA_TRACKING_ID } from '@/lib/analytics'

export default function GoogleAnalytics() {
  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              custom_map: {
                'custom_parameter_1': 'ai_optimized',
                'custom_parameter_2': 'seo_enhanced'
              }
            });
          `,
        }}
      />
    </>
  )
}
