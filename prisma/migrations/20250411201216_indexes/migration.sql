-- DropIndex
DROP INDEX "Feedback_id_idx";

-- DropIndex
DROP INDEX "User_id_idx";

-- CreateIndex
CREATE INDEX "Site_userId_createdAt_idx" ON "Site"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Site_userId_updatedAt_idx" ON "Site"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "User_createdAt_id_idx" ON "User"("createdAt", "id");

-- CreateIndex
CREATE INDEX "User_refererId_createdAt_idx" ON "User"("refererId", "createdAt");
