const creatureService = require("../services/creatureService");
const asyncHandler = require("../utils/asyncHandler");

class CreatureController {
  createCreature = asyncHandler(async (req, res) => {
    const { creature, drops } = req.body;

    if (!creature?.creature_name) {
      res.status(400);
      throw new Error("Назва істоти обовʼязкова");
    }

    const result = await creatureService.createCreatureWithDrops(
      creature,
      drops
    );

    res.status(201).json({
      message: "Істоту створено",
      creature: result,
    });
  });

  deleteCreature = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    await creatureService.softDeleteCreature(id);

    res.json({ message: "Істоту видалено (soft delete)" });
  });
}

module.exports = new CreatureController();
