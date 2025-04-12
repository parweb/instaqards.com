-- CreateIndex
CREATE INDEX "Link_userId_id_idx" ON "Link"("userId", "id");

-- CreateIndex
CREATE INDEX "Prospect_activite_code_naf_idx" ON "Prospect"("activite", "code_naf");

-- CreateIndex
CREATE INDEX "Prospect_ville_cp_idx" ON "Prospect"("ville", "cp");
