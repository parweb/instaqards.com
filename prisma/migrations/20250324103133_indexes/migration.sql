/*
  Warnings:

  - You are about to drop the column `siteId` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_siteId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "siteId",
ADD COLUMN     "blockId" TEXT,
ALTER COLUMN "dateStart" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "dateEnd" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Block_position_idx" ON "Block"("position");

-- CreateIndex
CREATE INDEX "Block_siteId_type_idx" ON "Block"("siteId", "type");

-- CreateIndex
CREATE INDEX "Link_userId_idx" ON "Link"("userId");

-- CreateIndex
CREATE INDEX "Link_createdAt_idx" ON "Link"("createdAt");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Click_createdAt_idx" ON "Click"("createdAt");

-- CreateIndex
CREATE INDEX "Click_siteId_idx" ON "Click"("siteId");

-- CreateIndex
CREATE INDEX "Click_linkId_idx" ON "Click"("linkId");

-- CreateIndex
CREATE INDEX "Click_blockId_idx" ON "Click"("blockId");

-- CreateIndex
CREATE INDEX "Link_url_idx" ON "Link"("url");

-- CreateIndex
CREATE INDEX "Price_productId_idx" ON "Price"("productId");

-- CreateIndex
CREATE INDEX "Queue_status_idx" ON "Queue"("status");

-- CreateIndex
CREATE INDEX "Queue_runAt_idx" ON "Queue"("runAt");

-- CreateIndex
CREATE INDEX "Queue_id_idx" ON "Queue"("id");

-- CreateIndex
CREATE INDEX "Reservation_dateStart_idx" ON "Reservation"("dateStart");

-- CreateIndex
CREATE INDEX "Reservation_dateEnd_idx" ON "Reservation"("dateEnd");

-- CreateIndex
CREATE INDEX "Reservation_blockId_idx" ON "Reservation"("blockId");

-- CreateIndex
CREATE INDEX "Reservation_email_idx" ON "Reservation"("email");

-- CreateIndex
CREATE INDEX "Reservation_blockId_email_idx" ON "Reservation"("blockId", "email");

-- CreateIndex
CREATE INDEX "Site_subdomain_idx" ON "Site"("subdomain");

-- CreateIndex
CREATE INDEX "Site_customDomain_idx" ON "Site"("customDomain");

-- CreateIndex
CREATE INDEX "Subscriber_siteId_idx" ON "Subscriber"("siteId");

-- CreateIndex
CREATE INDEX "Subscriber_email_idx" ON "Subscriber"("email");

-- CreateIndex
CREATE INDEX "Subscriber_siteId_email_idx" ON "Subscriber"("siteId", "email");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_current_period_end_idx" ON "Subscription"("current_period_end");

-- CreateIndex
CREATE INDEX "Subscription_priceId_idx" ON "Subscription"("priceId");

-- CreateIndex
CREATE INDEX "User_refererId_idx" ON "User"("refererId");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_emailVerified_idx" ON "User"("emailVerified");
