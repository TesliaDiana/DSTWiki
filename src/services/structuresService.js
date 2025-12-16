const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class StructureService {
  async createStructure(data) {
    const { structure_name, structure_type, description, biomeIds = [], creatureIds = [], eventIds = [] } = data;

    return await prisma.structures.create({
      data: {
        structure_name,
        structure_type,
        description,

        ...(biomeIds.length > 0 && {
          biomestructure: {
            create: biomeIds.map((biomeId) => ({ biome_id: biomeId })),
          },
        }),

        ...(creatureIds.length > 0 && {
          structurecreature: {
            create: creatureIds.map((creatureId) => ({ creature_id: creatureId, quantity_of_creatures: 1 })),
          },
        }),

        ...(eventIds.length > 0 && {
          structureevent: {
            create: eventIds.map((eventId) => ({ event_id: eventId })),
          },
        }),
      },
      include: {
        biomestructure: { include: { biome: true } },
        structurecreature: { include: { creature: true } },
        structureevent: { include: { events: true } },
      },
    });
  }

  async getAllStructures(prismaOptions = {}) {
    const [structures, biomeLinks, creatureLinks, eventLinks] = await prisma.$transaction([
      prisma.structures.findMany({
        orderBy: { structure_id: "asc" },
        ...prismaOptions,
      }),
      prisma.biomeStructure.count(),
      prisma.structureCreature.count(),
      prisma.structureEvent.count(),
    ]);

    return {
      items: structures,
      stats: {
        totalStructures: structures.length,
        totalBiomesLinked: biomeLinks,
        totalCreaturesLinked: creatureLinks,
        totalEventsLinked: eventLinks,
      },
    };
  }

  async getStructureById(id, prismaOptions = {}) {
    const [structure, biomeCount, creatureCount, eventCount] = await prisma.$transaction([
      prisma.structures.findUnique({
        where: { structure_id: id },
        ...prismaOptions,
      }),
      prisma.biomeStructure.count({ where: { structure_id: id } }),
      prisma.structureCreature.count({ where: { structure_id: id } }),
      prisma.structureEvent.count({ where: { structure_id: id } }),
    ]);

    if (!structure) return null;

    return {
      structure,
      stats: {
        biomes: biomeCount,
        creatures: creatureCount,
        events: eventCount,
      },
    };
  }

  async updateStructure(id, data) {
    const { structure_name, structure_type, description, biomeIds, creatureIds, eventIds } = data;

    return await prisma.$transaction(async (tx) => {
      await tx.structures.update({
        where: { structure_id: id },
        data: { structure_name, structure_type, description },
      });

      if (biomeIds) {
        await tx.biomeStructure.deleteMany({ where: { structure_id: id } });
        if (biomeIds.length > 0) {
          await tx.biomeStructure.createMany({
            data: biomeIds.map((biomeId) => ({ structure_id: id, biome_id: biomeId })),
          });
        }
      }

      if (creatureIds) {
        await tx.structureCreature.deleteMany({ where: { structure_id: id } });
        if (creatureIds.length > 0) {
          await tx.structureCreature.createMany({
            data: creatureIds.map((creatureId) => ({ structure_id: id, creature_id: creatureId, quantity_of_creatures: 1 })),
          });
        }
      }

      if (eventIds) {
        await tx.structureEvent.deleteMany({ where: { structure_id: id } });
        if (eventIds.length > 0) {
          await tx.structureEvent.createMany({
            data: eventIds.map((eventId) => ({ structure_id: id, event_id: eventId })),
          });
        }
      }

      return tx.structures.findUnique({
        where: { structure_id: id },
        include: {
          biomestructure: { include: { biome: true } },
          structurecreature: { include: { creature: true } },
          structureevent: { include: { events: true } },
        },
      });
    });
  }

  async deleteStructure(id) {
    const [biomes, creatures, events] = await prisma.$transaction([
      prisma.biomeStructure.findMany({ where: { structure_id: id }, include: { biome: true } }),
      prisma.structureCreature.findMany({ where: { structure_id: id }, include: { creature: true } }),
      prisma.structureEvent.findMany({ where: { structure_id: id }, include: { events: true } }),
    ]);

    if (biomes.length > 0 || creatures.length > 0 || events.length > 0) {
      const error = new Error(
        `Неможливо видалити структуру.
        Біоми: ${biomes.map(b => b.biome.biome_name).join(", ") || "—"}
        Створіння: ${creatures.map(c => c.creature.creature_name).join(", ") || "—"}
        Події: ${events.map(e => e.events.event_name).join(", ") || "—"}`
      );
      error.status = 409;
      throw error;
    }

    return await prisma.structures.delete({ where: { structure_id: id } });
  }
}

module.exports = new StructureService();
