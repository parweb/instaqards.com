/*
  Warnings:

  - Made the column `userId` on table `Site` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Site" ALTER COLUMN "userId" SET NOT NULL;
