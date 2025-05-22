import { PrismaClient } from '@prisma/client';

// import { generateFakeCronHistory } from './seed/generateFakeCronHistory';
// import { importCodeNaf } from './seed/importCodeNaf';
// import { importContactsParis } from './seed/importContactsParis';
// import { populateAllLeadWithDefaultSite } from './seed/populateAllLeadWithDefaultSite';
// import { seedWorkflow } from './seed/seedWorkflow';
// import { testGuestUser } from './seed/testGuestUser';

export const prisma = new PrismaClient();

(async () => {
  // await seedWorkflow(prisma)
  // await populateAllLeadWithDefaultSite(prisma);
  // await testGuestUser(prisma);
  // await importCodeNaf(prisma);
  // await importContactsParis(prisma);
  // await generateFakeCronHistory(prisma);
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
