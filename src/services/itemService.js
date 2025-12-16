const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ItemService {
  async createItem(data) {
    const {
      item_name,
      max_stack,
      durability,
      recipe_id,
      description,
      typeIds = [],
    } = data;

    return prisma.item.create({
      data: {
        item_name,
        max_stack,
        durability,
        recipe_id,
        description,

        ...(typeIds.length > 0 && {
          itemtoitemtype: {
            create: typeIds.map((item_type_id) => ({ item_type_id })),
          },
        }),
      },
      include: {
        itemtoitemtype: { include: { itemstypes: true } },
        itemsinbiome: { include: { biome: true } },
        creaturedrop: { include: { creature: true } },
        startitem: { include: { gamecharacter: true } },
      },
    });
  }

  async getAllItems(prismaOptions = {}) {
    const [items, totalCount, linkedInBiomes, linkedInCreatures, linkedInStartItems] =
      await prisma.$transaction([
        prisma.item.findMany({ orderBy: { item_id: "asc" }, ...prismaOptions }),
        prisma.item.count(),
        prisma.itemsInBiome.count(),
        prisma.creatureDrop.count(),
        prisma.startItem.count(),
      ]);

    return {
      items,
      stats: {
        totalItems: totalCount,
        linkedInBiomes,
        linkedInCreatures,
        linkedInStartItems,
      },
    };
  }

  async getItemById(id, prismaOptions = {}) {
    const [item, biomeCount, creatureCount, startItemCount, typeCount] =
      await prisma.$transaction([
        prisma.item.findUnique({
          where: { item_id: id },
          ...prismaOptions,
        }),
        prisma.itemsInBiome.count({ where: { item_id: id } }),
        prisma.creatureDrop.count({ where: { item_id: id } }),
        prisma.startItem.count({ where: { item_id: id } }),
        prisma.itemToItemType.count({ where: { item_id: id } }),
      ]);

    if (!item) return null;

    return {
      item,
      stats: {
        biomes: biomeCount,
        creatures: creatureCount,
        startItems: startItemCount,
        types: typeCount,
      },
    };
  }

  async updateItem(id, data) {
    const { item_name, max_stack, durability, recipe_id, description, typeIds } = data;

    return prisma.$transaction(async (tx) => {
      const exists = await tx.item.findUnique({ where: { item_id: id } });
      if (!exists) {
        const err = new Error("Предмет не знайдено");
        err.status = 404;
        throw err;
      }

      await tx.item.update({
        where: { item_id: id },
        data: { item_name, max_stack, durability, recipe_id, description },
      });

      if (typeIds) {
        await tx.itemToItemType.deleteMany({ where: { item_id: id } });
        if (typeIds.length > 0) {
          await tx.itemToItemType.createMany({
            data: typeIds.map((item_type_id) => ({ item_id: id, item_type_id })),
          });
        }
      }

      return tx.item.findUnique({
        where: { item_id: id },
        include: {
          itemtoitemtype: { include: { itemstypes: true } },
          itemsinbiome: { include: { biome: true } },
          creaturedrop: { include: { creature: true } },
          startitem: { include: { gamecharacter: true } },
        },
      });
    });
  }

  async deleteItem(id) {
    const [biomes, creatures, startItems] = await prisma.$transaction([
      prisma.itemsInBiome.findMany({ where: { item_id: id }, include: { biome: true } }),
      prisma.creatureDrop.findMany({ where: { item_id: id }, include: { creature: true } }),
      prisma.startItem.findMany({ where: { item_id: id }, include: { gamecharacter: true } }),
    ]);

    if (biomes.length || creatures.length || startItems.length) {
      const error = new Error(
        `Неможливо видалити предмет.
Біоми: ${biomes.map(b => b.biome.biome_name).join(", ") || "—"}
Сутності (creatures): ${creatures.map(c => c.creature.creature_name).join(", ") || "—"}
Стартові предмети персонажів: ${startItems.map(s => s.gamecharacter.character_name).join(", ") || "—"}`
      );
      error.status = 409;
      throw error;
    }

    return prisma.item.delete({ where: { item_id: id } });
  }
}

module.exports = new ItemService();
