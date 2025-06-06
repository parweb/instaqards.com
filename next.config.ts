import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  distDir: process.env.NODE_ENV === 'production' ? '.next' : '.next-dev',
  // typescript: { ignoreBuildErrors: true },
  allowedDevOrigins: ['qards.local', '*.qards.local'],
  experimental: {
    // reactCompiler: true,
    // clientSegmentCache: true,
    inlineCss: true,
    dynamicIO: true,
    ppr: true,
    viewTransition: true,
    optimizePackageImports: ['framer-motion', 'react-icons'],
    serverActions: {
      bodySizeLimit: '200mb',
      allowedOrigins: [
        'app.localhost:11000',
        'app.qards.local:11000',
        'app.qards.local'
      ]
    }
  },
  images: {
    remotePatterns: [
      { hostname: 'qards.link' },
      { hostname: '*.vercel-storage.com' },
      { hostname: 'public.blob.vercel-storage.com' },
      { hostname: 'res.cloudinary.com' },
      { hostname: 'abs.twimg.com' },
      { hostname: 'pbs.twimg.com' },
      { hostname: 'avatar.vercel.sh' },
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'www.google.com' },
      { hostname: 'flag.vercel.app' },
      { hostname: 'illustrations.popsy.co' },
      { hostname: 'i.ytimg.com' },
      { hostname: 'placehold.co' }
    ]
  }
};

export default nextConfig;
