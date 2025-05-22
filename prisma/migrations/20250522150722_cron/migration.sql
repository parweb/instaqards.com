-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_listId_fkey";

-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "listId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE SET NULL ON UPDATE CASCADE;
