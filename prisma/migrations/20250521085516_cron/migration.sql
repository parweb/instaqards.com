-- CreateTable
CREATE TABLE "CronJob" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cronExpr" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "modulePath" TEXT NOT NULL,
    "functionName" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "lastStatus" TEXT,
    "lastDurationMs" INTEGER,

    CONSTRAINT "CronJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CronJob_name_key" ON "CronJob"("name");

/*
  Warnings:

  - You are about to drop the `CronJob` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CronJob";

-- CreateTable
CREATE TABLE "Cron" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cronExpr" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "modulePath" TEXT NOT NULL,
    "functionName" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "lastStatus" TEXT,
    "lastDurationMs" INTEGER,
    "lockedAt" TIMESTAMP(3),

    CONSTRAINT "Cron_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cron_name_key" ON "Cron"("name");

-- AlterTable
ALTER TABLE "Cron" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

/*
  Warnings:

  - The primary key for the `Cron` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Cron" DROP CONSTRAINT "Cron_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Cron_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Cron_id_seq";

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "message" TEXT,
    "cronId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "History_cronId_idx" ON "History"("cronId");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_cronId_fkey" FOREIGN KEY ("cronId") REFERENCES "Cron"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - The `message` column on the `History` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "message",
ADD COLUMN     "message" JSONB DEFAULT '{}';

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_cronId_fkey";

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_cronId_fkey" FOREIGN KEY ("cronId") REFERENCES "Cron"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "smart" BOOLEAN NOT NULL DEFAULT false;
