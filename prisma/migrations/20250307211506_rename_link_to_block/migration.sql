-- Link -> Block

-- CREATE TABLE "Click" (
--     "linkId" TEXT,
-- );
ALTER TABLE "Click" RENAME COLUMN "linkId" TO "blockId";
-- -- ALTER TABLE "Click" RENAME COLUMN "blockId" TO "linkId";


-- CREATE TABLE "Link" (
--     CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
-- );
ALTER TABLE "Link" RENAME TO "Block";
-- -- ALTER TABLE "Block" RENAME TO "Link";
ALTER TABLE "Block" RENAME CONSTRAINT "Link_pkey" TO "Block_pkey";
-- -- ALTER TABLE "Link" RENAME CONSTRAINT "Block_pkey" TO "Link_pkey";

-- CREATE INDEX "Link_siteId_idx" ON "Link"("siteId");
ALTER INDEX "Link_siteId_idx" RENAME TO "Block_siteId_idx";
-- -- ALTER INDEX "Block_siteId_idx" RENAME TO "Link_siteId_idx";

-- CREATE INDEX "Link_type_idx" ON "Link"("type");
ALTER INDEX "Link_type_idx" RENAME TO "Block_type_idx";
-- -- ALTER INDEX "Block_type_idx" RENAME TO "Link_type_idx";

-- ALTER TABLE "Click" ADD CONSTRAINT "Click_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Click" DROP CONSTRAINT "Click_linkId_fkey";
-- -- ALTER TABLE "Click" DROP CONSTRAINT "Click_blockId_fkey";
ALTER TABLE "Click" ADD CONSTRAINT "Click_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- -- ALTER TABLE "Click" ADD CONSTRAINT "Click_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE "Link" ADD CONSTRAINT "Link_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Block" RENAME CONSTRAINT "Link_siteId_fkey" TO "Block_siteId_fkey";
-- -- ALTER TABLE "Link" RENAME CONSTRAINT "Block_siteId_fkey" TO "Link_siteId_fkey";



