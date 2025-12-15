-- CreateEnum
CREATE TYPE "type_behaviour" AS ENUM ('HOSTILE', 'NEUTRAL', 'PASSIVE');

-- CreateEnum
CREATE TYPE "type_biome" AS ENUM ('EARTH', 'CAVE');

-- CreateEnum
CREATE TYPE "type_weather" AS ENUM ('RAIN', 'SNOW', 'SUN', 'LIGHT');

-- CreateTable
CREATE TABLE "biome" (
    "biome_id" SERIAL NOT NULL,
    "biome_name" VARCHAR(32) NOT NULL,
    "biome_location" "type_biome" NOT NULL,
    "spread" REAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "biome_pkey" PRIMARY KEY ("biome_id")
);

-- CreateTable
CREATE TABLE "biomestructure" (
    "structure_id" INTEGER NOT NULL,
    "biome_id" INTEGER NOT NULL,

    CONSTRAINT "biomestructure_pkey" PRIMARY KEY ("structure_id","biome_id")
);

-- CreateTable
CREATE TABLE "characterfeature" (
    "feature_id" INTEGER NOT NULL,
    "character_id" INTEGER NOT NULL,

    CONSTRAINT "characterfeature_pkey" PRIMARY KEY ("feature_id","character_id")
);

-- CreateTable
CREATE TABLE "creature" (
    "creature_id" SERIAL NOT NULL,
    "creature_name" VARCHAR(32) NOT NULL,
    "behaviour" "type_behaviour" NOT NULL,
    "health" SMALLINT NOT NULL,
    "speed_move" REAL,
    "speed_attack" REAL,
    "strength_attack" SMALLINT,
    "description" TEXT NOT NULL,

    CONSTRAINT "creature_pkey" PRIMARY KEY ("creature_id")
);

-- CreateTable
CREATE TABLE "creaturebiome" (
    "biome_id" INTEGER NOT NULL,
    "creature_id" INTEGER NOT NULL,

    CONSTRAINT "creaturebiome_pkey" PRIMARY KEY ("biome_id","creature_id")
);

-- CreateTable
CREATE TABLE "creaturedrop" (
    "creature_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity_of_resources" SMALLINT NOT NULL,

    CONSTRAINT "creaturedrop_pkey" PRIMARY KEY ("creature_id","item_id")
);

-- CreateTable
CREATE TABLE "creatureforseason" (
    "creature_id" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,

    CONSTRAINT "creatureforseason_pkey" PRIMARY KEY ("creature_id","season_id")
);

-- CreateTable
CREATE TABLE "eventforseason" (
    "event_id" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,

    CONSTRAINT "eventforseason_pkey" PRIMARY KEY ("event_id","season_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" SERIAL NOT NULL,
    "event_name" VARCHAR(32) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "featureskill" (
    "feature_id" SERIAL NOT NULL,
    "feature_skill" TEXT NOT NULL,

    CONSTRAINT "featureskill_pkey" PRIMARY KEY ("feature_id")
);

-- CreateTable
CREATE TABLE "gamecharacter" (
    "character_id" SERIAL NOT NULL,
    "character_name" VARCHAR(32) NOT NULL,
    "max_health" SMALLINT NOT NULL,
    "max_hunger" SMALLINT NOT NULL,
    "max_sanity" SMALLINT NOT NULL,
    "speed_move" REAL NOT NULL,
    "strength_attack" REAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "gamecharacter_pkey" PRIMARY KEY ("character_id")
);

-- CreateTable
CREATE TABLE "item" (
    "item_id" SERIAL NOT NULL,
    "item_name" VARCHAR(32) NOT NULL,
    "max_stack" SMALLINT NOT NULL,
    "durability" SMALLINT,
    "recipe_id" INTEGER,
    "description" TEXT NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "itemsinbiome" (
    "item_id" INTEGER NOT NULL,
    "biome_id" INTEGER NOT NULL,

    CONSTRAINT "itemsinbiome_pkey" PRIMARY KEY ("biome_id","item_id")
);

-- CreateTable
CREATE TABLE "itemstypes" (
    "item_type_id" SERIAL NOT NULL,
    "item_type_name" VARCHAR(32) NOT NULL,

    CONSTRAINT "itemstypes_pkey" PRIMARY KEY ("item_type_id")
);

-- CreateTable
CREATE TABLE "itemtoitemtype" (
    "item_id" INTEGER NOT NULL,
    "item_type_id" INTEGER NOT NULL,

    CONSTRAINT "itemtoitemtype_pkey" PRIMARY KEY ("item_id","item_type_id")
);

-- CreateTable
CREATE TABLE "season" (
    "season_id" SERIAL NOT NULL,
    "season_name" VARCHAR(32) NOT NULL,
    "quantity_of_days" SMALLINT NOT NULL,
    "weather" "type_weather" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "season_pkey" PRIMARY KEY ("season_id")
);

-- CreateTable
CREATE TABLE "startitem" (
    "character_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity_of_resources" SMALLINT NOT NULL,

    CONSTRAINT "startitem_pkey" PRIMARY KEY ("character_id","item_id")
);

-- CreateTable
CREATE TABLE "structurecreature" (
    "creature_id" INTEGER NOT NULL,
    "structure_id" INTEGER NOT NULL,
    "quantity_of_creatures" SMALLINT NOT NULL,

    CONSTRAINT "structurecreature_pkey" PRIMARY KEY ("creature_id","structure_id")
);

-- CreateTable
CREATE TABLE "structureevent" (
    "event_id" INTEGER NOT NULL,
    "structure_id" INTEGER NOT NULL,

    CONSTRAINT "structureevent_pkey" PRIMARY KEY ("event_id","structure_id")
);

-- CreateTable
CREATE TABLE "structures" (
    "structure_id" SERIAL NOT NULL,
    "structure_type" VARCHAR(32) NOT NULL,
    "structure_name" VARCHAR(32) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "structures_pkey" PRIMARY KEY ("structure_id")
);

-- CreateTable
CREATE TABLE "summoncreature" (
    "event_id" INTEGER NOT NULL,
    "creature_id" INTEGER NOT NULL,

    CONSTRAINT "summoncreature_pkey" PRIMARY KEY ("event_id","creature_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_recipe_id_key" ON "item"("recipe_id");

-- AddForeignKey
ALTER TABLE "biomestructure" ADD CONSTRAINT "biomestructure_biome_id_fkey" FOREIGN KEY ("biome_id") REFERENCES "biome"("biome_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "biomestructure" ADD CONSTRAINT "biomestructure_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structures"("structure_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "characterfeature" ADD CONSTRAINT "characterfeature_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "gamecharacter"("character_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "characterfeature" ADD CONSTRAINT "characterfeature_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "featureskill"("feature_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creaturebiome" ADD CONSTRAINT "creaturebiome_biome_id_fkey" FOREIGN KEY ("biome_id") REFERENCES "biome"("biome_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creaturebiome" ADD CONSTRAINT "creaturebiome_creature_id_fkey" FOREIGN KEY ("creature_id") REFERENCES "creature"("creature_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creaturedrop" ADD CONSTRAINT "creaturedrop_creature_id_fkey" FOREIGN KEY ("creature_id") REFERENCES "creature"("creature_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creaturedrop" ADD CONSTRAINT "creaturedrop_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creatureforseason" ADD CONSTRAINT "creatureforseason_creature_id_fkey" FOREIGN KEY ("creature_id") REFERENCES "creature"("creature_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creatureforseason" ADD CONSTRAINT "creatureforseason_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "season"("season_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventforseason" ADD CONSTRAINT "eventforseason_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventforseason" ADD CONSTRAINT "eventforseason_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "season"("season_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itemsinbiome" ADD CONSTRAINT "itemsinbiome_biome_id_fkey" FOREIGN KEY ("biome_id") REFERENCES "biome"("biome_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itemsinbiome" ADD CONSTRAINT "itemsinbiome_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itemtoitemtype" ADD CONSTRAINT "itemtoitemtype_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itemtoitemtype" ADD CONSTRAINT "itemtoitemtype_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "itemstypes"("item_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "startitem" ADD CONSTRAINT "startitem_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "gamecharacter"("character_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "startitem" ADD CONSTRAINT "startitem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "structurecreature" ADD CONSTRAINT "structurecreature_creature_id_fkey" FOREIGN KEY ("creature_id") REFERENCES "creature"("creature_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "structurecreature" ADD CONSTRAINT "structurecreature_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structures"("structure_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "structureevent" ADD CONSTRAINT "structureevent_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "structureevent" ADD CONSTRAINT "structureevent_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structures"("structure_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "summoncreature" ADD CONSTRAINT "summoncreature_creature_id_fkey" FOREIGN KEY ("creature_id") REFERENCES "creature"("creature_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "summoncreature" ADD CONSTRAINT "summoncreature_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
