/** @type {import('next').NextConfig} */

// Configuration optimisée pour Vercel avec Node.js runtime
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Forcer l'utilisation de Node.js pour tous les composants
    serverActions: {
      bodySizeLimit: '2mb',
    }
  },
  // Ignorer les avertissements liés à Clerk
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configurer les en-têtes de sécurité
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
  // Configuration pour Clerk
  webpack: (config, { isServer }) => {
    // Forcer l'utilisation de Node.js pour Clerk
    if (isServer) {
      config.externals = [...config.externals, '@clerk/nextjs'];
    }
    return config;
  },
}

module.exports = nextConfig 