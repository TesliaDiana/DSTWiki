const itemToItemTypeService = require("../services/itemToItemTypeService");
const asyncHandler = require("../utils/asyncHandler");

class ItemToItemTypeController {
  createRelation = asyncHandler(async (req, res) => {
    const { item_id, item_type_id } = req.body;
    if (!item_id || !item_type_id) { res.status(400); throw new Error("item_id та item_type_id обов'язкові"); }

    const relation = await itemToItemTypeService.createRelation({ item_id, item_type_id });
    res.status(201).json({ message: "Зв'язок створено", itemToItemType: relation });
  });

  getAllRelations = asyncHandler(async (req, res) => {
    const relations = await itemToItemTypeService.getAllRelations({ include: { item: true, itemType: true } });
    res.json(relations);
  });

  deleteRelation = asyncHandler(async (req, res) => {
    const { item_id, item_type_id } = req.body;
    await itemToItemTypeService.deleteRelation(item_id, item_type_id);
    res.status(204).end();
  });
}

module.exports = new ItemToItemTypeController();
