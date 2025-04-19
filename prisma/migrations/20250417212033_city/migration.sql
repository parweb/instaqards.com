-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "departement" TEXT,
    "slug" TEXT,
    "nom" TEXT,
    "nomSimple" TEXT,
    "nomReel" TEXT,
    "nomSoundex" TEXT,
    "nomMetaphone" TEXT,
    "codePostal" TEXT,
    "commune" TEXT,
    "codeCommune" TEXT NOT NULL,
    "arrondissement" INTEGER,
    "canton" TEXT,
    "amdi" INTEGER,
    "population2010" INTEGER,
    "population1999" INTEGER,
    "population2012" INTEGER,
    "densite2010" INTEGER,
    "surface" DOUBLE PRECISION,
    "longitudeDeg" DOUBLE PRECISION,
    "latitudeDeg" DOUBLE PRECISION,
    "longitudeGrd" TEXT,
    "latitudeGrd" TEXT,
    "longitudeDms" TEXT,
    "latitudeDms" TEXT,
    "zmin" INTEGER,
    "zmax" INTEGER,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "City_codeCommune_key" ON "City"("codeCommune");

-- CreateIndex
CREATE INDEX "City_departement_idx" ON "City"("departement");

-- CreateIndex
CREATE INDEX "City_nom_idx" ON "City"("nom");

-- CreateIndex
CREATE INDEX "City_nomReel_idx" ON "City"("nomReel");

-- CreateIndex
CREATE INDEX "City_codePostal_idx" ON "City"("codePostal");

-- CreateIndex
CREATE INDEX "City_longitudeDeg_latitudeDeg_idx" ON "City"("longitudeDeg", "latitudeDeg");

-- CreateIndex
CREATE INDEX "City_nomSoundex_idx" ON "City"("nomSoundex");

-- CreateIndex
CREATE INDEX "City_nomMetaphone_idx" ON "City"("nomMetaphone");

-- CreateIndex
CREATE INDEX "City_population2010_idx" ON "City"("population2010");

-- CreateIndex
CREATE INDEX "City_nomSimple_idx" ON "City"("nomSimple");
