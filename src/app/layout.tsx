import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import PerformanceOptimizer, { CriticalCSS, ResourceHints } from "@/components/performance/PerformanceOptimizer";
import { generateMetadata, generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo";
import { SEO_CONFIG } from "@/lib/seoConfig";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = generateMetadata({
  title: `${SEO_CONFIG.site.name} - Loja Online de Produtos Únicos`,
  description: SEO_CONFIG.site.description,
  keywords: SEO_CONFIG.primaryKeywords,
  canonical: "/",
  ogImage: "/images/logo.jpg",
  ogType: "website"
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="pt" className={inter.variable}>
      <head>
        <CriticalCSS />
        <ResourceHints />
        
        {/* Preload das imagens críticas para carregamento mais rápido */}
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
        
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <GoogleAnalytics />
        <PerformanceOptimizer />
        <Header />
        <main className="flex-1">
        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
