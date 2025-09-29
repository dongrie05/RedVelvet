import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'supabase.co'],
  },
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default nextConfig;
