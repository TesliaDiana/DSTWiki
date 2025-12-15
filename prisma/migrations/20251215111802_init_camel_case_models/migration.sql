/*
  Warnings:

  - You are about to drop the `biomestructure` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `characterfeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `creaturebiome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `creaturedrop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `creatureforseason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventforseason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `featureskill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gamecharacter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itemsinbiome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itemstypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itemtoitemtype` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `startitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `structurecreature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `structureevent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `summoncreature` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `biome_location` on the `biome` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `behaviour` on the `creature` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `weather` on the `season` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "typeBehaviour" AS ENUM ('HOSTILE', 'NEUTRAL', 'PASSIVE');

-- CreateEnum
CREATE TYPE "typeBiome" AS ENUM ('EARTH', 'CAVE');

-- CreateEnum
CREATE TYPE "typeWeather" AS ENUM ('RAIN', 'SNOW', 'SUN', 'LIGHT');

-- DropForeignKey
ALTER TABLE "biomestructure" DROP CONSTRAINT "biomestructure_biome_id_fkey";

-- DropForeignKey
ALTER TABLE "biomestructure" DROP CONSTRAINT "biomestructure_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "characterfeature" DROP CONSTRAINT "characterfeature_character_id_fkey";

-- DropForeignKey
ALTER TABLE "characterfeature" DROP CONSTRAINT "characterfeature_feature_id_fkey";

-- DropForeignKey
ALTER TABLE "creaturebiome" DROP CONSTRAINT "creaturebiome_biome_id_fkey";

-- DropForeignKey
ALTER TABLE "creaturebiome" DROP CONSTRAINT "creaturebiome_creature_id_fkey";

-- DropForeignKey
ALTER TABLE "creaturedrop" DROP CONSTRAINT "creaturedrop_creature_id_fkey";

-- DropForeignKey
ALTER TABLE "creaturedrop" DROP CONSTRAINT "creaturedrop_item_id_fkey";

-- DropForeignKey
ALTER TABLE "creatureforseason" DROP CONSTRAINT "creatureforseason_creature_id_fkey";

-- DropForeignKey
ALTER TABLE "creatureforseason" DROP CONSTRAINT "creatureforseason_season_id_fkey";

-- DropForeignKey
ALTER TABLE "eventforseason" DROP CONSTRAINT "eventforseason_event_id_fkey";

-- DropForeignKey
ALTER TABLE "eventforseason" DROP CONSTRAINT "eventforseason_season_id_fkey";

-- DropForeignKey
ALTER TABLE "itemsinbiome" DROP CONSTRAINT "itemsinbiome_biome_id_fkey";

-- DropForeignKey
ALTER TABLE "itemsinbiome" DROP CONSTRAINT "itemsinbiome_item_id_fkey";

-- DropForeignKey
ALTER TABLE "itemtoitemtype" DROP CONSTRAINT "itemtoitemtype_item_id_fkey";

-- DropForeignKey
ALTER TABLE "itemtoitemtype" DROP CONSTRAINT "itemtoitemtype_item_type_id_fkey";

-- DropForeignKey
ALTER TABLE "startitem" DROP CONSTRAINT "startitem_character_id_fkey";

-- DropForeignKey
ALTER TABLE "startitem" DROP CONSTRAINT "startitem_item_id_fkey";

-- DropForeignKey
ALTER TABLE "structurecreature" DROP CONSTRAINT "structurecreature_creature_id_fkey";

-- DropForeignKey
ALTER TABLE "structurecreature" DROP CONSTRAINT "structurecreature_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "structureevent" DROP CONSTRAINT "structureevent_event_id_fkey";

-- DropForeignKey
ALTER TABLE "structureevent" DROP CONSTRAINT "structureevent_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "summoncreature" DROP CONSTRAINT "summoncreature_creature_id_fkey";

-- DropForeignKey
ALTER TABLE "summoncreature" DROP CONSTRAINT "summoncreature_event_id_fkey";

-- AlterTable
ALTER TABLE "biome" DROP COLUMN "biome_location",
ADD COLUMN     "biome_location" "typeBiome" NOT NULL;

-- AlterTable
ALTER TABLE "creature" DROP COLUMN "behaviour",
ADD COLUMN     "behaviour" "typeBehaviour" NOT NULL;

-- AlterTable
ALTER TABLE "season" DROP COLUMN "weather",
ADD COLUMN     "weather" "typeWeather" NOT NULL;

-- DropTable
DROP TABLE "biomestructure";

-- DropTable
DROP TABLE "characterfeature";

-- DropTable
DROP TABLE "creaturebiome";

-- DropTable
DROP TABLE "creaturedrop";

-- DropTable
DROP TABLE "creatureforseason";

-- DropTable
DROP TABLE "eventforseason";

-- DropTable
DROP TABLE "featureskill";

-- DropTable
DROP TABLE "gamecharacter";

-- DropTable
DROP TABLE "itemsinbiome";

-- DropTable
DROP TABLE "itemstypes";

-- DropTable
DROP TABLE "itemtoitemtype";

-- DropTable
DROP TABLE "startitem";

-- DropTable
DROP TABLE "structurecreature";

-- DropTable
DROP TABLE "structureevent";

-- DropTable
DROP TABLE "summoncreature";

-- DropEnum
DROP TYPE "type_behaviour";

-- DropEnum
DROP TYPE "type_biome";

-- DropEnum
DROP TYPE "type_weather";

-- CreateTable
CREATE TABLE "biomeStructure" (
    "structure_id" INTEGER NOT NULL,
    "biome_id" INTEGER NOT NULL,

    CONSTRAINT "biomeStructure_pkey" PRIMARY KEY ("structure_id","biome_id")
);

-- CreateTable
CREATE TABLE "characterFeature" (
    "feature_id" INTEGER NOT NULL,
    "character_id" INTEGER NOT NULL,

    CONSTRAINT "characterFeature_pkey" PRIMARY KEY ("feature_id","character_id")
);

-- CreateTable
CREATE TABLE "creatureBiome" (
    "biome_id" INTEGER NOT NULL,
    "creature_id" INTEGER NOT NULL,

    CONSTRAINT "creatureBiome_pkey" PRIMARY KEY ("biome_id","creature_id")
);

-- CreateTable
CREATE TABLE "creatureDrop" (
    "creature_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity_of_resources" SMALLINT NOT NULL,

    CONSTRAINT "creatureDrop_pkey" PRIMARY KEY ("creature_id","item_id")
);

-- CreateTable
CREATE TABLE "creatureForSeason" (
    "creature_id" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,

    CONSTRAINT "creatureForSeason_pkey" PRIMARY KEY ("creature_id","season_id")
);

-- CreateTable
CREATE TABLE "eventForSeason" (
    "event_id" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,

    CONSTRAINT "eventForSeason_pkey" PRIMARY KEY ("event_id","season_id")
);

-- CreateTable
CREATE TABLE "featureSkill" (
    "feature_id" SERIAL NOT NULL,
    "feature_skill" TEXT NOT NULL,

    CONSTRAINT "featureSkill_pkey" PRIMARY KEY ("feature_id")
);

-- CreateTable
CREATE TABLE "gameCharacter" (
    "character_id" SERIAL NOT NULL,
    "character_name" VARCHAR(32) NOT NULL,
    "max_health" SMALLINT NOT NULL,
    "max_hunger" SMALLINT NOT NULL,
    "max_sanity" SMALLINT NOT NULL,
    "speed_move" REAL NOT NULL,
    "strength_attack" REAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "gameCharacter_pkey" PRIMARY KEY ("character_id")
);

-- CreateTable
CREATE TABLE "itemsInBiome" (
    "item_id" INTEGER NOT NULL,
    "biome_id" INTEGER NOT NULL,

    CONSTRAINT "itemsInBiome_pkey" PRIMARY KEY ("biome_id","item_id")
);

-- CreateTable
CREATE TABLE "itemsTypes" (
    "item_type_id" SERIAL NOT NULL,
    "item_type_name" VARCHAR(32) NOT NULL,

    CONSTRAINT "itemsTypes_pkey" PRIMARY KEY ("item_type_id")
);

-- CreateTable
CREATE TABLE "itemToItemType" (
    "item_id" INTEGER NOT NULL,
    "item_type_id" INTEGER NOT NULL,

    CONSTRAINT "itemToItemType_pkey" PRIMARY KEY ("item_id","item_type_id")
);

-- CreateTable
CREATE TABLE "StartItem" (
    "character_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity_of_resources" SMALLINT NOT NULL,

    CONSTRAINT "StartItem_pkey" PRIMARY KEY ("character_id","item_id")
);

-- CreateTable
CREATE TABLE "structureCreature" (
    "creature_id" INTEGER NOT NULL,
    "structure_id" INTEGER NOT NULL,
    "quantity_of_creatures" SMALLINT NOT NULL,

    CONSTRAINT "structureCreature_pkey" PRIMARY KEY ("creature_id","structure_id")
);

-- CreateTable
CREATE TABLE "structureEvent" (
    "event_id" INTEGER NOT NULL,
    "structure_id" INTEGER NOT NULL,

    CONSTRAINT "structureEvent_pkey" PRIMARY KEY ("event_id","structure_id")
);

-- CreateTable
CREATE TABLE "summonCreature" (
    "event_id" INTEGER NOT NULL,
    "creature_id" INTEGER NOT NULL,

    CONSTRAINT "summonCreature_pkey" PRIMARY KEY ("event_id","creature_id")
);

-- AddForeignKey
ALTER TABLE "biomeStructure" ADD CONSTRAINT "biomeStructure_biome_id_fkey" FOREIGN KEY ("biome_id") REFERENCES "biome"("biome_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "biomeStructure" ADD CONSTRAINT "biomeStructure_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structures"("structure_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "characterFeature" ADD CONSTRAINT "characterFeature_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "gameCharacter"("character_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "characterFeature" ADD CONSTRAINT "characterFeature_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "featureSkill"("feature_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creatureBiome" ADD CONSTRAINT "creatureBiome_biome_id_fkey" FOREIGN KEY ("biome_id") REFERENCES "biome"("biome_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creatureBiome" ADD CONSTRAINT "creatureBiome_creature_id_fkey" FOREIGN KEY ("creature_id") REFERENCES "creature"("creature_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creatureDrop" ADD CONSTRAINT "creatureDrop_creature_id_fkey" FOREIGN KEY ("creature_id") REFERENCES "creature"("creature_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creatureDrop" ADD CONSTRAINT "creatureDrop_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creatureForSeason" ADD CONSTRAINT "creatureForSeason_creature_id_fkey" FOREIGN KEY ("creature_id") REFERENCES "creature"("creature_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creatureForSeason" ADD CONSTRAINT "creatureForSeason_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "season"("season_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventForSeason" ADD CONSTRAINT "eventForSeason_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventForSeason" ADD CONSTRAINT "eventForSeason_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "season"("season_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itemsInBiome" ADD CONSTRAINT "itemsInBiome_biome_id_fkey" FOREIGN KEY ("biome_id") REFERENCES "biome"("biome_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itemsInBiome" ADD CONSTRAINT "itemsInBiome_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itemToItemType" ADD CONSTRAINT "itemToItemType_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itemToItemType" ADD CONSTRAINT "itemToItemType_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "itemsTypes"("item_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StartItem" ADD CONSTRAINT "StartItem_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "gameCharacter"("character_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StartItem" ADD CONSTRAINT "StartItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "structureCreature" ADD CONSTRAINT "structureCreature_creature_id_fkey" FOREIGN KEY ("creature_id") REFERENCES "creature"("creature_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "structureCreature" ADD CONSTRAINT "structureCreature_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structures"("structure_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "structureEvent" ADD CONSTRAINT "structureEvent_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "structureEvent" ADD CONSTRAINT "structureEvent_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structures"("structure_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "summonCreature" ADD CONSTRAINT "summonCreature_creature_id_fkey" FOREIGN KEY ("creature_id") REFERENCES "creature"("creature_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "summonCreature" ADD CONSTRAINT "summonCreature_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
