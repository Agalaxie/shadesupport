/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
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
  },
  experimental: {
    runtime: 'nodejs'
  }
}

module.exports = nextConfig 