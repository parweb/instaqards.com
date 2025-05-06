-- AlterTable
ALTER TABLE "Click" ADD COLUMN     "refererId" TEXT;

-- CreateIndex
CREATE INDEX "Click_userId_idx" ON "Click"("userId");

-- CreateIndex
CREATE INDEX "Click_refererId_idx" ON "Click"("refererId");

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_refererId_fkey" FOREIGN KEY ("refererId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
