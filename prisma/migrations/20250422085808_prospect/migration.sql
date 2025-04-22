
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activity" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "codeNaf" TEXT,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "postcode" TEXT;

-- CreateIndex
CREATE INDEX "User_city_idx" ON "User"("city");

-- CreateIndex
CREATE INDEX "User_postcode_idx" ON "User"("postcode");

-- CreateIndex
CREATE INDEX "User_codeNaf_idx" ON "User"("codeNaf");

-- CreateIndex
CREATE INDEX "User_company_idx" ON "User"("company");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_activity_idx" ON "User"("activity");

-- CreateIndex
CREATE INDEX "User_activity_codeNaf_idx" ON "User"("activity", "codeNaf");

-- CreateIndex
CREATE INDEX "User_city_postcode_idx" ON "User"("city", "postcode");


INSERT INTO
    "public" ."User" (
        "id",
        "name",
        "email",
        "emailVerified",
        "image",
        "password",
        "isTwoFactorEnabled",
        "billing_address",
        "payment_method",
        "createdAt",
        "updatedAt",
        "role",
        "address",
        "city",
        "codeNaf",
        "company",
        "phone",
        "postcode",
        "activity",
        "refererId"
    )
SELECT
    DISTINCT ON (p.email) gen_random_uuid(),
    p."raison_sociale",
    p."email",
    NULL,
    NULL,
    NULL,
    false,
    '{}' ::jsonb,
    '{}' ::jsonb,
    NOW(),
    NOW(),
    'LEAD' ::"public"."UserRole",
    p."adresse",
    p."ville",
    p."code_naf",
    p."raison_sociale",
    p."tel",
    p."cp",
    p."activite",
    p."assigneeId"
FROM
    "public" ."Prospect" p
WHERE
    p.email IS NOT NULL; -- ON CONFLICT (email) DO NOTHING;

/*
  Warnings:

  - You are about to drop the `Prospect` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProspectStatusHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Prospect" DROP CONSTRAINT "Prospect_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "Prospect" DROP CONSTRAINT "Prospect_convertedId_fkey";

-- DropForeignKey
ALTER TABLE "ProspectStatusHistory" DROP CONSTRAINT "ProspectStatusHistory_prospectId_fkey";

-- DropForeignKey
ALTER TABLE "ProspectStatusHistory" DROP CONSTRAINT "ProspectStatusHistory_updatedBy_fkey";

-- DropTable
DROP TABLE "Prospect";

-- DropTable
DROP TABLE "ProspectStatusHistory";
