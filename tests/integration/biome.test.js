const request = require("supertest");
const app = require("../../src/app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Integration: Biomes API", () => {
  let createdBiomeId;
  let biomeWithRelationsId;

  beforeAll(async () => {
    await prisma.biome.deleteMany({
      where: {
        biomestructure: { none: {} },
        creaturebiome: { none: {} },
        itemsinbiome: { none: {} },
      },
    });

    const freeBiome = await prisma.biome.create({
      data: {
        biome_name: "Тестовий біом савана",
        biome_location: "EARTH",
        spread: 10,
        description: "Для тестів",
      },
    });

    createdBiomeId = freeBiome.biome_id;

    const linkedBiome = await prisma.biome.create({
      data: {
        biome_name: "Тестовий біом, що має зв'язки",
        biome_location: "CAVE",
        spread: 20,
        description: "Має звʼязки з іншими таблицями",
        itemsinbiome: {
          create: {
            item: {
              create: {
                item_name: "Тестовий предмет",
                max_stack: 40,
                description: "Тестовий предмет для прив'язування до таблиці",
              },
            },
          },
        },
      },
    });

    biomeWithRelationsId = linkedBiome.biome_id;
  });

  test("GET /api/biomes - повертає список біомів", async () => {
    const res = await request(app).get("/api/biomes");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("biomes");
    expect(res.body).toHaveProperty("totalCount");
    expect(Array.isArray(res.body.biomes)).toBe(true);
    expect(res.body.totalCount).toBeGreaterThanOrEqual(2);
  });

  test("GET /api/biomes/:id - повертає біом за конкретним id", async () => {
    const res = await request(app).get(`/api/biomes/${createdBiomeId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.biome_id).toBe(createdBiomeId);
  });

  test("POST /api/biomes - створює новий біом", async () => {
    const res = await request(app)
      .post("/api/biomes")
      .send({
        biomeName: "Новий біом (тест)",
        biomeLocation: "EARTH",
        spread: 30,
        description: "Новий тестовий біом для перевірки POST",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("biome");
    expect(res.body.biome.biome_name).toBe("Новий біом (тест)");

    createdBiomeId = res.body.biome.biome_id;
  });

  test("PATCH /api/biomes/:id - оновлює біом", async () => {
    const res = await request(app)
      .patch(`/api/biomes/${createdBiomeId}`)
      .send({
        description: "Оновлений опис біому",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Оновлений опис біому");
  });

  test("DELETE /api/biomes/:id - не видаляє біом зі звʼязками", async () => {
    const res = await request(app).delete(
      `/api/biomes/${biomeWithRelationsId}`
    );

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/Неможливо видалити біом/);
  });

  test("DELETE /api/biomes/:id - видаляє біом без звʼязків", async () => {
    const res = await request(app).delete(`/api/biomes/${createdBiomeId}`);

    expect(res.statusCode).toBe(204);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
