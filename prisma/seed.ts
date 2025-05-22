import { PrismaClient } from '@prisma/client';
import { range } from 'lodash';

// import { importContactsParis } from './seed/importContactsParis';
// import { populateAllLeadWithDefaultSite } from './seed/populateAllLeadWithDefaultSite';

export const prisma = new PrismaClient();

(async () => {
  // await seedWorkflow(prisma)
  // await populateAllLeadWithDefaultSite(prisma);
  // await testGuestUser(prisma);
  // await importCodeNaf(prisma);
  // await importContactsParis(prisma);

  await prisma.history.deleteMany({ where: { cronId: '5' } });
  await prisma.history.createMany({
    data: range(0, 13 * 1440).map(i => {
      const startedAt = new Date(
        new Date('2025-05-11 00:00:00').getTime() + i * (1000 * 60)
      );
      const durationMs = Math.random() * 1000;

      return {
        cronId: '5',
        status: Math.random() > 0.5 ? 'ok' : 'error',
        startedAt,
        endedAt: new Date(startedAt.getTime() + durationMs),
        durationMs
      };
    })
  });
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
