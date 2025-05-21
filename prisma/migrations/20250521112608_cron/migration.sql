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
