const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CreatureService {
  async createCreature(data) {
    const { 
      creatureName, 
      behaviour, 
      health, 
      speedMove, 
      speedAttack, 
      strengthAttack, 
      description, 
      biomes = [], 
      drops = [] 
    } = data;
    if (!creatureName) throw new Error("Назва істоти обов'язкова");
    return await prisma.creature.create({
      data: {
        creature_name: creatureName,
        behaviour,
        health,
        speed_move: Number(speedMove),
        speed_attack: Number(speedAttack),
        strength_attack: Number(strengthAttack),
        description,
        creaturebiome: {
          create: biomes.map(id => ({
            biome_id: Number(id) 
          }))
        },
        creaturedrop: {
          create: drops.map(d => ({
            item_id: Number(d.itemId),
            quantity_of_resources: d.quantity,
            drop_chance: d.chance
          }))
        }
      },
      include: {
        creaturebiome: true,
        creaturedrop: { include: { 
          item: true 
        }}
      }
    });
  }

  async getAllCreatures() {
    const [creatures, totalCount] = await prisma.$transaction([
      prisma.creature.findMany({
        where: {
          is_deleted: false
        },
        include: {
          creaturedrop: {
            include: {
              item: true
            }
          },
          creaturebiome: true,
          creatureforseason: true
        },
        orderBy: {
          creature_id: "asc"
        }
      }),
      prisma.creature.count({
        where: {
          is_deleted: false
        }
      })
    ]);
    return { creatures, totalCount };
  }

  async getCreatureById(id) {
    return await prisma.creature.findUnique({
      where: { 
        creature_id: id
      },
      include: {
        creaturebiome: true,
        creaturedrop: { include: {
          item: true 
        }}
      }
    });
  }

  async countDrops(creatureId) {
    const dropCount = await prisma.creatureDrop.count({
      where: { creature_id: Number(creatureId) }
    });
    return { creatureId: Number(creatureId), dropCount };
  }

  async updateCreature(id, data) {
    const creatureId = Number(id);
    const {
      creatureName,
      behaviour,
      health,
      speedMove,
      speedAttack,
      strengthAttack,
      description,
      biomes,
      drops
    } = data;
    const updateData = {
      ...(creatureName !== undefined && { creature_name: creatureName }),
      ...(behaviour !== undefined && { behaviour }),
      ...(health !== undefined && { health: Number(health) }),
      ...(speedMove !== undefined && { speed_move: Number(speedMove) }),
      ...(speedAttack !== undefined && { speed_attack: Number(speedAttack) }),
      ...(strengthAttack !== undefined && { strength_attack: Number(strengthAttack) }),
      ...(description !== undefined && { description }),
    };
    if (Array.isArray(biomes)) {
      updateData.creaturebiome = {
        deleteMany: {},
        create: biomes.map(id => ({ 
          biome_id: Number(id) 
        }))
      };
    }
    if (Array.isArray(drops)) {
      updateData.creaturedrop = {
        deleteMany: {},
        create: drops.map(d => ({
          item_id: Number(d.itemId),
          quantity_of_resources: d.quantity,
          drop_chance: d.chance
        }))
      };
    }
    return await prisma.creature.update({
      where: { 
        creature_id: creatureId
      },
      data: updateData,
      include: {
        creaturebiome: true,
        creaturedrop: { include: { 
          item: true 
        }}
      }
    });
  }

  async softDeleteCreature(id) {
    const creatureId = Number(id);
    return await prisma.creature.update({
      where: { 
        creature_id: creatureId
      },
      data: { 
        is_deleted: true 
      },
    });
  }
}

module.exports = new CreatureService();
