-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'pending';
