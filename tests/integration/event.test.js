const request = require("supertest");
const app = require("../../src/app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Integration: Events API", () => {
  let eventId;
  let seasonId;
  let structureId;
  let summCreatureId;

  beforeAll(async () => {
    const season = await prisma.season.create({
      data: { 
        season_name: "Зима",
        quantity_of_days: 20,
        weather: "SUN",
        description: "Сезон для подіх тест",
      },
    });
    seasonId = season.season_id;
    const structures = await prisma.structures.create({
      data: { 
        structure_name: "Тестова структура",
        structure_type: "Стіна",
        description: "Опис структури для тесту event",
      },
    });
    structureId = structures.structure_id;
    const creature = await prisma.creature.create({
      data: { 
        creature_name: "Істота для тесту event",
        behaviour: "HOSTILE",
        health: 10,
        speed_move: 1, 
        speed_attack: 2, 
        strength_attack: 10, 
        description: "Опис Істоти для тесту event",
      },
    });
    summCreatureId = creature.creature_id;
    const freeEvent = await prisma.events.create({
      data: {
        event_name: "Тестова подія в beforeall",
        description: "Опис тестової події",
        eventforseason: {create: [{ season_id: seasonId }]},
        structureevent: {create: [{ structure_id: structureId }]},
        summoncreature: {create: [{ creature_id: summCreatureId }]},
      },
    });
  });

  test("POST /api/events - створює нову подію", async () => {
    const res = await request(app)
      .post("/api/events")
      .send({
        eventName: "Тестова подія",
        description: "Опис тестової події",
        seasonIds: [seasonId],
        structureIds: [structureId],
        summonCreatures: [summCreatureId],
      });

    expect(res.statusCode).toBe(201);
    eventId = res.body.event.event_id;
  });

  test("GET /api/events - повертає список подій", async () => {
    const res = await request(app).get("/api/events");

    expect(res.body.events.length).toBeGreaterThan(0);
    expect(res.body.totalCount).toBeGreaterThan(0);
  });

  test("GET /api/events/:id", async () => {
    const res = await request(app).get(`/api/events/${eventId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.event_id).toBe(eventId);
  });

  test("PATCH /api/events/:id - повертає конкретну подія за id", async () => {
    const res = await request(app)
      .patch(`/api/events/${eventId}`)
      .send({ description: "Оновлено" });

    expect(res.statusCode).toBe(200);
    expect(res.body.event.description).toBe("Оновлено");
  });

  test("DELETE /api/events/:id — заборона на видалення", async () => {
    const res = await request(app).delete(`/api/events/${eventId}`);
    expect(res.statusCode).toBe(409);
  });

  test("DELETE /api/events/:id — після очищення звʼязків", async () => {
    await prisma.eventForSeason.deleteMany({ where: { event_id: eventId } });
    await prisma.structureEvent.deleteMany({ where: { event_id: eventId } });
    await prisma.summonCreature.deleteMany({ where: { event_id: eventId } });
    const res = await request(app).delete(`/api/events/${eventId}`);
    expect(res.statusCode).toBe(204);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
