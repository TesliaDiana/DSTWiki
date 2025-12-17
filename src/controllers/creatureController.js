const asyncHandler = require("../utils/asyncHandler");
const creatureService = require("../services/creatureService");

class CreatureController {
  async createCreature(req, res) {
    const { 
      creatureName, 
      behaviour, 
      health, 
      speedMove, 
      speedAttack, 
      strengthAttack, 
      description, 
      biomes,
      drops
    } = req.body;

    if (!creatureName) {
      res.status(400);
      throw new Error("Назва істоти обов'язкова");
    }

    const newCreature = await creatureService.createCreature({
      creatureName,
      behaviour,
      health,
      speedMove,
      speedAttack,
      strengthAttack,
      description,
      biomes,
      drops
    });

    res.status(201).json({
      message: "Істоту створено", 
      creature: newCreature 
    });
  }

  async updateCreature(req, res) {
    const { id } = req.params;
    const data = req.body;
    const updatedCreature = await creatureService.updateCreature(id, data);
    res.status(200).json(updatedCreature);
  }

  async getAllCreatures(req, res) {
    const data = await creatureService.getAllCreatures();
    res.status(200).json(data);
  }

  async getCreatureById(req, res) {
    const id = Number(req.params.id);
    const creature = await creatureService.getCreatureById(id);
    res.status(200).json(creature);
  }

  async softDeleteCreature(req, res) {
    const { id } = req.params;
    const deletedCreature = await creatureService.softDeleteCreature(id);
    res.status(200).json({ 
      message: "Істоту видалено (soft delete)", 
      creature: deletedCreature 
    });
  }
}

module.exports = new CreatureController();
