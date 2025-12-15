const itemTypeService = require("../services/itemTypeService");
const asyncHandler = require("../utils/asyncHandler");

class ItemTypeController {
  createItemType = asyncHandler(async (req, res) => {
    const { item_type_name } = req.body;
    if (!item_type_name) { res.status(400); throw new Error("Назва типу предмету обов'язкова!"); }

    const newType = await itemTypeService.createItemType({ item_type_name });
    res.status(201).json({ message: "Тип предмету створено!", itemType: newType });
  });

  getAllItemTypes = asyncHandler(async (req, res) => {
    const types = await itemTypeService.getAllItemTypes({ include: { itemToItemType: { include: { item: true } } } });
    res.json(types);
  });

  getItemTypeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const type = await itemTypeService.getItemTypeById(Number(id), { include: { itemToItemType: { include: { item: true } } } });
    if (!type) { res.status(404); throw new Error("Тип предмету не знайдено"); }
    res.json(type);
  });

  updateItemType = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedType = await itemTypeService.updateItemType(Number(id), req.body);
    res.json({ message: "Тип предмету оновлено", itemType: updatedType });
  });

  deleteItemType = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await itemTypeService.deleteItemType(Number(id));
    res.status(204).end();
  });
}

module.exports = new ItemTypeController();
