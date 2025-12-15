const gameCharacterService = require("../services/gameCharacterService");
const asyncHandler = require("../utils/asyncHandler");

class GameCharacterController {
  createCharacter = asyncHandler(async (req, res) => {
    const { character_name, health, strength, speed } = req.body;
    if (!character_name) { res.status(400); throw new Error("Назва персонажа обов'язкова"); }

    const newCharacter = await gameCharacterService.createCharacter({ character_name, health, strength, speed });
    res.status(201).json({ message: "Персонаж створений", character: newCharacter });
  });

  getAllCharacters = asyncHandler(async (req, res) => {
    const characters = await gameCharacterService.getAllCharacters({
      include: { startItem: { include: { item: true } }, characterFeature: true }
    });
    res.json(characters);
  });

  getCharacterById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const character = await gameCharacterService.getCharacterById(Number(id), {
      include: { startItem: { include: { item: true } }, characterFeature: true }
    });
    if (!character) { res.status(404); throw new Error("Персонажа не знайдено"); }
    res.json(character);
  });

  updateCharacter = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedCharacter = await gameCharacterService.updateCharacter(Number(id), req.body);
    res.json({ message: "Персонаж оновлений", character: updatedCharacter });
  });

    deleteGameCharacter = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await gameCharacterService.deleteGameCharacter(Number(id));
    res.status(204).end();
  });
}

module.exports = new GameCharacterController();
