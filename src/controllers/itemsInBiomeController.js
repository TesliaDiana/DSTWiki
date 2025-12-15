const itemsInBiomeService = require("../services/itemsInBiomeService");
const asyncHandler = require("../utils/asyncHandler");

class ItemsInBiomeController {
  createRelation = asyncHandler(async (req, res) => {
    const { item_id, biome_id } = req.body;
    if (!item_id || !biome_id) { res.status(400); throw new Error("item_id та biome_id обов'язкові"); }

    const relation = await itemsInBiomeService.createRelation({ item_id, biome_id });
    res.status(201).json({ message: "Зв'язок створено", itemsInBiome: relation });
  });

  getAllRelations = asyncHandler(async (req, res) => {
    const relations = await itemsInBiomeService.getAllRelations({ include: { item: true, biome: true } });
    res.json(relations);
  });

  deleteRelation = asyncHandler(async (req, res) => {
    const { item_id, biome_id } = req.body;
    await itemsInBiomeService.deleteRelation(item_id, biome_id);
    res.status(204).end();
  });
}

module.exports = new ItemsInBiomeController();
