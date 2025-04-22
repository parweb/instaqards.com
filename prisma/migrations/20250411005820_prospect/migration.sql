-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "raison_sociale" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "cp" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "code_naf" TEXT NOT NULL,
    "activite" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Prospect" ALTER COLUMN "raison_sociale" DROP NOT NULL,
ALTER COLUMN "adresse" DROP NOT NULL,
ALTER COLUMN "cp" DROP NOT NULL,
ALTER COLUMN "ville" DROP NOT NULL,
ALTER COLUMN "tel" DROP NOT NULL,
ALTER COLUMN "code_naf" DROP NOT NULL,
ALTER COLUMN "activite" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Prospect_email_idx" ON "Prospect"("email");

-- CreateIndex
CREATE INDEX "Prospect_ville_idx" ON "Prospect"("ville");

-- CreateIndex
CREATE INDEX "Prospect_cp_idx" ON "Prospect"("cp");

-- CreateIndex
CREATE INDEX "Prospect_code_naf_idx" ON "Prospect"("code_naf");

-- CreateIndex
CREATE INDEX "Prospect_tel_idx" ON "Prospect"("tel");

-- CreateIndex
CREATE INDEX "Prospect_activite_idx" ON "Prospect"("activite");

-- CreateIndex
CREATE INDEX "Link_userId_id_idx" ON "Link"("userId", "id");

-- CreateIndex
CREATE INDEX "Prospect_activite_code_naf_idx" ON "Prospect"("activite", "code_naf");

-- CreateIndex
CREATE INDEX "Prospect_ville_cp_idx" ON "Prospect"("ville", "cp");

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


-- AlterTable
ALTER TABLE "Prospect" ALTER COLUMN "updatedAt" DROP DEFAULT;


-- AlterTable
ALTER TABLE "Prospect" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;


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

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'LEAD';