const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class BiomeService {
  async createBiome(data) {
    const {
      biomeName,
      biomeLocation,
      spread,
      description
    } = data;
    return await prisma.biome.create({
      data: {
        biome_name: biomeName,
        biome_location: biomeLocation,
        spread,
        description
      }
    });
  }

  async getAllBiomes() {
    const [biomes, totalCount] = await prisma.$transaction([
      prisma.biome.findMany({
        orderBy: { 
          biome_id: "asc" 
        }
      }),
      prisma.biome.count()
    ]);
    return { biomes, totalCount };
  }

  async getBiomeById(id) {
    const biome = await prisma.biome.findUnique({
      where: { 
        biome_id: Number(id) 
      }
    });
    if (!biome) {
      const err = new Error("Біом не знайдено");
      err.status = 404;
      throw err;
    }
    return biome;
  }

  async updateBiome(id, data) {
    const biomeId = Number(id);
    const {
      biomeName,
      biomeLocation,
      spread,
      description
    } = data;
    return await prisma.biome.update({
      where: { 
        biome_id: biomeId 
      },
      data: {
        ...(biomeName !== undefined && { 
          biome_name: biomeName 
        }),
        ...(biomeLocation !== undefined && { 
          biome_location: biomeLocation 
        }),
        ...(spread !== undefined && { 
          spread 
        }),
        ...(description !== undefined && { 
          description 
        })
      }
    });
  }

  async deleteBiome(id) {
    const [
      items,
      structures,
      creatures
    ] = await prisma.$transaction([
      prisma.itemsInBiome.findMany({
        where: { 
          biome_id: id 
        },
        include: { 
          item: true 
        },
      }),
      prisma.biomeStructure.findMany({
        where: { 
          biome_id: id 
        },
        include: { 
          structures: true 
        },
      }),
      prisma.creatureBiome.findMany({
        where: { 
          biome_id: id 
        },
        include: { 
          creature: true 
        },
      })
    ]);

    if (
      items.length > 0 ||
      structures.length > 0 ||
      creatures.length > 0
    ) {
      const error = new Error(
        `Неможливо видалити біом.
  Items: ${items.map(i => i.item.item_name).join(", ") || "—"}
  Structures: ${structures.map(s => s.structures.structure_name).join(", ") || "—"}
  Creatures: ${creatures.map(c => c.creature.creature_name).join(", ") || "—"}`
      );
      error.status = 409;
      throw error;
    }

    return prisma.biome.delete({
      where: { 
        biome_id: id 
      },
    });
  }
}

module.exports = new BiomeService();
