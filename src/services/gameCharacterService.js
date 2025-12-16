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

    if (!character_name) {
      const err = new Error("Назва персонажа обовʼязкова");
      err.status = 400;
      throw err;
    }

    return await prisma.gameCharacter.create({
      data: {
        character_name,
        max_health,
        max_hunger,
        max_sanity,
        speed_move,
        strength_attack,
        description,

        ...(startItemIds.length > 0 && {
          startitem: {
            create: startItemIds.map((itemId) => ({
              item_id: itemId,
              quantity_of_resources: 1,
            })),
          },
        }),

        ...(featureIds.length > 0 && {
          characterfeature: {
            create: featureIds.map((featureId) => ({
              feature_id: featureId,
            })),
          },
        }),
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
      items: characters,
      stats: {
        totalCharacters: totalCount,
        totalFeaturesLinked: featureUsage,
        totalStartItemsLinked: startItemUsage,
      },
    };
  }

  async getCharacterById(id, prismaOptions = {}) {
    const [
      character,
      featureCount,
      startItemCount,
    ] = await prisma.$transaction([
      prisma.gameCharacter.findUnique({
        where: { character_id: id },
        ...prismaOptions,
      }),
      prisma.characterFeature.count({
        where: { character_id: id },
      }),
      prisma.startItem.count({
        where: { character_id: id },
      }),
    ]);

    if (!character) return null;

    return {
      character,
      stats: {
        features: featureCount,
        startItems: startItemCount,
      },
    };
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
