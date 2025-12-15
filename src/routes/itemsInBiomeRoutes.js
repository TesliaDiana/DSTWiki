const express = require("express");
const router = express.Router();
const itemsInBiomeController = require("../controllers/itemsInBiomeController");

router.post("/", itemsInBiomeController.createRelation);
router.get("/", itemsInBiomeController.getAllRelations);
router.delete("/", itemsInBiomeController.deleteRelation);

module.exports = router;
