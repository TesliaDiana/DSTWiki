const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ItemTypeService {
  async createItemType(data) {
    const { item_type_name } = data;
    if (!item_type_name) throw new Error("Назва типу предмету обов'язкова");
    return await prisma.itemsTypes.create({
      data: { 
        item_type_name 
      },
    });
  }

  async getAllItemTypes() {
    const [types, totalCount] = await prisma.$transaction([
      prisma.itemsTypes.findMany({ 
        orderBy: { 
          item_type_id: "asc" 
        }, 
        include: { 
          itemtoitemtype: { 
            include: { 
              item: true 
            } 
          } 
        }
      }),
      prisma.itemsTypes.count(),
    ]);
    return {
      items: types,
      stats: { 
        total: totalCount 
      },
    };
  }

  async getItemTypeById(id) {
    const itemTypeId = Number(id);
    const [type, linkedItemsCount] = await prisma.$transaction([
      prisma.itemsTypes.findUnique({ 
        where: { 
          item_type_id: itemTypeId 
        }, 
        include: { 
          itemtoitemtype: { 
            include: { 
              item: true 
            } 
          } 
        } 
      }),
      prisma.itemToItemType.count({ 
        where: { 
          item_type_id: itemTypeId 
        } 
      }),
    ]);
    if (!type) return null;
    return {
      type,
      stats: { 
        linkedItems: linkedItemsCount 
      },
    };
  }

  async updateItemType(id, data) {
    const itemTypeId = Number(id);
    const { 
      item_type_name 
    } = data;
    return await prisma.itemsTypes.update({
      where: { 
        item_type_id: itemTypeId 
      },
      data: { 
        item_type_name 
      },
    });
  }

  async deleteItemType(id) {
    const itemTypeId = Number(id);
    const linkedItems = await prisma.itemToItemType.findMany({
      where: { 
        item_type_id: itemTypeId 
      },
      include: { 
        item: true 
      },
    });
    if (linkedItems.length > 0) {
      const error = new Error(
        `Неможливо видалити тип предмету. Пов’язані предмети: ${linkedItems.map(i => i.item.item_name).join(", ") || "—"}`
      );
      error.status = 409;
      throw error;
    }
    return prisma.itemsTypes.delete({ 
      where: { 
        item_type_id: itemTypeId 
      } 
    });
  }
}

module.exports = new ItemTypeService();
