/*
  Warnings:

  - You are about to drop the column `backgroundColor` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `fontFamily` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `fontSize` on the `Block` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Block" DROP COLUMN "backgroundColor",
DROP COLUMN "color",
DROP COLUMN "fontFamily",
DROP COLUMN "fontSize",
ADD COLUMN     "widget" TEXT,
ALTER COLUMN "label" DROP NOT NULL,
ALTER COLUMN "href" DROP NOT NULL;
ALTER TABLE "Block" DROP COLUMN "widget",
ADD COLUMN     "widget" JSONB DEFAULT '{}';
