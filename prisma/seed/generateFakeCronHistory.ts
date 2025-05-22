import { PrismaClient } from '@prisma/client';
import { range } from 'lodash-es';

export const generateFakeCronHistory = async (prisma: PrismaClient) => {
  await prisma.history.deleteMany({ where: { cronId: '5' } });
  await prisma.history.createMany({
    data: range(0, 13 * 1440).map(i => {
      const startedAt = new Date(
        new Date('2025-05-11 00:00:00').getTime() + i * (1000 * 60)
      );
      const durationMs = Math.random() * 1000;

      return {
        cronId: '5',
        status: Math.random() > 0.0005 ? 'ok' : 'error',
        startedAt,
        endedAt: new Date(startedAt.getTime() + durationMs),
        durationMs
      };
    })
  });
};
