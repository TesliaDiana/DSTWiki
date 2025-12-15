const express = require("express");
const router = express.Router();
const itemToItemTypeController = require("../controllers/itemToItemTypeController");

router.post("/", itemToItemTypeController.createRelation);
router.get("/", itemToItemTypeController.getAllRelations);
router.delete("/", itemToItemTypeController.deleteRelation);

module.exports = router;
