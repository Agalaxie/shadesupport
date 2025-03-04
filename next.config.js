/** @type {import('next').NextConfig} */

// Configuration optimisée pour Vercel avec Node.js runtime
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    runtime: 'nodejs',
    serverComponentsExternalPackages: ['@clerk/nextjs'],
  },
  transpilePackages: [
    '@clerk/nextjs',
    '@clerk/clerk-react',
    '@clerk/shared'
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
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 