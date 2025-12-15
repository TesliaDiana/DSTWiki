const express = require("express");
const router = express.Router();
const seasonController = require("../controllers/seasonsController");

router.post("/", seasonController.createSeason);
router.get("/", seasonController.getAllSeasons);
router.get("/:id", seasonController.getSeasonById);
router.patch("/:id", seasonController.updateSeason);
router.delete("/:id", seasonController.deleteSeason);

module.exports = router;
