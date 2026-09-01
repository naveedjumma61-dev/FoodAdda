/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
  // Vercel optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Ensure env variables are properly handled during build
  env: {
    // These will be overridden by Vercel environment variables
  },
};

export default nextConfig;
