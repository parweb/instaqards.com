-- DropIndex
DROP INDEX "Outbox_email_idx";

-- DropIndex
DROP INDEX "Site_customDomain_idx";

-- DropIndex
DROP INDEX "Site_subdomain_idx";

-- DropIndex
DROP INDEX "User_refererId_idx";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "status" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Queue" ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "runAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "processingStartedAt" SET DATA TYPE TIMESTAMP(3);
