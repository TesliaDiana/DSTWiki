const seasonService = require("../services/seasonsService");
const asyncHandler = require("../utils/asyncHandler");
const { prisma } = require("../prismaClient");

class SeasonController {
  createSeason = asyncHandler(async (req, res) => {
    const { season_name, description } = req.body;
    if (!season_name) { res.status(400); throw new Error("Назва сезону обов'язкова"); }

    const newSeason = await seasonService.createSeason({ season_name, description });
    res.status(201).json({ message: "Сезон створено", season: newSeason });
  });

  getAllSeasons = asyncHandler(async (req, res) => {
    const seasons = await seasonService.getAllSeasons({
      include: { creatureForSeason: { include: { creature: true } }, eventForSeason: { include: { event: true } } }
    });
    res.json(seasons);
  });

  getSeasonById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const season = await seasonService.getSeasonById(Number(id), {
      include: { creatureForSeason: { include: { creature: true } }, eventForSeason: { include: { event: true } } }
    });
    if (!season) { res.status(404); throw new Error("Сезон не знайдено"); }
    res.json(season);
  });

  updateSeason = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedSeason = await seasonService.updateSeason(Number(id), req.body);
    res.json({ message: "Сезон оновлено", season: updatedSeason });
  });

  deleteSeason = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await seasonService.deleteSeason(Number(id));
    res.status(204).end();
  });
}

module.exports = new SeasonController();
