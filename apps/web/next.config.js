/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui', 'db'],
  images: {
    domains: ['localhost', 'i.pravatar.cc'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.vercel.app',
      ],
    },
  },
  webpack: (config) => {
    // Add alias for ui package @ imports
    config.resolve.alias['@'] = path.resolve(__dirname, '../../packages/ui/src');
    return config;
  },
};

module.exports = nextConfig;

