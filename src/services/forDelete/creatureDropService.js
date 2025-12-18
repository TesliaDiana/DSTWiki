const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CreatureDropService {
  async createDrop(data) {
    const { creature_id, item_id, drop_chance, quantity_of_resources = 1 } = data;
    return await prisma.creatureDrop.create({
      data: {
        creature_id,
        item_id,
        drop_chance,
        quantity_of_resources,
      },
      include: {
        creature: true,
        item: true,
      },
    });
  }

  async getAllDrops(prismaOptions = {}) {
    return await prisma.creatureDrop.findMany({
      orderBy: { creature_id: "asc" },
      ...prismaOptions,
    });
  }

  async deleteDrop(creature_id, item_id) {
    return await prisma.creatureDrop.delete({
      where: {
        creature_id_item_id: { creature_id, item_id },
      },
    });
  }
}

module.exports = new CreatureDropService();
