/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Para GitHub Pages, definimos o basePath
  basePath: '/RedVelvet',
  assetPrefix: '/RedVelvet/',
}

module.exports = nextConfig
