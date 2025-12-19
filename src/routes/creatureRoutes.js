const express = require("express");
const router = express.Router();
const creatureController = require("../controllers/creatureController");

router.post("/", creatureController.createCreature);
router.get("/", creatureController.getAllCreatures);
router.get("/:id", creatureController.getCreatureById);
router.patch("/:id", creatureController.updateCreature);
router.get("/:id/drops/count", creatureController.getCreatureDropCount);
router.patch("/:id/soft-delete", creatureController.softDeleteCreature);

module.exports = router;
