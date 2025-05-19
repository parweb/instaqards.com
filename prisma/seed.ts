import { PrismaClient } from '@prisma/client';

import { importContactsParis } from './seed/importContactsParis';

export const prisma = new PrismaClient();

(async () => {
  // await seedWorkflow(prisma)
  // await populateAllLeadWithDefaultSite(prisma);
  // await testGuestUser(prisma);
  // await importCodeNaf(prisma);
  // await importContactsParis(prisma);
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
