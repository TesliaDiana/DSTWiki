const gameCharacterService = require("../services/gameCharacterService");
const asyncHandler = require("../utils/asyncHandler");
const { prisma } = require("../prismaClient");

class GameCharacterController {
  async createCharacter(req, res) {
    const {
      character_name,
      max_health,
      max_hunger,
      max_sanity,
      speed_move,
      strength_attack,
      description,
      startItemIds,
      featureIds,
    } = req.body;

    const newCharacter = await gameCharacterService.createCharacter({
      character_name,
      max_health,
      max_hunger,
      max_sanity,
      speed_move,
      strength_attack,
      description,
      startItemIds,
      featureIds,
    });

    res.status(201).json({
      message: "Персонаж створений", 
      character: newCharacter
    });
  }

  async getAllCharacters(req, res) {
    const data = await gameCharacterService.getAllCharacters();
    res.status(200).json(data);
  };

  async getCharacterById(req, res) {
    const { id } = req.params;
    const character = await gameCharacterService.getCharacterById(id);
    if (!character) { 
      res.status(404); 
      throw new Error("Персонажа не знайдено"); 
    }
    res.status(200).json(character);
  };

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