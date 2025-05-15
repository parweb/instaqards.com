import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

(async () => {
  // await seedWorkflow(prisma)
  // await populateAllLeadWithDefaultSite(prisma);
  // await testGuestUser(prisma);
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
