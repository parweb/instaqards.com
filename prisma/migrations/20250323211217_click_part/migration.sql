/*
  Warnings:

  - Made the column `siteId` on table `Block` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Block" ALTER COLUMN "siteId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Click" ADD COLUMN     "part" TEXT;
