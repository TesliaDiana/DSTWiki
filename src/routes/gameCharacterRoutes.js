const express = require("express");
const router = express.Router();
const gameCharacterController = require("../controllers/gameCharacterController");

router.post("/", gameCharacterController.createCharacter);
router.get("/", gameCharacterController.getAllCharacters);
router.get("/:id", gameCharacterController.getCharacterById);
router.patch("/:id", gameCharacterController.updateCharacter);
router.delete("/:id", gameCharacterController.deleteGameCharacter);

module.exports = router;
