const structureService = require("../services/structuresService");
const asyncHandler = require("../utils/asyncHandler");
const { prisma } = require("../prismaClient");

class StructureController {
  createStructure = asyncHandler(async (req, res) => {
    const {
      structureName,
      structureType,
      description,
      biomeIds = [],
      creatures = []
    } = req.body;
    if (!structureName) {
      res.status(400);
      throw new Error("Назва структури обов'язкова");
    }
    const newStructure = await structureService.createStructure({
      structureName,
      structureType,
      description,
      biomeIds,
      creatures
    });
    res.status(201).json({ 
      message: "Структуру створено", 
      structure: newStructure 
    });
  });

  getAllStructures = asyncHandler(async (req, res) => {
    const structures = await structureService.getAllStructures({ 
      include: { 
        biomeStructure: { 
          include: { 
            biome: true 
          } 
        }, 
        structureCreature: { 
          include: { 
            creature: true 
          } 
        }, 
        structureEvent: { 
          include: { 
            event: true 
          } 
        } 
      } 
    });
    res.json(structures);
  });

  getStructureById = asyncHandler(async (req, res) => {
    const { 
      id 
    } = req.params;
    const structure = await structureService.getStructureById(Number(id), { 
      include: { 
        biomeStructure: { 
          include: { 
            biome: true 
          } 
        }, 
        structureCreature: { 
          include: { 
            creature: true 
          } 
        }, 
        structureEvent: { 
          include: { 
            event: true 
          } 
        } 
      } 
    });
    if (!structure) { 
      res.status(404); throw new Error("Структуру не знайдено"); 
    }
    res.json(structure);
  });

  updateStructure = asyncHandler(async (req, res) => {
    const { 
      id
    } = req.params;

    const {
      structure_name,
      structure_type,
      description,
      biomestructure,
      structurecreature
    } = req.body;

    const updatedStructure = await structureService.updateStructure(
      Number(id),
      {
        structureName: structure_name,
        structureType: structure_type,
        description,
        biomeIds: biomestructure,

        creatures: Array.isArray(structurecreature)
          ? structurecreature.map(c =>
              typeof c === "number"
                ? { 
                  creatureId: c, 
                  quantity: 1 
                }
                : {
                    creatureId: c.creature_id,
                    quantity: c.quantity_of_creatures ?? 1,
                  }
            )
          : undefined,
      }
    );

    res.json({
      message: "Структуру оновлено",
      structure: updatedStructure,
    });
  });

  deleteStructure = asyncHandler(async (req, res) => {
    const { 
      id 
    } = req.params;
    await structureService.deleteStructure(Number(id));
    res.status(204).end();
  });
}

module.exports = new StructureController();
