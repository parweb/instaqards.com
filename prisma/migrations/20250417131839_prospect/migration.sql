-- CreateTable
CREATE TABLE "ProspectStatusHistory" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "previousStatus" TEXT NOT NULL,
    "newStatus" TEXT NOT NULL,
    "position" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,

    CONSTRAINT "ProspectStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProspectStatusHistory_prospectId_idx" ON "ProspectStatusHistory"("prospectId");

-- CreateIndex
CREATE INDEX "ProspectStatusHistory_createdAt_idx" ON "ProspectStatusHistory"("createdAt");

-- CreateIndex
CREATE INDEX "ProspectStatusHistory_updatedBy_idx" ON "ProspectStatusHistory"("updatedBy");

-- AddForeignKey
ALTER TABLE "ProspectStatusHistory" ADD CONSTRAINT "ProspectStatusHistory_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProspectStatusHistory" ADD CONSTRAINT "ProspectStatusHistory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
