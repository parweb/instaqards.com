/*
  Warnings:

  - The `widget` column on the `Block` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Block" DROP COLUMN "widget",
ADD COLUMN     "widget" JSONB DEFAULT '{}';
