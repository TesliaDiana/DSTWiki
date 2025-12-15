const creatureService = require("../services/creatureService");
const asyncHandler = require("../utils/asyncHandler");

class CreatureController {
  createCreature = asyncHandler(async (req, res) => {
    const { creatureName, behaviour, health, speedMove, speedAttack, strengthAttack, description } = req.body;
    if (!creatureName) { res.status(400); throw new Error("Назва істоти обов'язкова"); }

    const newCreature = await creatureService.createCreature({ creatureName, behaviour, health, speedMove, speedAttack, strengthAttack, description });
    res.status(201).json({ message: "Істоту створено", creature: newCreature });
  });

  getAllCreatures = asyncHandler(async (req, res) => {
    const creatures = await creatureService.getAllCreatures({
      include: { creatureDrop: { include: { item: true } }, creatureBiome: true, creatureForSeason: true }
    });
    res.json(creatures);
  });

  getCreatureById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const creature = await creatureService.getCreatureById(Number(id), {
      include: { creatureDrop: { include: { item: true } }, creatureBiome: true, creatureForSeason: true }
    });
    if (!creature) { res.status(404); throw new Error("Істоту не знайдено"); }
    res.json(creature);
  });

  updateCreature = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedCreature = await creatureService.updateCreature(Number(id), req.body);
    res.json({ message: "Істоту оновлено", creature: updatedCreature });
  });

  softDeleteCreature = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await creatureService.softDeleteCreature(Number(id));
    res.status(204).end();
  });
}

module.exports = new CreatureController();
