const express = require("express");
const router = express.Router();
const biomeController = require("../controllers/biomeController");

router.post("/", biomeController.createBiome);
router.get("/", biomeController.getAllBiomes);
router.get("/:id", biomeController.getBiomeById);
router.patch("/:id", biomeController.updateBiome);
router.delete("/:id", biomeController.deleteBiome);

module.exports = router;
