/*
  Warnings:

  - A unique constraint covering the columns `[convertedId]` on the table `Prospect` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Prospect` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prospect" ADD COLUMN     "assigneeId" TEXT,
ADD COLUMN     "convertedId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "position" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'NEW',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_convertedId_key" ON "Prospect"("convertedId");

-- CreateIndex
CREATE INDEX "Prospect_status_idx" ON "Prospect"("status");

-- CreateIndex
CREATE INDEX "Prospect_assigneeId_idx" ON "Prospect"("assigneeId");

-- CreateIndex
CREATE INDEX "Prospect_convertedId_idx" ON "Prospect"("convertedId");

-- CreateIndex
CREATE INDEX "Prospect_status_position_idx" ON "Prospect"("status", "position");

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_convertedId_fkey" FOREIGN KEY ("convertedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
