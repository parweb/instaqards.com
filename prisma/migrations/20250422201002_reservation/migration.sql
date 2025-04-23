-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "affiliateId" TEXT,
ADD COLUMN     "type" TEXT;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
