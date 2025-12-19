const request = require("supertest");
const app = require("../../src/app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Integration: Creatures API", () => {
  let creatureId;
  let biomeId;
  let itemId;

  beforeAll(async () => {
    const biome = await prisma.biome.create({
      data: {
        biome_name: "Біом для істот",
        biome_location: "EARTH",
        spread: 5,
        description: "Тестовий біом",
      },
    });

    biomeId = biome.biome_id;

    const item = await prisma.item.create({
      data: {
        item_name: "Предмет для випадіння з істот",
        max_stack: 20,
        description: "Тестовий предмет, що буде в таблиці creatureDropp",
      },
    });

    itemId = item.item_id;

    const creature = await prisma.creature.create({
    data: {
      creature_name: "Початкова тестова істота",
      behaviour: "NEUTRAL",
      health: 100,
      description: "Перша істота, що для тестів, щоб не переміщати post вверх",
      creaturebiome: {
        create: [{ biome_id: biomeId }],
      },
      creaturedrop: {
        create: [{
          item_id: itemId,
          quantity_of_resources: 1,
          drop_chance: 0.5,
        }],
      },
    },
  });
  });

    test("POST /api/creatures - створює нову істоту", async () => {
    const res = await request(app)
      .post("/api/creatures")
      .send({
        creatureName: "Нова істота (тест)",
        behaviour: "HOSTILE",
        health: 1002,
        speedMove: 11, 
        speedAttack: 12, 
        strengthAttack: 100, 
        description: "Нова тестова істота для перевірки POST",
        biomes: [biomeId],
        drops: [{ itemId, quantity: 2, chance: 0.5 }],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("creature");
    const creature = res.body.creature;
    expect(creature.creature_name).toBe("Нова істота (тест)");
    expect(creature.behaviour).toBe("HOSTILE");
    expect(creature.health).toBe(1002);
    expect(creature.description).toBe("Нова тестова істота для перевірки POST");
    expect(creature.creaturebiome).toHaveLength(1);
    expect(creature.creaturebiome[0].biome_id).toBe(biomeId);
    expect(creature.creaturedrop).toHaveLength(1);
    expect(creature.creaturedrop[0].item_id).toBe(itemId);

    creatureId = creature.creature_id;
  });

  test("GET /api/creatures - повертає список істот", async () => {
    const res = await request(app).get("/api/creatures");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("creatures");
    expect(res.body).toHaveProperty("totalCount");
    expect(Array.isArray(res.body.creatures)).toBe(true);
    expect(res.body.totalCount).toBeGreaterThanOrEqual(2);
  });

  test("GET /api/creatures/:id - повертає істоту за конкретним id", async () => {
    const res = await request(app).get(`/api/creatures/${creatureId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.creature_id).toBe(creatureId);
  });

  test("PATCH /api/creatures/:id - оновлює істоту", async () => {
    const res = await request(app)
      .patch(`/api/creatures/${creatureId}`)
      .send({
        description: "Оновлений опис істоти",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Оновлений опис істоти");
  });

  test("PATCH /api/creatures/:id", async () => {
    const res = await request(app)
      .patch(`/api/creatures/${creatureId}`)
      .send({ health: 200 });

    expect(res.body.health).toBe(200);
  });
/*
  test("DELETE /api/creatures/:id — встановлює is_deleted = true", async () => {
    const res = await request(app)
      .delete(`/api/creatures/${creatureId}`);

    expect(res.statusCode).toBe(200);

    const creatureInDb = await prisma.creature.findUnique({
      where: { creature_id: creatureId },
    });

    expect(creatureInDb).not.toBeNull();
    expect(creatureInDb.is_deleted).toBe(true);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
  */
});
