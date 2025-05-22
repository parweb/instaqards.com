-- AlterTable
ALTER TABLE "User" ADD COLUMN     "location" JSONB DEFAULT '{}';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'GUEST';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bounced" BOOLEAN NOT NULL DEFAULT false;

/*
  Warnings:

  - The `bounced` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bounced",
ADD COLUMN     "bounced" INTEGER NOT NULL DEFAULT 0;
