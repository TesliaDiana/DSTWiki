const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class BiomeService {
  async createBiome(data) {
    const {
      biome_name,
      biome_location,
      spread,
      description,
      itemIds = [],
      structureIds = [],
    } = data;

    return prisma.biome.create({
      data: {
        biome_name,
        biome_location,
        spread,
        description,

        ...(itemIds.length > 0 && {
          itemsinbiome: {
            create: itemIds.map((item_id) => ({
              item_id,
            })),
          },
        }),

        ...(structureIds.length > 0 && {
          biomestructure: {
            create: structureIds.map((structure_id) => ({
              structure_id,
            })),
          },
        }),
      },
      include: {
        itemsinbiome: { include: { item: true } },
        biomestructure: { include: { structures: true } },
      },
    });
  }

  async getAllBiomes(prismaOptions = {}) {
    const [biomes, countsByLocation] = await prisma.$transaction([
      prisma.biome.findMany({
        orderBy: { biome_id: "asc" },
        ...prismaOptions,
      }),
      prisma.biome.groupBy({
        by: ["biome_location"],
        _count: { _all: true },
      }),
    ]);

    const stats = countsByLocation.reduce((acc, row) => {
      acc[row.biome_location] = row._count._all;
      return acc;
    }, {});

    stats.total = Object.values(stats).reduce((a, b) => a + b, 0);

    return {
      items: biomes,
      stats,
    };
  }

  async getBiomeById(id, prismaOptions = {}) {
    const [biome, itemsCount, structuresCount] =
      await prisma.$transaction([
        prisma.biome.findUnique({
          where: { biome_id: id },
          ...prismaOptions,
        }),
        prisma.itemsInBiome.count({
          where: { biome_id: id },
        }),
        prisma.biomeStructure.count({
          where: { biome_id: id },
        }),
      ]);

    if (!biome) return null;

    return {
      biome,
      stats: {
        items: itemsCount,
        structures: structuresCount,
      },
    };
  }

  async updateBiome(id, data) {
    const {
      biome_name,
      biome_location,
      spread,
      description,
      itemIds,
      structureIds,
    } = data;

    return prisma.$transaction(async (tx) => {
      const exists = await tx.biome.findUnique({
        where: { biome_id: id },
      });

      if (!exists) {
        const err = new Error("Біом не знайдено");
        err.status = 404;
        throw err;
      }

      await tx.biome.update({
        where: { biome_id: id },
        data: {
          biome_name,
          biome_location,
          spread,
          description,
        },
      });

      if (itemIds) {
        await tx.itemsInBiome.deleteMany({
          where: { biome_id: id },
        });

        if (itemIds.length > 0) {
          await tx.itemsInBiome.createMany({
            data: itemIds.map((item_id) => ({
              biome_id: id,
              item_id,
            })),
          });
        }
      }

      if (structureIds) {
        await tx.biomeStructure.deleteMany({
          where: { biome_id: id },
        });

        if (structureIds.length > 0) {
          await tx.biomeStructure.createMany({
            data: structureIds.map((structure_id) => ({
              biome_id: id,
              structure_id,
            })),
          });
        }
      }

      return tx.biome.findUnique({
        where: { biome_id: id },
        include: {
          itemsinbiome: { include: { item: true } },
          biomestructure: { include: { structures: true } },
        },
      });
    });
  }

  async deleteBiome(id) {
    const [items, structures] = await prisma.$transaction([
      prisma.itemsInBiome.findMany({
        where: { biome_id: id },
        include: { item: true },
      }),
      prisma.biomeStructure.findMany({
        where: { biome_id: id },
        include: { structures: true },
      }),
    ]);

    if (items.length > 0 || structures.length > 0) {
      const error = new Error(
        `Неможливо видалити біом.
Items: ${items.map(i => i.item.item_name).join(", ") || "—"}
Structures: ${structures.map(s => s.structures.structure_name).join(", ") || "—"}`
      );
      error.status = 409;
      throw error;
    }

    return prisma.biome.delete({
      where: { biome_id: id },
    });
  }
}

module.exports = new BiomeService();
