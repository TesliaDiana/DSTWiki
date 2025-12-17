const featureSkillService = require("../services/featureSkillService");
const asyncHandler = require("../utils/asyncHandler");
const { prisma } = require("../prismaClient");

class FeatureSkillController {
  createFeature = asyncHandler(async (req, res) => {
    const { feature_skill } = req.body;

    if (!feature_skill) {
      res.status(400);
      throw new Error("Назва фічі обов'язкова");
    }

    const newFeature = await featureSkillService.createFeature({ feature_skill });
    res.status(201).json({ message: "Фічу створено", feature: newFeature });
  });

  getAllFeatures = asyncHandler(async (req, res) => {
    const features = await featureSkillService.getAllFeatures();
    res.json(features);
  });

  getFeatureById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const feature = await featureSkillService.getFeatureById(parseInt(id));
    if (!feature) {
      res.status(404);
      throw new Error("Фіча не знайдена");
    }
    res.json(feature);
  });

  updateFeature = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { feature_skill } = req.body;
    const updatedFeature = await featureSkillService.updateFeature(parseInt(id), { feature_skill });
    res.json({ message: "Фічу оновлено", feature: updatedFeature });
  });
  
  deleteFeature = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await featureSkillService.deleteFeature(parseInt(id));
    res.json({ message: "Фічу видалено" });
  });
}

module.exports = new FeatureSkillController();
