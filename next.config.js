/** @type {import('next').NextConfig} */

// Configuration optimisée pour Vercel avec Node.js runtime
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    runtime: 'nodejs'
  },
  transpilePackages: [
    '@clerk/nextjs',
    '@clerk/clerk-react'
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      'node-fetch': false,
      'node-fetch-native': false,
    };
    return config;
  }
}

module.exports = nextConfig 