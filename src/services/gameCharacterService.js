const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class GameCharacterService {
  async createCharacter(data) {
    const {
      character_name,
      max_health,
      max_hunger,
      max_sanity,
      speed_move,
      strength_attack,
      description,
      startItemIds = [],
      featureIds = [],
    } = data;
    if (!character_name) throw new Error("Назва події обов'язкова");

    return await prisma.gameCharacter.create({
      data: {
        character_name,
        max_health,
        max_hunger,
        max_sanity,
        speed_move,
        strength_attack,
        description,
        startitem: {
          create: startItemIds.map(id => ({
            item_id: Number(id),
            quantity_of_resources: 1,
          }))
        },
        characterfeature: {
          create: featureIds.map(id => ({
            feature_id: Number(id)
          }))
        },
      },
      include: {
        startitem: {
          include: { item: true },
        },
        characterfeature: {
          include: { featureskill: true },
        },
      },
    });
  }

  async getAllCharacters(prismaOptions = {}) {
    const [
      characters,
      totalCount,
      featureUsage,
      startItemUsage,
    ] = await prisma.$transaction([
      prisma.gameCharacter.findMany({
        orderBy: { character_id: "asc" },
        ...prismaOptions,
      }),
      prisma.gameCharacter.count(),
      prisma.characterFeature.count(),
      prisma.startItem.count(),
    ]);

    return {
      characters,
      stats: {
        totalCharacters: totalCount,
        totalFeaturesLinked: featureUsage,
        totalStartItemsLinked: startItemUsage,
      },
    };
  }

  async getCharacterById(id) {
    const characterId = Number(id);
    const character = await prisma.gameCharacter.findUnique({
      where: { 
        character_id: characterId 
      },
      include: {
        characterfeature: { 
          include: { 
            featureskill: true 
          } 
        },
        startitem: { 
          include: { 
            item: true 
          } 
        },
      },
    });
    if (!character) return null;
    return character;
  }

  async updateCharacter(id, data) {
    const {
      character_name,
      max_health,
      max_hunger,
      max_sanity,
      speed_move,
      strength_attack,
      description,
      startItemIds,
      featureIds,
    } = data;

    return await prisma.$transaction(async (tx) => {
      const exists = await tx.gameCharacter.findUnique({
        where: { character_id: id },
      });

      if (!exists) {
        const err = new Error("Персонажа не знайдено");
        err.status = 404;
        throw err;
      }

      await tx.gameCharacter.update({
        where: { character_id: id },
        data: {
          character_name,
          max_health,
          max_hunger,
          max_sanity,
          speed_move,
          strength_attack,
          description,
        },
      });

      if (startItemIds) {
        await tx.startItem.deleteMany({
          where: { character_id: id },
        });

        if (startItemIds.length > 0) {
          await tx.startItem.createMany({
            data: startItemIds.map((itemId) => ({
              character_id: id,
              item_id: itemId,
              quantity_of_resources: 1,
            })),
          });
        }
      }

      if (featureIds) {
        await tx.characterFeature.deleteMany({
          where: { character_id: id },
        });

        if (featureIds.length > 0) {
          await tx.characterFeature.createMany({
            data: featureIds.map((featureId) => ({
              character_id: id,
              feature_id: featureId,
            })),
          });
        }
      }

      return tx.gameCharacter.findUnique({
        where: { character_id: id },
        include: {
          startitem: {
            include: { item: true },
          },
          characterfeature: {
            include: { featureskill: true },
          },
        },
      });
    });
  }

  async deleteGameCharacter(id) {
    const exists = await prisma.gameCharacter.findUnique({
      where: { character_id: id },
    });

    if (!exists) {
      const err = new Error("Персонажа не знайдено");
      err.status = 404;
      throw err;
    }

    const [features, startItems] = await prisma.$transaction([
      prisma.characterFeature.findMany({
        where: { character_id: id },
        include: { featureskill: true },
      }),
      prisma.startItem.findMany({
        where: { character_id: id },
        include: { item: true },
      }),
    ]);

    if (features.length > 0 || startItems.length > 0) {
      const error = new Error(
        `Неможливо видалити персонажа.
Фічі: ${features.map(f => f.featureskill.feature_skill).join(", ") || "—"}
Стартові предмети: ${startItems.map(i => i.item.item_name).join(", ") || "—"}`
      );
      error.status = 409;
      throw error;
    }

    return prisma.gameCharacter.delete({
      where: { character_id: id },
    });
  }
}

module.exports = new GameCharacterService();
