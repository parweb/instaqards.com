import { PrismaClient } from '@prisma/client';

export const testGuestUser = async (prisma: PrismaClient) => {
  await prisma.user.create({
    data: {
      email: 'ploop'
    }
  });
};
