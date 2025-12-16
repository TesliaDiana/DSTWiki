const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ItemTypeService {
  async createItemType(data) {
    const { item_type_name } = data;
    return await prisma.itemsTypes.create({
      data: { item_type_name },
      include: {
        itemToItemType: { include: { item: true } },
      },
    });
  }

  async getAllItemTypes(prismaOptions = {}) {
    const [types, totalCount, totalItemsLinked] = await prisma.$transaction([
      prisma.itemsTypes.findMany({ orderBy: { item_type_id: "asc" }, ...prismaOptions }),
      prisma.itemsTypes.count(),
      prisma.itemToItemType.count(),
    ]);

    return {
      items: types,
      stats: {
        totalTypes: totalCount,
        totalItemsLinked,
      },
    };
  }

  async getItemTypeById(id, prismaOptions = {}) {
    const [type, linkedItems] = await prisma.$transaction([
      prisma.itemsTypes.findUnique({ where: { item_type_id: id }, ...prismaOptions }),
      prisma.itemToItemType.count({ where: { item_type_id: id } }),
    ]);

    if (!type) return null;

    return {
      type,
      stats: {
        linkedItems,
      },
    };
  }

  async updateItemType(id, data) {
    const { item_type_name } = data;
    return await prisma.itemsTypes.update({
      where: { item_type_id: id },
      data: { item_type_name },
      include: { itemToItemType: { include: { item: true } } },
    });
  }

  async deleteItemType(id) {
    const linkedItems = await prisma.itemToItemType.findMany({
      where: { item_type_id: id },
      include: { item: true },
    });

    if (linkedItems.length > 0) {
      const error = new Error(
        `Неможливо видалити тип предмету. Пов’язані предмети: ${linkedItems.map(i => i.item.item_name).join(", ") || "—"}`
      );
      error.status = 409;
      throw error;
    }

    return await prisma.itemsTypes.delete({ where: { item_type_id: id } });
  }
}

module.exports = new ItemTypeService();
