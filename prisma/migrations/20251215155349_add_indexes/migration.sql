/*
  Warnings:

  - The primary key for the `characterFeature` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `drop_chance` on the `creatureDrop` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - The primary key for the `creatureForSeason` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `eventForSeason` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `structureCreature` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `structureEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `StartItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StartItem" DROP CONSTRAINT "StartItem_character_id_fkey";

-- DropForeignKey
ALTER TABLE "StartItem" DROP CONSTRAINT "StartItem_item_id_fkey";

-- AlterTable
ALTER TABLE "characterFeature" DROP CONSTRAINT "characterFeature_pkey",
ADD CONSTRAINT "characterFeature_pkey" PRIMARY KEY ("character_id", "feature_id");

-- AlterTable
ALTER TABLE "creatureDrop" ALTER COLUMN "drop_chance" DROP DEFAULT,
ALTER COLUMN "drop_chance" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "creatureForSeason" DROP CONSTRAINT "creatureForSeason_pkey",
ADD CONSTRAINT "creatureForSeason_pkey" PRIMARY KEY ("season_id", "creature_id");

-- AlterTable
ALTER TABLE "eventForSeason" DROP CONSTRAINT "eventForSeason_pkey",
ADD CONSTRAINT "eventForSeason_pkey" PRIMARY KEY ("season_id", "event_id");

-- AlterTable
ALTER TABLE "structureCreature" DROP CONSTRAINT "structureCreature_pkey",
ADD CONSTRAINT "structureCreature_pkey" PRIMARY KEY ("structure_id", "creature_id");

-- AlterTable
ALTER TABLE "structureEvent" DROP CONSTRAINT "structureEvent_pkey",
ADD CONSTRAINT "structureEvent_pkey" PRIMARY KEY ("structure_id", "event_id");

-- DropTable
DROP TABLE "StartItem";

-- CreateTable
CREATE TABLE "startItem" (
    "character_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity_of_resources" SMALLINT NOT NULL,

    CONSTRAINT "startItem_pkey" PRIMARY KEY ("character_id","item_id")
);

-- CreateIndex
CREATE INDEX "biome_biome_name_idx" ON "biome"("biome_name");

-- CreateIndex
CREATE INDEX "creature_is_deleted_idx" ON "creature"("is_deleted");

-- CreateIndex
CREATE INDEX "creature_creature_name_idx" ON "creature"("creature_name");

-- CreateIndex
CREATE INDEX "creatureBiome_creature_id_idx" ON "creatureBiome"("creature_id");

-- CreateIndex
CREATE INDEX "creatureDrop_item_id_idx" ON "creatureDrop"("item_id");

-- CreateIndex
CREATE INDEX "events_event_name_idx" ON "events"("event_name");

-- CreateIndex
CREATE INDEX "gameCharacter_character_name_idx" ON "gameCharacter"("character_name");

-- CreateIndex
CREATE INDEX "item_item_name_idx" ON "item"("item_name");

-- CreateIndex
CREATE INDEX "itemsInBiome_item_id_idx" ON "itemsInBiome"("item_id");

-- CreateIndex
CREATE INDEX "season_season_name_idx" ON "season"("season_name");

-- AddForeignKey
ALTER TABLE "startItem" ADD CONSTRAINT "startItem_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "gameCharacter"("character_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "startItem" ADD CONSTRAINT "startItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
