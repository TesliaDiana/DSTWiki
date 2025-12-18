const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class FeatureSkillService {
  async createFeature(data) {
    const { feature_skill } = data;
    if (!feature_skill) throw new Error("Назва фічі обов'язкова");
    return await prisma.featureSkill.create({
      data: { 
        feature_skill 
      },
    });
  }

  async getAllFeatures() {
    const [features, totalCount] = await prisma.$transaction([
      prisma.featureSkill.findMany({
        orderBy: { 
          feature_id: "asc" 
        },
      }),
      prisma.featureSkill.count(),
    ]);
    return {
      items: features,
      stats: { 
        total: totalCount 
      },
    };
  }

  async getFeatureById(id) {
    const featureId = Number(id);
    const feature = await prisma.featureSkill.findUnique({
      where: { 
        feature_id: featureId 
      },
    });
    if (!feature) return null;
    return feature;
  }

  async updateFeature(id, data) {
    const featureId = Number(id);
    const { 
      feature_skill 
    } = data;
    return await prisma.featureSkill.update({
      where: { 
        feature_id: featureId 
      },
      data: { 
        feature_skill 
      },
    });
  }

  async deleteFeature(id) {
    const featureId = Number(id);
    const feature = await prisma.featureSkill.findUnique({
      where: { 
        feature_id: featureId 
      },
    });
    if (!feature) {
      const error = new Error("Фічу не знайдено");
      error.status = 404;
      throw error;
    }
    const usedInCharacters = await prisma.characterFeature.findMany({
      where: {
        feature_id: featureId 
      },
      include: {
        gamecharacter: true,
      },
    });

    if (usedInCharacters.length > 0) {
      const error = new Error(
        `Неможливо видалити фічу.
  Використовується персонажами: ${
          usedInCharacters
            .map(cf => cf.gamecharacter.character_name)
            .join(", ")
        }`
      );
      error.status = 409;
      throw error;
    }
    return prisma.featureSkill.delete({
      where: { 
        feature_id: featureId 
      },
    });
  }
}

module.exports = new FeatureSkillService();
