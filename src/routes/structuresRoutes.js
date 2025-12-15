const express = require("express");
const router = express.Router();
const structureController = require("../controllers/structuresController");

router.post("/", structureController.createStructure);
router.get("/", structureController.getAllStructures);
router.get("/:id", structureController.getStructureById);
router.patch("/:id", structureController.updateStructure);
router.delete("/:id", structureController.deleteStructure);

module.exports = router;
