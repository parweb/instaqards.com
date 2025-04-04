-- AddForeignKey
ALTER TABLE "Outbox" ADD CONSTRAINT "Outbox_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
