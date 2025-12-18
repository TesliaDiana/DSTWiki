const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class StructureService {
  async createStructure(data) {
    const {
      structureName,
      structureType,
      description,
      biomeIds = [],
      creatures = []
    } = data;
    if (!structureName) {
      throw new Error("Назва структури обовʼязкова");
    }
    return prisma.structures.create({
      data: {
        structure_name: structureName,
        structure_type: structureType,
        description,
        biomestructure: {
          create: biomeIds
            .map(id => Number(id))
            .filter(id => !isNaN(id))
            .map(biomeId => ({
              biome_id: biomeId,
            })),
        },
        structurecreature: {
          create: creatures
            .map(c => ({
              creature_id: Number(c.creatureId),
              quantity_of_creatures: Number(c.quantity ?? 1),
            }))
            .filter(
              c =>
                !isNaN(c.creature_id) &&
                !isNaN(c.quantity_of_creatures)
            ),
        },
      },
      include: {
        biomestructure: {
          include: { 
            biome: true 
          },
        },
        structurecreature: {
          include: { 
            creature: true 
          },
        },
      },
    });
  }

  async getAllStructures() {
    const [structures, totalCount] = await prisma.$transaction([
      prisma.structures.findMany({
        orderBy: { 
          structure_id: "asc" 
        },
        include: {
          biomestructure: { 
            include: { 
              biome: true 
            } 
          },
          structurecreature: { 
            include: { 
              creature: true 
            } 
          },
        },
      }),
      prisma.structures.count(),
    ]);
    return { structures, totalCount };
  }

  async getStructureById(id) {
    const structureId = Number(id);
    const structure = await prisma.structures.findUnique({
      where: { 
        structure_id: structureId 
      },
      include: {
        biomestructure: { 
          include: { 
            biome: true 
          } 
        },
        structurecreature: { 
          include: { 
            creature: true 
          } 
        },
      },
    });
    if (!structure) return null;
    return structure;
  }

  async updateStructure(id, data) {
    const structureId = Number(id);
    const {
      structureName,
      structureType,
      description,
      biomeIds,
      creatures
    } = data;
    const updateData = {
      ...(structureName !== undefined && { structure_name: structureName }),
      ...(structureType !== undefined && { structure_type: structureType }),
      ...(description !== undefined && { description }),
    };
    if (Array.isArray(biomeIds)) {
    updateData.biomestructure = {
      deleteMany: {},
      create: biomeIds
        .map(id => Number(id))
        .filter(id => !isNaN(id))
        .map(biomeId => ({ 
          biome_id: biomeId 
        })),
    };
  }
  if (Array.isArray(creatures)) {
    updateData.structurecreature = {
      deleteMany: {},
      create: creatures
        .map(c => ({
          creature_id: Number(c.creatureId),
          quantity_of_creatures: Number(c.quantity ?? 1),
        }))
        .filter(
          c =>
            !isNaN(c.creature_id) &&
            !isNaN(c.quantity_of_creatures)
        ),
    };
  }
  return prisma.structures.update({
    where: { 
      structure_id: structureId 
    },
    data: updateData,
    include: {
      biomestructure: { 
        include: { 
          biome: true 
        } 
      },
      structurecreature: { 
        include: { 
          creature: true 
        } 
      },
    },
  });
  }

  async deleteStructure(id) {
    const structureId = Number(id);
    const [biomes, creatures, events] = await prisma.$transaction([
      prisma.biomeStructure.findMany({
        where: { 
          structure_id: structureId 
        },
        include: { 
          biome: true 
        },
      }),
      prisma.structureCreature.findMany({
        where: { 
          structure_id: structureId 
        },
        include: { 
          creature: true 
        },
      }),
      prisma.structureEvent.findMany({
        where: { 
          structure_id: structureId 
        },
        include: { 
          events: true 
        },
      }),
    ]);
    if (biomes.length || creatures.length || events.length) {
      const error = new Error(
        `Неможливо видалити структуру.\n` +
        `Біоми: ${biomes.map(b => b.biome.biome_name).join(", ") || "—"}\n` +
        `Створіння: ${creatures.map(c => c.creature.creature_name).join(", ") || "—"}\n` +
        `Події: ${events.map(e => e.events.event_name).join(", ") || "—"}`
      );
      error.status = 409;
      throw error;
    }
    return prisma.structures.delete({
      where: { 
        structure_id: structureId 
      },
    });
  }
}

module.exports = new StructureService();
