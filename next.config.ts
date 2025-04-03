import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // reactCompiler: true,
    dynamicIO: true,
    ppr: true,
    viewTransition: true,
    serverActions: {
      bodySizeLimit: '20mb',
      allowedOrigins: ['app.localhost:11000']
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
