/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: true,
  },
  onError: (err) => {
    console.error('Next.js build error:', err);
  },

  serverRuntimeConfig: {

    apiTimeout: 30000, 
  },
  
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig 