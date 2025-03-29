/*
  Warnings:

  - Added the required column `siteId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "siteId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Like_siteId_idx" ON "Like"("siteId");

-- CreateIndex
CREATE INDEX "Like_ip_idx" ON "Like"("ip");

-- CreateIndex
CREATE INDEX "Like_siteId_ip_idx" ON "Like"("siteId", "ip");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
