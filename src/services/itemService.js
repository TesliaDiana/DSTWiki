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
      biomeIds = [],
    } = data;
    if (!item_name) throw new Error("Назва предмета обов'язкова");
    return await prisma.item.create({
      data: {
        item_name,
        max_stack,
        durability,
        recipe_id,
        description,
        itemtoitemtype: {
          create: typeIds.map(id => ({
            item_type_id: Number(id)
          }))
        },
        itemsinbiome: {
          create: biomeIds.map(id => ({
            biome_id: Number(id)
          }))
        },
      },
      include: {
        itemtoitemtype: { 
          include: { 
            itemstypes: true 
          } 
        },
        itemsinbiome: { 
          include: { 
            biome: true 
          } 
        },
      },
    });
  }

  async getAllItems(prismaOptions = {}) {
    const [
      items, 
      totalCount, 
      linkedInBiomes, 
      linkedInCreatures, 
      linkedInStartItems,
      linkedToType,
    ] = await prisma.$transaction([
        prisma.item.findMany({ 
          orderBy: { 
            item_id: "asc" 
          }, 
          ...prismaOptions 
        }),
        prisma.item.count(),
        prisma.itemsInBiome.count(),
        prisma.creatureDrop.count(),
        prisma.startItem.count(),
        prisma.itemToItemType.count(),
      ]);
    return {
      items,
      stats: {
        totalItems: totalCount,
        linkedInBiomes,
        linkedInCreatures,
        linkedInStartItems,
        linkedToType,
      },
    };
  }

  async getItemById(id, prismaOptions = {}) {
    const [
      item, 
      biomeCount, 
      creatureCount, 
      startItemCount, 
      typeCount
    ] = await prisma.$transaction([
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

  async countItemsInBiome(biomeId) {
    const count = await prisma.itemsInBiome.count({
      where: { biome_id: Number(biomeId) }
    });
    return { biomeId: Number(biomeId), itemCount: count };
  }
  
  async updateItem(id, data) {
    const itemId = Number(id);
    const { 
      item_name, 
      max_stack, 
      durability, 
      recipe_id, 
      description, 
      typeIds,
      biomeIds,
    } = data;
    const updateData = {
      ...(item_name !== undefined && { item_name }),
      ...(max_stack !== undefined && { max_stack }),
      ...(durability !== undefined && { durability }),
      ...(description !== undefined && { description }),
      ...(recipe_id !== undefined && { recipe_id }),
    };
    return prisma.$transaction(async (tx) => {
      const exists = await tx.item.findUnique({ where: { item_id: itemId } });
      if (!exists) {
        const err = new Error("Предмет не знайдено");
        err.status = 404;
        throw err;
      }
      await tx.item.update({
        where: { item_id: itemId },
        data: updateData
      });
      if (typeIds) {
        await tx.itemToItemType.deleteMany({ where: { item_id: itemId } });
        if (typeIds.length > 0) {
          await tx.itemToItemType.createMany({
            data: typeIds.map((item_type_id) => ({ 
              item_id: itemId, 
              item_type_id 
            })),
          });
        }
      }
      if (Array.isArray(biomeIds)) {
        await tx.itemsInBiome.deleteMany({ 
          where: { 
            item_id: itemId 
          } 
        });
        if (biomeIds.length > 0) {
          await tx.itemsInBiome.createMany({
            data: biomeIds.map(biomeId  => ({ 
              item_id: itemId, 
              biome_id: Number(biomeId) 
            })),
          });
        }
      }
      return tx.item.findUnique({
        where: { item_id: itemId },
        include: {
          itemtoitemtype: { include: { itemstypes: true } },
          itemsinbiome: { include: { biome: true } },
        },
      });
    });
  }

  async deleteItem(id) {
    const [biomes, creatures, startItems] = await prisma.$transaction([
      prisma.itemsInBiome.findMany({ 
        where: { item_id: id }, 
        include: { biome: true } 
      }),
      prisma.creatureDrop.findMany({ 
        where: { item_id: id }, 
        include: { creature: true } 
      }),
      prisma.startItem.findMany({ 
        where: { item_id: id }, 
        include: { gamecharacter: true } 
      }),
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
