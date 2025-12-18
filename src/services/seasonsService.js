const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class SeasonService {
   async createSeason(data) {
    const { 
      season_name, 
      quantity_of_days, 
      weather, 
      description, 
      creatureIds = [] 
    } = data;
    if (!season_name) throw new Error("Назва сезону обов'язкова");
    if (quantity_of_days === undefined) throw new Error("Кількість днів сезону обов'язкова");
    if (!weather) throw new Error("Погода сезону обов'язкова");
    return await prisma.season.create({
      data: {
        season_name,
        quantity_of_days, 
        weather,
        description,
        creatureforseason: {
          create: creatureIds.map(id => ({ 
            creature_id: Number(id) 
          }))
        },
      },
      include: {
        creatureforseason: { 
          include: { 
            creature: true 
          } 
        },
      }
    });
  }

  async getAllSeasons() {
    const [
      seasons, 
      totalCount
    ] = await prisma.$transaction([
      prisma.season.findMany({
        orderBy: { 
          season_id: "asc" 
        },
        include: {
          creatureforseason: { 
            include: { 
              creature: true 
            } 
          },
          eventforseason: { 
            include: { 
              events: true 
            } 
          },
        },
      }),
      prisma.season.count(),
    ]);
    return { 
      seasons, 
      totalCount 
    };
  }

  async getSeasonById(id) {
    const seasonId = Number(id);
    const season = await prisma.season.findUnique({
      where: { 
        season_id: seasonId 
      },
      include: {
        creatureforseason: { 
          include: { 
            creature: true 
          } 
        },
        eventforseason: { 
          include: { 
            events: true 
          } 
        },
      },
    });
    if (!season) return null;
    return season;
  }

  async updateSeason(id, data) {
    const seasonId = Number(id);
    const { 
      season_name, 
      quantity_of_days, 
      weather, 
      description, 
      creatureIds 
    } = data;
    const updateData = {
      ...(season_name !== undefined && { season_name: season_name }),
      ...(quantity_of_days !== undefined && { quantity_of_days }),
      ...(weather !== undefined && { weather }),
      ...(description !== undefined && { description }),
    };
    return prisma.$transaction(async (tx) => {
      const exists = await tx.season.findUnique({ 
        where: { 
          season_id: seasonId 
        } 
      });
      if (!exists) {
        const err = new Error("Сезон не знайдено");
        err.status = 404;
        throw err;
      }
      await tx.season.update({ 
        where: { 
          season_id: seasonId 
        }, 
        data: updateData 
      });
      if (Array.isArray(creatureIds)) {
        await tx.creatureForSeason.deleteMany({ 
          where: { 
            season_id: seasonId 
          } 
        });
        if (creatureIds.length > 0) {
          await tx.creatureForSeason.createMany({
            data: creatureIds
              .map(id => Number(id))
              .filter(id => !isNaN(id))
              .map(creature_id => ({ 
                season_id: seasonId, 
                creature_id 
              })),
          });
        }
      }
      return tx.season.findUnique({
        where: { 
          season_id: seasonId 
        },
        include: { 
          creatureforseason: { 
            include: { 
              creature: true 
            } 
          } 
        },
      });
    });
  }

  async deleteSeason(id) {
    const seasonId = Number(id);
    const [
      creatures, 
      events
    ] = await prisma.$transaction([
      prisma.creatureForSeason.findMany({
        where: { 
          season_id: seasonId 
        },
        include: { 
          creature: true 
        }
      }),
      prisma.eventForSeason.findMany({
        where: { 
          season_id: seasonId 
        },
        include: { 
          events: true 
        }
      })
    ]);
    if (creatures.length > 0 || events.length > 0) {
      const error = new Error(
        `Неможливо видалити сезон через існуючі зв'язки:\n` +
        `Сутності: ${creatures.map(c => c.creature.creature_name).join(", ") || "—"}\n` +
        `Події: ${events.map(e => e.events.event_name).join(", ") || "—"}`
      );
      error.status = 409;
      throw error;
    }
    return prisma.season.delete({
      where: { 
        season_id: seasonId 
      }
    });
  }
}

module.exports = new SeasonService();
