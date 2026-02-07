import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Na Vercel não usamos export estático para as API routes funcionarem
  ...(process.env.VERCEL ? {} : { output: 'export' as const }),
  images: {
    // Para sites estáticos, desabilitar otimização mas manter funcionalidade
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Otimizações de performance
  compress: true,
  poweredByHeader: false,
  
  // Configurações para Netlify
  trailingSlash: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
