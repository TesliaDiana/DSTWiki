const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ItemsInBiomeService {
  async createRelation(data) {
    const { item_id, biome_id } = data;
    return await prisma.itemsInBiome.create({
      data: { item_id, biome_id },
      include: { item: true, biome: true },
    });
  }

  async getAllRelations(prismaOptions = {}) {
    return await prisma.itemsInBiome.findMany({
      orderBy: { biome_id: "asc" },
      ...prismaOptions,
    });
  }

  async deleteRelation(item_id, biome_id) {
    return await prisma.itemsInBiome.delete({
      where: { biome_id_item_id: { biome_id, item_id } },
    });
  }
}

module.exports = new ItemsInBiomeService();
