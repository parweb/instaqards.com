-- CreateTable
CREATE TABLE "NafSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "NafSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NafDivision" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "NafDivision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NafGroup" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,

    CONSTRAINT "NafGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NafClass" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "NafClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NafCode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "NafCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NafDivision" ADD CONSTRAINT "NafDivision_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "NafSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NafGroup" ADD CONSTRAINT "NafGroup_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "NafDivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NafClass" ADD CONSTRAINT "NafClass_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "NafGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NafCode" ADD CONSTRAINT "NafCode_classId_fkey" FOREIGN KEY ("classId") REFERENCES "NafClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_codeNaf_fkey" FOREIGN KEY ("codeNaf") REFERENCES "NafCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;


INSERT INTO "public"."NafSection" ("id", "title") VALUES ('Z', 'N.C.');
INSERT INTO "public"."NafDivision" ("id", "title", "sectionId") VALUES ('00', 'N.C.', 'Z');
INSERT INTO "public"."NafGroup" ("id", "title", "divisionId") VALUES ('00.0', 'N.C.', '00');
INSERT INTO "public"."NafClass" ("id", "title", "groupId") VALUES ('00.00', 'N.C.', '00.0');
INSERT INTO "public"."NafCode" ("id", "title", "classId") VALUES ('00.00Z', 'N.C.', '00.00');

UPDATE "User"
SET    "codeNaf" = 
       left("codeNaf", 2)         
       || '.'                  
       || right("codeNaf", 3)    
WHERE  length("codeNaf") = 5      
  AND  position('.' in "codeNaf") = 0;