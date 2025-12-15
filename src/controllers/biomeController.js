const biomeService = require("../services/biomeService");
const asyncHandler = require("../utils/asyncHandler");

class BiomeController {
  createBiome = asyncHandler(async (req, res) => {
    const { biomeName, biomeLocation, spread, description } = req.body;
    if (!biomeName) { res.status(400); throw new Error("Назва біому обов'язкова"); }

    const newBiome = await biomeService.createBiome({ biomeName, biomeLocation, spread, description });
    res.status(201).json({ message: "Біом створено", biome: newBiome });
  });

  getAllBiomes = asyncHandler(async (req, res) => {
    const biomes = await biomeService.getAllBiomes({ include: { itemsInBiome: { include: { item: true } }, biomeStructure: { include: { structure: true } } } });
    res.json(biomes);
  });

  getBiomeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const biome = await biomeService.getBiomeById(Number(id), { include: { itemsInBiome: { include: { item: true } }, biomeStructure: { include: { structure: true } } } });
    if (!biome) { res.status(404); throw new Error("Біом не знайдено"); }
    res.json(biome);
  });

  updateBiome = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedBiome = await biomeService.updateBiome(Number(id), req.body);
    res.json({ message: "Біом оновлено", biome: updatedBiome });
  });

  deleteBiome = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await biomeService.deleteBiome(Number(id));
    res.status(204).end();
  });
}

module.exports = new BiomeController();
