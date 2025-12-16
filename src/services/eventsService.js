const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class EventService {
  async createEvent(data) {
    const {
      event_name,
      description,
      seasonIds = [],
      structureIds = [],
    } = data;

    return prisma.event.create({
      data: {
        event_name,
        description,

        ...(seasonIds.length > 0 && {
          eventforseason: {
            create: seasonIds.map((season_id) => ({
              season_id,
            })),
          },
        }),

        ...(structureIds.length > 0 && {
          structureevent: {
            create: structureIds.map((structure_id) => ({
              structure_id,
            })),
          },
        }),
      },
      include: {
        eventforseason: { include: { season: true } },
        structureevent: { include: { structure: true } },
      },
    });
  }

  async getAllEvents(prismaOptions = {}) {
    const [events, totalCount, seasonLinks, structureLinks] =
      await prisma.$transaction([
        prisma.event.findMany({
          orderBy: { event_id: "asc" },
          ...prismaOptions,
        }),
        prisma.event.count(),
        prisma.eventforseason.count(),
        prisma.structureevent.count(),
      ]);

    return {
      items: events,
      stats: {
        totalEvents: totalCount,
        seasonLinks,
        structureLinks,
      },
    };
  }

  async getEventById(id, prismaOptions = {}) {
    const [event, seasonsCount, structuresCount] =
      await prisma.$transaction([
        prisma.event.findUnique({
          where: { event_id: id },
          ...prismaOptions,
        }),
        prisma.eventforseason.count({
          where: { event_id: id },
        }),
        prisma.structureevent.count({
          where: { event_id: id },
        }),
      ]);

    if (!event) return null;

    return {
      event,
      stats: {
        seasons: seasonsCount,
        structures: structuresCount,
      },
    };
  }

  async updateEvent(id, data) {
    const {
      event_name,
      description,
      seasonIds,
      structureIds,
    } = data;

    return prisma.$transaction(async (tx) => {
      const exists = await tx.event.findUnique({
        where: { event_id: id },
      });

      if (!exists) {
        const err = new Error("Подію не знайдено");
        err.status = 404;
        throw err;
      }

      await tx.event.update({
        where: { event_id: id },
        data: {
          event_name,
          description,
        },
      });

      if (seasonIds) {
        await tx.eventforseason.deleteMany({
          where: { event_id: id },
        });

        if (seasonIds.length > 0) {
          await tx.eventforseason.createMany({
            data: seasonIds.map((season_id) => ({
              event_id: id,
              season_id,
            })),
          });
        }
      }

      if (structureIds) {
        await tx.structureevent.deleteMany({
          where: { event_id: id },
        });

        if (structureIds.length > 0) {
          await tx.structureevent.createMany({
            data: structureIds.map((structure_id) => ({
              event_id: id,
              structure_id,
            })),
          });
        }
      }

      return tx.event.findUnique({
        where: { event_id: id },
        include: {
          eventforseason: { include: { season: true } },
          structureevent: { include: { structure: true } },
        },
      });
    });
  }

  async deleteEvent(id) {
    const [seasons, structures] = await prisma.$transaction([
      prisma.eventforseason.findMany({
        where: { event_id: id },
        include: { season: true },
      }),
      prisma.structureevent.findMany({
        where: { event_id: id },
        include: { structure: true },
      }),
    ]);

    if (seasons.length > 0 || structures.length > 0) {
      const error = new Error(
        `Неможливо видалити подію.
Сезони: ${seasons.map(s => s.season.season_name).join(", ") || "—"}
Структури: ${structures.map(s => s.structure.structure_name).join(", ") || "—"}`
      );
      error.status = 409;
      throw error;
    }

    return prisma.event.delete({
      where: { event_id: id },
    });
  }
}

module.exports = new EventService();
