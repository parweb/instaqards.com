/*
  Warnings:

  - You are about to drop the column `internalName` on the `Action` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Action` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Action_internalName_key";

-- AlterTable
ALTER TABLE "public"."Action" RENAME COLUMN "internalName" TO "code";

-- CreateIndex
CREATE UNIQUE INDEX "Action_code_key" ON "Action"("code");
