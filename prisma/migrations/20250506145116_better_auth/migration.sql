

ALTER TABLE "User" ADD COLUMN "emailVerified_next" BOOLEAN DEFAULT FALSE;
UPDATE "User" SET "emailVerified_next" = CASE WHEN "emailVerified" IS NOT NULL AND "emailVerified" <= NOW() THEN TRUE ELSE FALSE END;
ALTER TABLE "User" DROP COLUMN "emailVerified";
ALTER TABLE "User" RENAME COLUMN "emailVerified_next" TO "emailVerified";
ALTER TABLE "User" ALTER COLUMN "emailVerified" SET NOT NULL;
CREATE INDEX "User_emailVerified_idx" ON "User"("emailVerified");

ALTER TABLE "Account" DROP COLUMN "session_state",
DROP COLUMN "token_type",
DROP COLUMN "type";

DROP INDEX "Account_provider_providerAccountId_key";
ALTER TABLE "Account" DROP COLUMN "provider",
ADD COLUMN "password" TEXT,
ADD COLUMN "providerId" TEXT;
CREATE UNIQUE INDEX "Account_providerId_providerAccountId_key" ON "Account"("providerId", "providerAccountId");

ALTER TABLE "Session" ADD COLUMN "ipAddress" TEXT;
ALTER TABLE "Session" ADD COLUMN "userAgent" TEXT;

INSERT INTO
	"Account" (id, "providerId", "providerAccountId", password, "createdAt", "updatedAt", "userId")
SELECT
	gen_random_uuid ()::text AS id,
	'credential' AS "providerId",
	"email" AS "providerAccountId",
	"password",
	NOW(),
	NOW(),
	id AS "userId"
FROM "User"
WHERE "password" IS NOT NULL
ON CONFLICT ("providerId", "providerAccountId") DO
UPDATE SET password = EXCLUDED.password, "updatedAt" = NOW();

ALTER TABLE "User" DROP COLUMN "password";

/*
  Warnings:

  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);
