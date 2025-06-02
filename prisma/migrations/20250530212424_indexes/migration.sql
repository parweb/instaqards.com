-- CreateIndex
CREATE INDEX "Click_siteId_createdAt_idx" ON "Click"("siteId", "createdAt");

-- CreateIndex
CREATE INDEX "User_bounced_idx" ON "User"("bounced");

-- CreateIndex
CREATE INDEX "User_bounced_createdAt_idx" ON "User"("bounced", "createdAt");
