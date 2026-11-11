import type { NextConfig } from "next";

// Loja com pagamentos (Mollie) e API routes: precisa de servidor (Vercel).
// NÃO usar `output: 'export'` — isso desativa o checkout e os webhooks.
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  compress: true,
  poweredByHeader: false,
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Erros de tipos bloqueiam o deploy (evita publicar código partido)
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
};

export default nextConfig;
