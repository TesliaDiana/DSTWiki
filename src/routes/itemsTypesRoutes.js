const express = require("express");
const router = express.Router();
const itemTypeController = require("../controllers/itemsTypesController");

router.post("/", itemTypeController.createItemType);
router.get("/", itemTypeController.getAllItemTypes);
router.get("/:id", itemTypeController.getItemTypeById);
router.patch("/:id", itemTypeController.updateItemType);
router.delete("/:id", itemTypeController.deleteItemType);

module.exports = router;
