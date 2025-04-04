-- AlterTable
ALTER TABLE "Outbox" ADD COLUMN     "metadata" JSONB DEFAULT '{}';
