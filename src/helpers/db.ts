import 'server-only';

import { PrismaClient } from '@prisma/client';

const createPrismaClient = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['error'] //['query', 'error', 'warn']
        : ['error']
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

// db.$on('query', event => {
//   console.log(event);
// });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
