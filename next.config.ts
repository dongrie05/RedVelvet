import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'supabase.co'],
    unoptimized: true, // Necessário para exportação estática
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  output: 'export', // Para GitHub Pages
  trailingSlash: true, // Para GitHub Pages
  distDir: 'out', // Diretório de saída
};

export default nextConfig;
