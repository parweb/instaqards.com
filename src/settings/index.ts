import { Site } from '@prisma/client';

export const apiAuthPrefix = '/api/auth';

export const publicRoutes = ['/new-verification', '/onboard'];

export const marketingRoutes = [
  '/',
  '/home',
  '/qards',
  '/pricing',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/pro',
  '/qards/top',
  '/identity',
  '/explore'
];

export const authRoutes = [
  '/login',
  '/register',
  '/error',
  '/reset',
  '/new-password',
  '/email-in'
];

export const DEFAULT_LOGIN_REDIRECT = '/';

export const prices = {
  monthly: { id: 'price_1R2YT7IExtBoSSWLIOzTKfV2', price: 12 },
  yearly: { id: 'price_1R2YR7IExtBoSSWLTa7swlyG', price: 9 }
};

export const sender = 'Qards.link <contact@qards.link>';

export const options = {
  dashboard: {
    editor: {
      saveLastSelectedBlock: false
    }
  }
} as const;

export const uri = {
  cookie:
    '.' +
    String(process.env.NEXT_PUBLIC_BETTER_AUTH_URL)
      .split('://')
      .at(1)
      ?.replace(':11000', ''),
  base: (path: string = '') =>
    `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}${path}`,
  app: (path: string = '') =>
    `${String(process.env.NEXT_PUBLIC_BETTER_AUTH_URL).replace('://', '://app.')}${path}`,
  site: (site: { subdomain: Site['subdomain'] } | null) => {
    if (!site) return { link: '', title: '' };

    const url = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

    return {
      link: process.env.NEXT_PUBLIC_VERCEL_ENV
        ? `https://${url}`
        : `http://${site.subdomain}.qards.local:11000`,
      title: process.env.NEXT_PUBLIC_VERCEL_ENV
        ? url
        : `${site.subdomain}.qards.local:11000`
    };
  }
};
