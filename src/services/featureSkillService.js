const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class FeatureSkillService {
  async createFeature(data) {
    const { feature_skill } = data;

    return await prisma.featureSkill.create({
      data: {
        feature_skill,
      },
    });
  }

  async getAllFeatures() {
    const [features, totalCount] = await prisma.$transaction([
      prisma.featureSkill.findMany({
        orderBy: { id: "asc" },
      }),
      prisma.featureSkill.count(),
    ]);

    return {
      items: features,
      stats: {
        total: totalCount,
      },
    };
  }

  async getFeatureById(id) {
    const [
      feature,
      usageCount,
    ] = await prisma.$transaction([
      prisma.featureSkill.findUnique({
        where: { feature_id: id },
      }),
      prisma.characterFeature.count({
        where: { feature_id: id },
      }),
    ]);

    if (!feature) return null;

    return {
      feature,
      stats: {
        usedByCharacters: usageCount,
      },
    };
  }

  async updateFeature(id, data) {
    const { feature_skill } = data;

    return await prisma.featureSkill.update({
      where: { feature_id: id },
      data: {
        feature_skill,
      },
    });
  }

  async deleteFeature(id) {
    const usage = await prisma.characterFeature.findMany({
      where: { feature_id: id },
      include: { character: true },
    });

    if (usage.length > 0) {
      const error = new Error(
        `Неможливо видалити фічу.
Використовується персонажами: ${usage
          .map((u) => u.character.name)
          .join(", ")}`
      );
      error.status = 409;
      throw error;
    }

    return await prisma.featureSkill.delete({
      where: { feature_id: id },
    });
  }
}

module.exports = new FeatureSkillService();
