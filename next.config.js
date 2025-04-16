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
  // Ensure proper error handling in production
  onError: (err) => {
    console.error('Next.js build error:', err);
  },
  // Increase serverless function timeout
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiTimeout: 30000, // 30 seconds
  },
  // Ensure proper static optimization
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig 