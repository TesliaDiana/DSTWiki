const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class EventService {
  async createEvent(data) {
    const {
      eventName,
      description,
      seasonIds = [],
      structureIds = [],
      summonCreatures = []
    } = data;
    if (!eventName) throw new Error("Назва події обов'язкова");
    return await prisma.events.create({
      data: {
        event_name: eventName,
        description,
        eventforseason: {
          create: seasonIds.map(id => ({
            season_id: Number(id)
          }))
        },
        structureevent: {
          create: structureIds.map(id => ({
            structure_id: Number(id)
          }))
        },
        summoncreature: {
          create: summonCreatures.map(id => ({
            creature_id: Number(id)
          }))
        }
      },
      include: {
        eventforseason: { 
          include: { 
            season: true 
          } 
        },
        structureevent: { 
          include: { 
            structures: true 
          } 
        },
        summoncreature: { 
          include: { 
            creature: true 
          } 
        },
      }
    });
  }

  async getAllEvents() {
    const [events, totalCount] = await prisma.$transaction([
      prisma.events.findMany({
        orderBy: { 
          event_id: "asc" 
        },
        include: {
          eventforseason: { 
            include: { 
              season: true 
            } 
          },
          structureevent: { 
            include: { 
              structures: true 
            } 
          },
          summoncreature: { 
            include: { 
              creature: true 
            } 
          },
        },
      }),
      prisma.events.count(),
    ]);
    return { 
      events, 
      totalCount 
    };
  }

  async getEventById(id) {
    const eventId = Number(id);
    const event = await prisma.events.findUnique({
      where: { 
        event_id: eventId 
      },
      include: {
        eventforseason: { 
          include: { 
            season: true 
          } 
        },
        structureevent: { 
          include: { 
            structures: true 
          } 
        },
        summoncreature: { 
          include: { 
            creature: true 
          } 
        },
      },
    });
    if (!event) return null;
    return event;
  }

  async updateEvent(id, data) {
    const eventId = Number(id);
    const {
      eventName,
      description,
      seasonIds,
      structureIds,
      summonCreatures
    } = data;
    const updateData = {
      ...(eventName !== undefined && { 
        event_name: eventName 
      }),
      ...(description !== undefined && { 
        description 
      }),
    };
    return prisma.$transaction(async (tx) => {
      const exists = await tx.events.findUnique({ 
        where: { 
          event_id: eventId 
        } 
      });
      if (!exists) {
        const err = new Error("Подію не знайдено");
        err.status = 404;
        throw err;
      }
      await tx.events.update({
        where: { 
          event_id: eventId 
        },
        data: updateData,
      });
      if (Array.isArray(seasonIds)) {
        await tx.eventForSeason.deleteMany({ 
          where: { 
            event_id: eventId 
          } 
        });
        if (seasonIds.length > 0) {
          await tx.eventForSeason.createMany({
            data: seasonIds.map(id => ({ 
              event_id: eventId, 
              season_id: Number(id) 
            })),
          });
        }
      }
      if (Array.isArray(structureIds)) {
        await tx.structureEvent.deleteMany({ 
          where: { 
            event_id: eventId 
          } 
        });
        if (structureIds.length > 0) {
          await tx.structureEvent.createMany({
            data: structureIds.map(id => ({ 
              event_id: eventId, 
              structure_id: Number(id) 
            })),
          });
        }
      }
      if (Array.isArray(summonCreatures)) {
        await tx.summonCreature.deleteMany({
          where: { event_id: eventId },
        });

        if (summonCreatures.length > 0) {
          await tx.summonCreature.createMany({
            data: summonCreatures
              .map(id => Number(id))
              .filter(id => !isNaN(id))
              .map(creatureId => ({
                event_id: eventId,
                creature_id: creatureId,
              })),
          });
        }
      }
      return tx.events.findUnique({
        where: { 
          event_id: eventId 
        },
        include: {
          eventforseason: { 
            include: { 
              season: true 
            } 
          },
          structureevent: { 
            include: { 
              structures: true 
            } 
          },
          summoncreature: { 
            include: { 
              creature: true 
            } 
          },
        },
      });
    });
  }

  async deleteEvent(id) {
    const eventId = Number(id);
    const [
      seasons, 
      structures, 
      summons
    ] = await prisma.$transaction([
      prisma.eventForSeason.findMany({
        where: { 
          event_id: eventId 
        },
        include: { 
          season: true 
        },
      }),
      prisma.structureEvent.findMany({
        where: { 
          event_id: eventId 
        },
        include: { 
          structures: true 
        },
      }),
      prisma.summonCreature.findMany({
        where: { 
          event_id: eventId 
        },
        include: { 
          creature: true 
        },
      }),
    ]);
    if (seasons.length > 0 || structures.length > 0 || summons.length > 0) {
      const error = new Error(
        `Неможливо видалити подію.\n` +
        `Сезони: ${seasons.map(s => s.season.season_name).join(", ") || "—"}\n` +
        `Структури: ${structures.map(s => s.structures.structure_name).join(", ") || "—"}\n` +
        `Сутності для виклику: ${summons.map(s => s.creature.creature_name).join(", ") || "—"}`
      );
      error.status = 409;
      throw error;
    }
    return prisma.events.delete({
      where: { 
        event_id: eventId 
      },
    });
  }
}

module.exports = new EventService();
