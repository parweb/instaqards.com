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
