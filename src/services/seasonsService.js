const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class SeasonService {
  async createSeason(data) {
    const { season_name, description, quantity_of_days, weather } = data;

    return await prisma.season.create({
      data: {
        season_name,
        description,
        quantity_of_days,
        weather,
      },
      include: {
        creatureForSeason: { include: { creature: true } },
        eventForSeason: { include: { events: true } },
      },
    });
  }

  async getAllSeasons(prismaOptions = {}) {
    const [seasons, creatureLinks, eventLinks] = await prisma.$transaction([
      prisma.season.findMany({
        orderBy: { season_id: "asc" },
        ...prismaOptions,
      }),
      prisma.creatureForSeason.count(),
      prisma.eventForSeason.count(),
    ]);

    return {
      items: seasons,
      stats: {
        totalSeasons: seasons.length,
        totalCreatureLinks: creatureLinks,
        totalEventLinks: eventLinks,
      },
    };
  }

  async getSeasonById(id, prismaOptions = {}) {
    const [season, creatureCount, eventCount] = await prisma.$transaction([
      prisma.season.findUnique({
        where: { season_id: id },
        ...prismaOptions,
      }),
      prisma.creatureForSeason.count({
        where: { season_id: id },
      }),
      prisma.eventForSeason.count({
        where: { season_id: id },
      }),
    ]);

    if (!season) return null;

    return {
      season,
      stats: {
        creatures: creatureCount,
        events: eventCount,
      },
    };
  }

  async updateSeason(id, data) {
    const { season_name, description, quantity_of_days, weather } = data;

    return await prisma.season.update({
      where: { season_id: id },
      data: {
        season_name,
        description,
        quantity_of_days,
        weather,
      },
      include: {
        creatureForSeason: { include: { creature: true } },
        eventForSeason: { include: { events: true } },
      },
    });
  }

  async deleteSeason(id) {
    const [creatures, events] = await prisma.$transaction([
      prisma.creatureForSeason.findMany({
        where: { season_id: id },
        include: { creature: true },
      }),
      prisma.eventForSeason.findMany({
        where: { season_id: id },
        include: { events: true },
      }),
    ]);

    if (creatures.length > 0 || events.length > 0) {
      const error = new Error(
        `Неможливо видалити сезон.
        Прив’язані створіння: ${creatures.map(c => c.creature.creature_name).join(", ") || "—"}
        Прив’язані події: ${events.map(e => e.events.event_name).join(", ") || "—"}`
      );
      error.status = 409;
      throw error;
    }

    return await prisma.season.delete({
      where: { season_id: id },
    });
  }
}

module.exports = new SeasonService();
