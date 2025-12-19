const asyncHandler = require("../utils/asyncHandler");
const biomeService = require("../services/biomeService");

class BiomeController {
  async createBiome(req, res) {
    const {
      biomeName,
      biomeLocation,
      spread,
      description
    } = req.body;

    if (!biomeName) {
      res.status(400);
      throw new Error("Назва біому обов'язкова");
    }

    const biome = await biomeService.createBiome({
      biomeName,
      biomeLocation,
      spread,
      description
    });

    res.status(201).json({
      message: "Біом створено",
      biome
    });
  }

  async updateBiome(req, res) {
    const { id } = req.params;
    const updatedBiome = await biomeService.updateBiome(id, req.body);
    res.status(200).json(updatedBiome);
  }

  async getAllBiomes(req, res) {
    const data = await biomeService.getAllBiomes();
    res.status(200).json(data);
  }

  async getBiomeById(req, res) {
    const id = Number(req.params.id);
    const biome = await biomeService.getBiomeById(id);
    res.status(200).json(biome);
  }

  async deleteBiome(req, res, next) {
    try {
    const id = Number(req.params.id);
    await biomeService.deleteBiome(id);
    res.status(204).end();
    } catch (err) {
    res.status(409);     
    next(err);           
    }
  }
}

module.exports = new BiomeController();
