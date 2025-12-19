const itemService = require("../services/itemService");
const asyncHandler = require("../utils/asyncHandler");
const { prisma } = require("../prismaClient");

class ItemController {
  createItem = asyncHandler(async (req, res) => {
    const { 
      item_name, 
      max_stack, 
      durability, 
      recipe_id, 
      description, 
      typeIds,
      biomeIds,
    } = req.body;
    const newItem = await itemService.createItem({
      item_name,
      max_stack,
      durability,
      recipe_id,
      description,
      typeIds,
      biomeIds,
    });

    res.status(201).json({ message: "Предмет створено", newItem });
  });

  getAllItems = asyncHandler(async (req, res) => {
    const items = await itemService.getAllItems();
    res.json(items);
  });

  getItemById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await itemService.getItemById(Number(id));
    if (!item) {
      res.status(404);
      throw new Error("Предмет не знайдено");
    }
    res.json(item);
  });

  async getItemsCountInBiome(req, res) {
    const { biomeId } = req.params;
    try {
      const result = await itemService.countItemsInBiome(biomeId);
      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  updateItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedItem = await itemService.updateItem(id, req.body);
    res.json({ message: "Предмет оновлено", item: updatedItem });
  });

  deleteItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await itemService.deleteItem(Number(id));
    res.status(204).end();
  });
}

module.exports = new ItemController();
