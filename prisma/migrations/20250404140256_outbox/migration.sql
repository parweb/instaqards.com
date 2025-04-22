-- CreateTable
CREATE TABLE "Outbox" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Outbox_createdAt_idx" ON "Outbox"("createdAt");

-- CreateIndex
CREATE INDEX "Outbox_status_idx" ON "Outbox"("status");

-- CreateIndex
CREATE INDEX "Outbox_email_idx" ON "Outbox"("email");

-- AlterTable
ALTER TABLE "Outbox" ADD COLUMN     "metadata" JSONB DEFAULT '{}';


-- AddForeignKey
ALTER TABLE "Outbox" ADD CONSTRAINT "Outbox_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
