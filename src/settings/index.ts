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
  '/qards/top'
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

export const sender = 'contact@qards.link';

export const options = {
  dashboard: {
    editor: {
      saveLastSelectedBlock: false
    }
  }
} as const;
