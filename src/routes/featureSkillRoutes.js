const express = require("express");
const router = express.Router();
const featureSkillController = require("../controllers/featureSkillController");

router.post("/", featureSkillController.createFeature);
router.get("/", featureSkillController.getAllFeatures);
router.get("/:id", featureSkillController.getFeatureById);
router.patch("/:id", featureSkillController.updateFeature);
router.delete("/:id", featureSkillController.deleteFeature);

module.exports = router;
