const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ItemToItemTypeService {
  async createRelation(data) {
    const { item_id, item_type_id } = data;
    return await prisma.itemToItemType.create({
      data: { item_id, item_type_id },
      include: { item: true, itemstypes: true },
    });
  }

  async getAllRelations(prismaOptions = {}) {
    return await prisma.itemToItemType.findMany({
      orderBy: { item_id: "asc" },
      ...prismaOptions,
    });
  }

  async deleteRelation(item_id, item_type_id) {
    return await prisma.itemToItemType.delete({
      where: { item_id_item_type_id: { item_id, item_type_id } },
    });
  }
}

module.exports = new ItemToItemTypeService();
