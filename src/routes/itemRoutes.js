const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

router.post("/", itemController.createItem);
router.get("/", itemController.getAllItems);
router.get("/:id", itemController.getItemById);
router.get("/biome/:biomeId/count", itemController.getItemsCountInBiome);
router.patch("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

module.exports = router;
