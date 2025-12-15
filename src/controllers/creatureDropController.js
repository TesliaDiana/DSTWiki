const creatureDropService = require("../services/creatureDropService");
const asyncHandler = require("../utils/asyncHandler");

class CreatureDropController {
  createDrop = asyncHandler(async (req, res) => {
    const { creature_id, item_id, drop_chance } = req.body;
    if (!creature_id || !item_id || drop_chance == null) { res.status(400); throw new Error("creature_id, item_id та drop_chance обов'язкові"); }

    const drop = await creatureDropService.createDrop({ creature_id, item_id, drop_chance });
    res.status(201).json({ message: "Дроп створено", creatureDrop: drop });
  });

  getAllDrops = asyncHandler(async (req, res) => {
    const drops = await creatureDropService.getAllDrops({ include: { item: true, creature: true } });
    res.json(drops);
  });

  deleteDrop = asyncHandler(async (req, res) => {
    const { creature_id, item_id } = req.body;
    await creatureDropService.deleteDrop(creature_id, item_id);
    res.status(204).end();
  });
}

module.exports = new CreatureDropController();
