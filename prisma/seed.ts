import { PrismaClient } from '@prisma/client';

// import { generateFakeCronHistory } from './seed/generateFakeCronHistory';
// import { importCodeNaf } from './seed/importCodeNaf';
// import { importContactsParis } from './seed/importContactsParis';
// import { populateAllLeadWithDefaultSite } from './seed/populateAllLeadWithDefaultSite';
// import { seedWorkflow } from './seed/seedWorkflow';
// import { testGuestUser } from './seed/testGuestUser';
// import { importAllEurobisProducts__For__Kartons_fr } from './seed/importAllEurobisProducts__For__Kartons_fr';

export const prisma = new PrismaClient();

(async () => {
  // await seedWorkflow(prisma)
  // await populateAllLeadWithDefaultSite(prisma);
  // await testGuestUser(prisma);
  // await importCodeNaf(prisma);
  // await importContactsParis(prisma);
  // await generateFakeCronHistory(prisma);
  // await importAllEurobisProducts__For__Kartons_fr(prisma);
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
