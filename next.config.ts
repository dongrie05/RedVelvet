import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'supabase.co'],
    unoptimized: true, // Necessário para exportação estática
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  eslint: {
    ignoreDuringBuilds: true, // Ignorar erros ESLint durante build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorar erros TypeScript durante build
  },
  // Configuração condicional para exportação estática
  ...(process.env.NODE_ENV === 'production' && process.env.EXPORT === 'true' ? {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
  } : {}),
};

export default nextConfig;
