DROP TYPE IF EXISTS type_behaviour CASCADE;
DROP TYPE IF EXISTS type_weather CASCADE;
DROP TYPE IF EXISTS type_biome CASCADE;
DROP TABLE IF EXISTS ItemsTypes CASCADE;
DROP TABLE IF EXISTS Item CASCADE;
DROP TABLE IF EXISTS Creature CASCADE;
DROP TABLE IF EXISTS Structures CASCADE;
DROP TABLE IF EXISTS Biome CASCADE;
DROP TABLE IF EXISTS FeatureSkill CASCADE;
DROP TABLE IF EXISTS GameCharacter CASCADE;
DROP TABLE IF EXISTS Events CASCADE;
DROP TABLE IF EXISTS Season CASCADE;
DROP TABLE IF EXISTS ItemToItemType CASCADE;
DROP TABLE IF EXISTS CharacterFeature CASCADE;
DROP TABLE IF EXISTS CreatureDrop CASCADE;
DROP TABLE IF EXISTS StartItem CASCADE;
DROP TABLE IF EXISTS ItemsInBiome CASCADE;
DROP TABLE IF EXISTS CreatureForSeason CASCADE;
DROP TABLE IF EXISTS EventForSeason CASCADE;
DROP TABLE IF EXISTS SummonCreature CASCADE;
DROP TABLE IF EXISTS CreatureBiome CASCADE;
DROP TABLE IF EXISTS BiomeStructure CASCADE;
DROP TABLE IF EXISTS StructureEvent CASCADE;
DROP TABLE IF EXISTS StructureCreature CASCADE;

CREATE TYPE type_behaviour AS ENUM ('HOSTILE', 'NEUTRAL', 'PASSIVE');

CREATE TYPE type_weather AS ENUM ('RAIN', 'SNOW', 'SUN', 'LIGHT');

CREATE TYPE type_biome AS ENUM ('EARTH', 'CAVE');

CREATE TABLE IF NOT EXISTS ItemsTypes 
(
	item_type_id SERIAL PRIMARY KEY,
	item_type_name VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS Item 
(
	item_id SERIAL PRIMARY KEY,
	item_name VARCHAR(32) NOT NULL,
	max_stack SMALLINT NOT NULL CHECK (max_stack BETWEEN 1 AND 40),
	durability SMALLINT CHECK (durability BETWEEN 0 AND 100),
	recipe_id INTEGER UNIQUE CHECK (recipe_id > 0),
	description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Creature
(
	creature_id SERIAL PRIMARY KEY,
	creature_name VARCHAR(32) NOT NULL,
	behaviour type_behaviour NOT NULL,
	health SMALLINT NOT NULL CHECK (health > 0),
	speed_move REAL CHECK (speed_move >= 0),
	speed_attack REAL CHECK (speed_attack >= 0),
	strength_attack SMALLINT CHECK (strength_attack > 0),
	description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Structures
(
	structure_id SERIAL PRIMARY KEY,
	structure_type VARCHAR(32) NOT NULL,
	structure_name VARCHAR(32) NOT NULL,
	description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Biome
(
	biome_id SERIAL PRIMARY KEY,
	biome_name VARCHAR(32) NOT NULL,
	biome_location type_biome NOT NULL,
	spread REAL NOT NULL CHECK (spread BETWEEN 0.1 AND 100),
	description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS FeatureSkill
(
	feature_id SERIAL PRIMARY KEY,
	feature_skill TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS GameCharacter
(
	character_id SERIAL PRIMARY KEY,
	character_name VARCHAR(32) NOT NULL,
	max_health SMALLINT NOT NULL CHECK (max_health > 0),
	max_hunger SMALLINT NOT NULL CHECK (max_hunger > 0),
	max_sanity SMALLINT NOT NULL CHECK (max_sanity > 0),
	speed_move REAL NOT NULL CHECK (speed_move >= 0),
	strength_attack REAL NOT NULL CHECK (strength_attack >= 0),
	description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Events 
(
	event_id SERIAL PRIMARY KEY,
	event_name VARCHAR(32) NOT NULL,
	description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Season
(
	season_id SERIAL PRIMARY KEY,
	season_name VARCHAR(32) NOT NULL,
	quantity_of_days SMALLINT NOT NULL CHECK (quantity_of_days BETWEEN 1 AND 20),
	weather type_weather NOT NULL,
	description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ItemToItemType
(
	item_id INTEGER NOT NULL REFERENCES Item(item_id),
	item_type_id INTEGER NOT NULL REFERENCES ItemsTypes(item_type_id),
	PRIMARY KEY (item_id, item_type_id)
);

CREATE TABLE IF NOT EXISTS CharacterFeature
(
	feature_id INTEGER NOT NULL REFERENCES FeatureSkill(feature_id),
	character_id INTEGER NOT NULL REFERENCES GameCharacter(character_id),
	PRIMARY KEY (feature_id, character_id)
);

CREATE TABLE IF NOT EXISTS CreatureDrop
(
	creature_id INTEGER NOT NULL REFERENCES Creature(creature_id),
	item_id INTEGER NOT NULL REFERENCES Item(item_id),
	quantity_of_resources SMALLINT NOT NULL,
	PRIMARY KEY (creature_id, item_id)
);

CREATE TABLE IF NOT EXISTS StartItem 
(
	character_id INTEGER NOT NULL REFERENCES GameCharacter(character_id),
	item_id INTEGER NOT NULL REFERENCES Item(item_id),
	quantity_of_resources SMALLINT NOT NULL,
	PRIMARY KEY (character_id, item_id)
);

CREATE TABLE IF NOT EXISTS ItemsInBiome 
(
	item_id INTEGER NOT NULL REFERENCES Item(item_id),
	biome_id INTEGER NOT NULL REFERENCES Biome(biome_id),
	PRIMARY KEY (biome_id, item_id)
);

CREATE TABLE IF NOT EXISTS CreatureForSeason 
(
	creature_id INTEGER NOT NULL REFERENCES Creature(creature_id),
	season_id INTEGER NOT NULL REFERENCES Season(season_id),
	PRIMARY KEY (creature_id, season_id)
);

CREATE TABLE IF NOT EXISTS EventForSeason 
(
	event_id INTEGER NOT NULL REFERENCES Events(event_id),
	season_id INTEGER NOT NULL REFERENCES Season(season_id),
	PRIMARY KEY (event_id, season_id)
);

CREATE TABLE IF NOT EXISTS SummonCreature 
(
	event_id INTEGER NOT NULL REFERENCES Events(event_id),
	creature_id INTEGER NOT NULL REFERENCES Creature(creature_id),
	PRIMARY KEY (event_id, creature_id)
);

CREATE TABLE IF NOT EXISTS CreatureBiome
(
	biome_id INTEGER NOT NULL REFERENCES Biome(biome_id),
	creature_id INTEGER NOT NULL REFERENCES Creature(creature_id),
	PRIMARY KEY (biome_id, creature_id)
);

CREATE TABLE IF NOT EXISTS BiomeStructure
(
	structure_id INTEGER NOT NULL REFERENCES Structures(structure_id),
	biome_id INTEGER NOT NULL REFERENCES Biome(biome_id),
	PRIMARY KEY (structure_id, biome_id)
);

CREATE TABLE IF NOT EXISTS StructureEvent 
(
	event_id INTEGER NOT NULL REFERENCES Events(event_id),
	structure_id INTEGER NOT NULL REFERENCES Structures(structure_id),
	PRIMARY KEY (event_id, structure_id)
);

CREATE TABLE IF NOT EXISTS StructureCreature
(
	creature_id INTEGER NOT NULL REFERENCES Creature(creature_id),
	structure_id INTEGER NOT NULL REFERENCES Structures(structure_id),
	quantity_of_creatures SMALLINT NOT NULL,
	PRIMARY KEY (creature_id, structure_id)
);

INSERT INTO ItemsTypes (item_type_name) VALUES
('Голова'),
('Тіло'),
('Рука'),
('Ресурс'),
('Будівельний'),
('Їжа'),
('Зброя');

INSERT INTO Item (item_name, max_stack, durability, recipe_id, description) VALUES
('Зимова шапка', 1, 100, 1, 'Одяг. Екіпірується на голову. Втрачає 100% міцності за 10 днів.'),
('Пухкий желет', 1, 100, 2, 'Одяг. Екіпірується на тіло. Втрачає 100% міцності за 15 днів.'),
('Спис', 1, 100, 3, 'Зброя. Екіпірується в руку. Втрачає 100% міцності за 150 атак.'),
('Зрізана трава', 40, NULL, NULL, 'Ресурс - зрізана трава. Використовується для крафту. Не має міцності.'),
('Павутина', 40, NULL, NULL, 'Ресурс - павутина. Використовується для крафту. Не має міцності.'),
('Паркан', 20, 1, 4, 'Будівельний інструмент. Можна розташувати на поверхні. Не має міцності.'),
('Сокира', 1, 100, 5, 'Зброя/інструмент. Екіпірується в руку. Втрачає 100% міцності за 100 ударів.'),
('Міні-робот', 1, NULL, 6, 'Робот, що лежить в інвентарі WX-78 при появі в сіті.'),
('Хутро біфало', 40, NULL, NULL, 'Хутро біфало. Випадає після бриття або вбивства біфало.'),
('Маленьке м''ясо', 40, NULL, NULL, 'Маленьке м''ясо. Випадає після вбивства кроликів.'),
('Монстро м''ясо', 40, NULL, NULL, 'Монстро м''ясо. Випадає після вбивства біфало або свина-перевертня.'),
('Велике м''ясо', 40, NULL, NULL, 'Велике м''ясо. Випадає після вбивства павука-воїна чи гончої.'),
('Берет', 1, 100, 7, 'Одяг. Екіпірується на голову. Відновлює розум, коли одягнутий.');

INSERT INTO Creature (creature_name, behaviour, health, speed_move, speed_attack, strength_attack, description) VALUES
('Павук-воїн', 'HOSTILE', 400, 4, 4, 20, 'Павук-воїн. Монстр. Вилазить з кокона.'),
('Свин-перевертень', 'HOSTILE', 525, 4, 5, 34, 'Свин перевертень. Поява під час повнолуння, якщо не встиг сховатись.'),
('Біфало', 'NEUTRAL', 1000, 1.5, 4, 34, 'Біфало. Живе в савані. Мешкає зі стадом.'),
('Індик', 'PASSIVE', 50, 3, NULL, NULL, 'Індик. Пасивний, але краде ягоди. Місце появи - ягідний кущ.'),
('Гонча', 'PASSIVE', 150, 6, 4, 20, 'Гонча. Часто влаштовують набіги на персонажів.'),
('Кролик', 'PASSIVE', 25, 5, NULL, NULL, 'Маленький кролик. Можна зловити в трав''яну пастку. Після вбивства випадає мале м''ясо.');

INSERT INTO Structures (structure_type, structure_name, description) VALUES 
('Стіна', 'Тулецитова стіна', 'Стіна зроблена з тулециту. Має до 800 хп.'),
('Стіна', 'Місячна стіна', 'Стіна зроблена з місячного каменю. Має до 1600 хп.'),
('Станція', 'Алхімічний двигун', 'Станція для вивчення просунутих рецептів.'),
('Пастка', 'Скриня-пастка', 'Скриня, що викликає підпал навколишніх предметів з ймовіріністю 50%.'),
('Пастка', 'Обманка-лігво', 'Лігво, що при наближенні викликає гончіх.');

INSERT INTO Biome (biome_name, biome_location, spread, description) VALUES 
('Савана', 'EARTH', 10, 'Біом савани. Містить багато трави та стада біфало.'),
('Ліс', 'EARTH', 20, 'Лісний біом. Містить багато ялинок.'),
('Лабіринт', 'CAVE', 5, 'Біом лабіринту. В ньому знаходиться Древній страж.');

INSERT INTO FeatureSkill (feature_skill) VALUES
('Відрощує розкішну бороду'),
('Отримує шкоду від води'),
('Робот'),
('Має слабшу атаку'),
('Має сестру-привида'),
('Повільніше втрачає розум в темряві'),
('Монстр, тому його не люблять мирні істоти'),
('Друг павуків');

INSERT INTO GameCharacter (character_name, max_health, max_hunger, max_sanity, speed_move, strength_attack, description) VALUES 
('Вілсон', 150, 150, 200, 5, 10, 'Вілсон. Чудовий базовий персонаж з посередніми шансами на виживання'),
('WX-78', 125, 125, 125, 5, 10, 'Робот, що страждає від води, але може заряжатись різними чіпами.'),
('Венді', 150, 150, 200, 5, 7.5, 'Дівчинка Венді, що втратила сестру, але має її привида з собою. Слабша атака. Зменшена втрата розуму в темряві.');

INSERT INTO Events (event_name, description) VALUES 
('Пожежа', 'Пожежа викликана подіями або природніми підпалами впродовж літа.'),
('Повнолуння', 'Повнолуння виникає кожні 21 день.'),
('Дощ', 'Дощ викликканий сезонними подіями або після взаємодії з проклятими структурами.');

INSERT INTO Season (season_name, quantity_of_days, weather, description) VALUES 
('Літо', 16, 'SUN', 'Літо. Навколо спека, сонце, підпали та унікальні літні істоти.'),
('Зима', 16, 'SNOW', 'Зима. Часті снігопади, нові істоти, сезонний бос.'),
('Весна', 20, 'LIGHT', 'Весна. Сезон повний дощів та блискавок.'),
('Осінь', 20, 'SUN', 'Осінь. Найспокійніша пора року.'); 

INSERT INTO ItemToItemType (item_id, item_type_id) VALUES 
(1, 1),
(2, 2),
(3, 3),
(3, 7),
(4, 4),
(5, 4),
(6, 5),
(7, 3),
(7, 7),
(8, 5),
(9, 4),
(10, 6),
(11, 6),
(12, 6),
(12, 4),
(13, 1);

INSERT INTO CharacterFeature VALUES 
(1, 1),
(2, 2),
(3, 2),
(4, 3),
(5, 3),
(6, 3);

INSERT INTO CreatureDrop VALUES 
(1, 5, 2),
(3, 9, 4),
(6, 10, 1),
(1, 11, 1),
(3, 12, 4),
(5, 11, 1),
(2, 12, 2);

INSERT INTO StartItem VALUES 
(1, 8, 1);

INSERT INTO ItemsInBiome VALUES 
(4, 2);

INSERT INTO CreatureForSeason VALUES 
(4, 1),
(4, 3);

INSERT INTO EventForSeason VALUES 
(1, 1);

INSERT INTO SummonCreature VALUES
(2, 2);

INSERT INTO CreatureBiome VALUES 
(1, 3),
(2, 1),
(1, 6),
(2, 4),
(2, 5),
(2, 2);

INSERT INTO BiomeStructure VALUES 
(1, 3);

INSERT INTO StructureEvent VALUES 
(1, 4);

INSERT INTO StructureCreature VALUES 
(5, 5, 2);
