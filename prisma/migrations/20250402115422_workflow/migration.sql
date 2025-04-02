/*
  Warnings:

  - You are about to drop the column `workerId` on the `Queue` table. All the data in the column will be lost.
  - Changed the type of `actionType` on the `Action` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "actionType",
ADD COLUMN     "actionType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "workerId";

-- DropEnum
DROP TYPE "ActionType";
