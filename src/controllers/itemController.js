const itemService = require("../services/itemService");
const asyncHandler = require("../utils/asyncHandler");
const { prisma } = require("../prismaClient");

class ItemController {
  createItem = asyncHandler(async (req, res) => {
    const { item_name, max_stack, durability, recipe_id, description } = req.body;

    if (!item_name) {
      res.status(400);
      throw new Error("Назва предмету обов'язкова");
    }

    const newItem = await itemService.createItem({
      item_name,
      max_stack,
      durability,
      recipe_id,
      description,
    });

    res.status(201).json({ message: "Предмет створено", item: newItem });
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

  updateItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const updatedItem = await itemService.updateItem(Number(id), data);
    res.json({ message: "Предмет оновлено", item: updatedItem });
  });

  deleteItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await itemService.deleteItem(Number(id));
    res.status(204).end();
  });
}

module.exports = new ItemController();
