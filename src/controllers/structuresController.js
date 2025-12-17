const structureService = require("../services/structuresService");
const asyncHandler = require("../utils/asyncHandler");
const { prisma } = require("../prismaClient");

class StructureController {
  createStructure = asyncHandler(async (req, res) => {
    const { structure_name, description } = req.body;
    if (!structure_name) { res.status(400); throw new Error("Назва структури обов'язкова"); }

    const newStructure = await structureService.createStructure({ structure_name, description });
    res.status(201).json({ message: "Структуру створено", structure: newStructure });
  });

  getAllStructures = asyncHandler(async (req, res) => {
    const structures = await structureService.getAllStructures({ include: { biomeStructure: { include: { biome: true } }, structureCreature: { include: { creature: true } }, structureEvent: { include: { event: true } } } });
    res.json(structures);
  });

  getStructureById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const structure = await structureService.getStructureById(Number(id), { include: { biomeStructure: { include: { biome: true } }, structureCreature: { include: { creature: true } }, structureEvent: { include: { event: true } } } });
    if (!structure) { res.status(404); throw new Error("Структуру не знайдено"); }
    res.json(structure);
  });

  updateStructure = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedStructure = await structureService.updateStructure(Number(id), req.body);
    res.json({ message: "Структуру оновлено", structure: updatedStructure });
  });

  deleteStructure = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await structureService.deleteStructure(Number(id));
    res.status(204).end();
  });
}

module.exports = new StructureController();
