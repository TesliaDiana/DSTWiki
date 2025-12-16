const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CreatureService {
  async createCreature(data) {
    const { creature_name, behaviour, health, speed_move, speed_attack, strength_attack, description } = data;
    return await prisma.creature.create({
      data: { creature_name, behaviour, health, speed_move, speed_attack, strength_attack, description },
    });
  }

  async getAllCreatures(prismaOptions = {}) {
    const [creatures, totalCount] = await prisma.$transaction([
      prisma.creature.findMany({
        where: { is_deleted: false },
        orderBy: { creature_id: "asc" },
        include: {
          creatureDrop: { include: { item: true } },
          creatureBiome: { include: { biome: true } },
          creatureForSeason: { include: { season: true } },
          structureCreature: { include: { structures: true } },
          summonCreature: { include: { events: true } },
        },
        ...prismaOptions,
      }),
      prisma.creature.count({ where: { is_deleted: false } }),
    ]);

    const stats = {
      totalCreatures: totalCount,
      totalDrops: await prisma.creatureDrop.count(),
      totalBiomes: await prisma.creatureBiome.count(),
      totalSeasons: await prisma.creatureForSeason.count(),
      totalInStructures: await prisma.structureCreature.count(),
      totalSummons: await prisma.summonCreature.count(),
    };

    return { items: creatures, stats };
  }

  async getCreatureById(id, prismaOptions = {}) {
    const creature = await prisma.creature.findUnique({
      where: { creature_id: id, },
      include: {
        creatureDrop: { include: { item: true } },
        creatureBiome: { include: { biome: true } },
        creatureForSeason: { include: { season: true } },
        structureCreature: { include: { structures: true } },
        summonCreature: { include: { events: true } },
      },
      ...prismaOptions,
    });

    if (!creature) return null;

    const stats = {
      totalDrops: await prisma.creatureDrop.count({ where: { creature_id: id } }),
      totalBiomes: await prisma.creatureBiome.count({ where: { creature_id: id } }),
      totalSeasons: await prisma.creatureForSeason.count({ where: { creature_id: id } }),
      totalInStructures: await prisma.structureCreature.count({ where: { creature_id: id } }),
      totalSummons: await prisma.summonCreature.count({ where: { creature_id: id } }),
    };

    return { creature, stats };
  }

  async updateCreature(id, data) {
    return await prisma.creature.update({
      where: { creature_id: id },
      data: {
        creature_name: data.creatureName,
        behaviour: data.behaviour,
        health: data.health,
        speed_move: data.speedMove,
        speed_attack: data.speedAttack,
        strength_attack: data.strengthAttack,
        description: data.description,
      },
      include: {
        creatureDrop: { include: { item: true } },
        creatureBiome: true,
        creatureForSeason: true,
      },
    });
  }

  async softDeleteCreature(id) {
    return await prisma.creature.update({
      where: { creature_id: id },
      data: { is_deleted: true },
    });
  }
}

module.exports = new CreatureService();
