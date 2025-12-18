const express = require("express");
const router = express.Router();
const creatureDropController = require("../controllers/creatureDropController");

router.post("/", creatureDropController.createDrop);
router.get("/", creatureDropController.getAllDrops);
router.delete("/", creatureDropController.deleteDrop);

module.exports = router;
