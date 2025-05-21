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
