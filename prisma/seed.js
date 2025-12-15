const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function clearAllTables() {
  console.log("Очищення всіх таблиць...");

  await prisma.characterFeature.deleteMany({});
  await prisma.creatureDrop.deleteMany({});
  await prisma.itemToItemType.deleteMany({});
  await prisma.itemsInBiome.deleteMany({});
  await prisma.creatureForSeason.deleteMany({});
  await prisma.eventForSeason.deleteMany({});
  await prisma.structureCreature.deleteMany({});
  await prisma.structureEvent.deleteMany({});
  await prisma.summonCreature.deleteMany({});
  await prisma.creatureBiome.deleteMany({});
  await prisma.startItem.deleteMany({});

  await prisma.featureSkill.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.itemsTypes.deleteMany({});
  await prisma.creature.deleteMany({});
  await prisma.gameCharacter.deleteMany({});
  await prisma.events.deleteMany({});
  await prisma.biomeStructure.deleteMany({});
  await prisma.structures.deleteMany({});
  await prisma.biome.deleteMany({});
  await prisma.season.deleteMany({});

  console.log("Таблиці очищено!");
}
async function resetSequences() {
  console.log("Скидання автоінкременту для всіх таблиць...");

  const seqs = await prisma.$queryRawUnsafe(`
    SELECT c.relname AS sequence_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'S';
  `);

  for (const seq of seqs) {
    const name = seq.sequence_name || seq.relname;
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE "${name}" RESTART WITH 1;`);
  }

  console.log("Автоінкремент скинутий!");
}
async function main() {
  await clearAllTables();
  await resetSequences();

  console.log("Вставляємо дані...");

  const itemTypesData = ["Голова","Тіло","Рука","Ресурс","Будівельний","Їжа","Зброя"];
  const itemTypes = [];
  for (const name of itemTypesData) {
    itemTypes.push(await prisma.itemsTypes.create({ data: { item_type_name: name } }));
  }

  const itemsData = [
    { item_name: "Зимова шапка", max_stack: 1, durability: 100, recipe_id: 1, description: "Одяг. Екіпірується на голову. Втрачає 100% міцності за 10 днів." },
    { item_name: "Пухкий желет", max_stack: 1, durability: 100, recipe_id: 2, description: "Одяг. Екіпірується на тіло. Втрачає 100% міцності за 15 днів." },
    { item_name: "Спис", max_stack: 1, durability: 100, recipe_id: 3, description: "Зброя. Екіпірується в руку. Втрачає 100% міцності за 150 атак." },
    { item_name: "Зрізана трава", max_stack: 40, durability: null, recipe_id: null, description: "Ресурс - зрізана трава. Використовується для крафту. Не має міцності." },
    { item_name: "Павутина", max_stack: 40, durability: null, recipe_id: null, description: "Ресурс - павутина. Використовується для крафту. Не має міцності." },
    { item_name: "Паркан", max_stack: 20, durability: 1, recipe_id: 4, description: "Будівельний інструмент. Можна розташувати на поверхні. Не має міцності." },
    { item_name: "Сокира", max_stack: 1, durability: 100, recipe_id: 5, description: "Зброя/інструмент. Екіпірується в руку. Втрачає 100% міцності за 100 ударів." },
    { item_name: "Міні-робот", max_stack: 1, durability: null, recipe_id: null, description: "Робот, що лежить в інвентарі WX-78 при появі в сіті." },
    { item_name: "Хутро біфало", max_stack: 40, durability: null, recipe_id: null, description: "Хутро біфало. Випадає після бриття або вбивства біфало." },
    { item_name: "Маленьке м'ясо", max_stack: 40, durability: null, recipe_id: null, description: "Маленьке м'ясо. Випадає після вбивства кроликів." },
    { item_name: "Монстро м'ясо", max_stack: 40, durability: null, recipe_id: null, description: "Монстро м'ясо. Випадає після вбивства біфало або свина-перевертня." },
    { item_name: "Велике м'ясо", max_stack: 40, durability: null, recipe_id: null, description: "Велике м'ясо. Випадає після вбивства павука-воїна чи гончої." },
    { item_name: "Берет", max_stack: 1, durability: 100, recipe_id: 6, description: "Одяг. Екіпірується на голову. Відновлює розум, коли одягнутий." },
  ];
  const items = [];
  for (const data of itemsData) items.push(await prisma.item.create({ data }));

  const itemToItemTypeData = [
    [0,0],[1,1],[2,2],[2,6],[3,3],[4,3],[5,4],[6,2],[6,6],[7,4],[8,3],[9,5],[10,5],[11,5],[11,3],[12,0]
  ];
  for (const [iIndex, tIndex] of itemToItemTypeData) {
    await prisma.itemToItemType.create({ 
      data: { 
        item_id: items[iIndex].item_id, 
        item_type_id: itemTypes[tIndex].item_type_id 
      } 
    });
  }

  const creaturesData = [
    { creature_name: 'Павук-воїн', behaviour: 'HOSTILE', health: 400, speed_move: 4, speed_attack: 4, strength_attack: 20, is_deleted: false, description: 'Павук-воїн. Монстр. Вилазить з кокона.' },
    { creature_name: 'Свин-перевертень', behaviour: 'HOSTILE', health: 525, speed_move: 4, speed_attack: 5, strength_attack: 34, is_deleted: false, description: 'Свин перевертень. Поява під час повнолуння, якщо не встиг сховатись.' },
    { creature_name: 'Біфало', behaviour: 'NEUTRAL', health: 1000, speed_move: 1.5, speed_attack: 4, strength_attack: 34, is_deleted: false, description: 'Біфало. Живе в савані. Мешкає зі стадом.' },
    { creature_name: 'Індик', behaviour: 'PASSIVE', health: 50, speed_move: 3, speed_attack: null, strength_attack: null, is_deleted: false, description: "Індик. Пасивний, але краде ягоди. Місце появи - ягідний кущ." },
    { creature_name: 'Гонча', behaviour: 'HOSTILE', health: 150, speed_move: 6, speed_attack: 4, strength_attack: 20, is_deleted: false, description: 'Гонча. Часто влаштовують набіги на персонажів.' },
    { creature_name: 'Кролик', behaviour: 'PASSIVE', health: 25, speed_move: 5, speed_attack: null, strength_attack: null, is_deleted: false, description: "Маленький кролик. Можна зловити в трав'яну пастку. Після вбивства випадає мале м'ясо." },
  ];
  const creatures = [];
  for (const data of creaturesData) creatures.push(await prisma.creature.create({ data }));

  const charactersData = [
    { character_name: 'Вілсон', max_health: 150, max_hunger: 150, max_sanity: 200, speed_move: 5, strength_attack: 10, description: 'Вілсон. Чудовий базовий персонаж з посередніми шансами на виживання' },
    { character_name: 'WX-78', max_health: 125, max_hunger: 125, max_sanity: 125, speed_move: 5, strength_attack: 10, description: 'Робот, що страждає від води, але може заряжатись різними чіпами.' },
    { character_name: 'Венді', max_health: 150, max_hunger: 150, max_sanity: 200, speed_move: 5, strength_attack: 7.5, description: 'Дівчинка Венді, що втратила сестру, але має її привида з собою. Слабша атака. Зменшена втрата розуму в темряві.' },
  ];
  const characters = [];
  for (const data of charactersData) characters.push(await prisma.gameCharacter.create({ data }));

  const structuresData = [
    { structure_type: 'Стіна', structure_name: 'Тулецитова стіна', description: 'Стіна зроблена з тулециту. Має до 800 хп.' },
    { structure_type: 'Стіна', structure_name: 'Місячна стіна', description: 'Стіна зроблена з місячного каменю. Має до 1600 хп.' },
    { structure_type: 'Станція', structure_name: 'Алхімічний двигун', description: 'Станція для вивчення просунутих рецептів.' },
    { structure_type: 'Пастка', structure_name: 'Скриня-пастка', description: 'Скриня, що викликає підпал навколишніх предметів з ймовірністю 50%.' },
    { structure_type: 'Пастка', structure_name: 'Обманка-лігво', description: 'Лігво, що при наближенні викликає гончіх.' },
  ];
   const structures = [];
  for (const s of structuresData) structures.push(await prisma.structures.create({ data: s }));

  const seasonsData = [
    { season_name: 'Весна', quantity_of_days: 20, weather: 'LIGHT', description: 'Весна. Погода світла та тепла.' },
    { season_name: 'Літо', quantity_of_days: 16, weather: 'SUN', description: 'Літо. Спекотна пора року.' },
    { season_name: 'Осінь', quantity_of_days: 20, weather: 'RAIN', description: 'Осінь. Часто дощі та холод.' },
    { season_name: 'Зима', quantity_of_days: 16, weather: 'SNOW', description: 'Зима. Сніг та холод.' },
  ];
  const seasons = [];
  for (const s of seasonsData) seasons.push(await prisma.season.create({ data: s }));

  const featureSkillsData = [
    "Відрощує розкішну бороду",
    "Отримує шкоду від води",
    "Робот",
    "Має слабшу атаку",
    "Має сестру-привида",
    "Повільніше втрачає розум в темряві",
    "Монстр, тому його не люблять мирні істоти",
    "Друг павуків"
  ];
  const featureSkills = [];
  for (const name of featureSkillsData) featureSkills.push(await prisma.featureSkill.create({ data: { feature_skill: name } }));

  const characterFeaturesData = [
    { character_id: characters[0].character_id, feature_id: featureSkills[0].feature_id },
    { character_id: characters[1].character_id, feature_id: featureSkills[1].feature_id },
    { character_id: characters[1].character_id, feature_id: featureSkills[2].feature_id },
    { character_id: characters[2].character_id, feature_id: featureSkills[3].feature_id },
    { character_id: characters[2].character_id, feature_id: featureSkills[4].feature_id },
    { character_id: characters[2].character_id, feature_id: featureSkills[5].feature_id }
  ];
  for (const data of characterFeaturesData) await prisma.characterFeature.create({ data });

  const biomesData = [
    { biome_name: 'Савана', biome_location: 'EARTH', spread: 10, description: 'Біом савани. Містить багато трави та стада біфало.' },
    { biome_name: 'Ліс', biome_location: 'EARTH', spread: 20, description: 'Лісний біом. Містить багато ялинок.' },
    { biome_name: 'Лабіринт', biome_location: 'CAVE', spread: 5, description: 'Біом лабіринту. В ньому знаходиться Древній страж.' },
  ];
  const biomes = [];
  for (const b of biomesData) biomes.push(await prisma.biome.create({ data: b }));

  const creatureDropData = [
    { creature_id: creatures[0].creature_id, item_id: items[4].item_id, quantity_of_resources: 1, drop_chance: 25 },
    { creature_id: creatures[0].creature_id, item_id: items[10].item_id, quantity_of_resources: 1, drop_chance: 50 },
    { creature_id: creatures[1].creature_id, item_id: items[11].item_id, quantity_of_resources: 2, drop_chance: 100 },
    { creature_id: creatures[2].creature_id, item_id: items[11].item_id, quantity_of_resources: 4, drop_chance: 100 },
    { creature_id: creatures[2].creature_id, item_id: items[8].item_id, quantity_of_resources: 3, drop_chance: 100 },
    { creature_id: creatures[4].creature_id, item_id: items[10].item_id, quantity_of_resources: 1, drop_chance: 75 },
    { creature_id: creatures[5].creature_id, item_id: items[9].item_id, quantity_of_resources: 1, drop_chance: 100 },
  ];
  for (const data of creatureDropData) await prisma.creatureDrop.create({ data });

  const itemsInBiomeData = [
    { biome_id: biomes[0].biome_id, item_id: items[3].item_id },
    { biome_id: biomes[0].biome_id, item_id: items[8].item_id },
    { biome_id: biomes[1].biome_id, item_id: items[3].item_id },
    { biome_id: biomes[2].biome_id, item_id: items[4].item_id },
  ];
  for (const data of itemsInBiomeData) await prisma.itemsInBiome.create({ data });

  const creatureForSeasonData = [
    { season_id: seasons[3].season_id, creature_id: creatures[4].creature_id },
    { season_id: seasons[3].season_id, creature_id: creatures[0].creature_id },
    { season_id: seasons[1].season_id, creature_id: creatures[5].creature_id },
    { season_id: seasons[0].season_id, creature_id: creatures[0].creature_id },
  ];
  for (const data of creatureForSeasonData) await prisma.creatureForSeason.create({ data });

  const eventsData = [
    { event_name: 'Пожежа', description: 'Пожежа викликана подіями або природніми підпалами впродовж літа.' },
    { event_name: 'Повнолуння', description: 'Повнолуння виникає кожні 21 день.' },
    {event_name: 'Дощ', description: 'Дощ викликканий сезонними подіями або після взаємодії з проклятими структурами.' }
  ];
  const events = [];
  for (const e of eventsData) events.push(await prisma.events.create({ data: e }));

  const eventForSeasonData = [
    { season_id: seasons[0].season_id, event_id: events[0].event_id },
  ];
  for (const data of eventForSeasonData) await prisma.eventForSeason.create({ data });

  const structureCreatureData = [
    { structure_id: structures[4].structure_id, creature_id: creatures[4].creature_id, quantity_of_creatures: 2 },
  ];
  for (const data of structureCreatureData) await prisma.structureCreature.create({ data });

  const structureEventData = [
    { structure_id: structures[3].structure_id, event_id: events[0].event_id },
  ];
  for (const data of structureEventData) await prisma.structureEvent.create({ data });

  const summonCreatureData = [
    { event_id: events[1].event_id, creature_id: creatures[1].creature_id },
  ];
  for (const data of summonCreatureData) await prisma.summonCreature.create({ data });

  const creatureBiomeData = [
    { biome_id: biomes[0].biome_id, creature_id: creatures[2].creature_id },
    { biome_id: biomes[1].biome_id, creature_id: creatures[0].creature_id },
    { biome_id: biomes[0].biome_id, creature_id: creatures[5].creature_id },
    { biome_id: biomes[1].biome_id, creature_id: creatures[3].creature_id },
    { biome_id: biomes[1].biome_id, creature_id: creatures[4].creature_id },
    { biome_id: biomes[1].biome_id, creature_id: creatures[1].creature_id },
  ];
  for (const data of creatureBiomeData) await prisma.creatureBiome.create({ data });

  const startItemData = [
    { character_id: characters[0].character_id, item_id: items[7].item_id, quantity_of_resources: 1 },
  ];
  for (const data of startItemData) await prisma.startItem.create({ data });

  const biomeStructureData = [
    { structure_id: structures[0].structure_id, biome_id: biomes[2].biome_id },
  ];
  for (const data of biomeStructureData) await prisma.biomeStructure.create({ data });

  console.log("Дані успішно додані!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
