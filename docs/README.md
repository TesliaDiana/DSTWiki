# Don't Starve Together wikipedia
---
## Опис проекту
Це простенька вікіпедія без frontend-у, але з можливістю додавати, змінювати, видаляти та знаходити дані про істот, біоми та інші об'єкти світу.

---
## Технологічний стек
Мова програмування:
    TypeScript, 
    Node.js

ORM / SQL Builder

    Prisma 6.19.1 — ORM для Node.js TypeScript
    PostgreSQL 

Фреймворк тестування

    Jest 30.2.0 — JavaScript фреймворк для тестування
    Supertest 7.1.4 — HTTP assertions для тестування API

Інші технології

    Docker та Docker Compose — для контейнеризації та оркестрації всіх сервісів (backend, PostgreSQL, тестова БД)
    Postman - для ручного посилання HTTP запитів 
---
## Інструкції з налаштування
Передумови

    Docker та Docker Compose встановлені на вашій системі
    Git для клонування репозиторію

Швидкий старт

    Клонування репозиторію

```git clone <https://github.com/TesliaDiana/DSTWiki.git>```

    Запуск всіх сервісів

```docker-compose up -d```
---
## Налаштування (додатково)
Параметри за замовчуванням в .env:
```
    PostgreSQL порт: 5432
    Користувач: postgres
    Пароль: password123
    База даних: DSTWiki
    Backend порт: 3000
```
Зупинка сервісів:

```docker-compose down```

Перезапуск сервісів:

```docker-compose restart```

Перебудова та запуск:

```docker-compose up -d --build```

Виконання міграцій вручну (якщо потрібно):

```docker-compose exec app npx prisma migrate deploy```
---
## Запуск тестів

ВАЖЛИВО: Перед запуском тестів потрібно підключитись до бази даних. Для цього виконайте:```docker-compose up -d```.
Запуск всіх тестів (Зайти в папку, яку клонували та зробити):

```npm test```
---
## Структура проєкту
```
project-root/
├── docs/                      # Документації
│   ├── README.md              # Головна документація (цей файл)
│   ├── schema.md              # Документація структури БД
│   ├── queries.md             # Документація запитів
├── img                        # Зображення
│   ├── ERDiagram.png          # Діаграма бази даних
├── src/                       # Вихідний код backend
│   ├── controllers             # Усі контроллери
│   ├── middleware              # Файл, з реагуванням на помилку
│   ├── routes                  # Усі перенапрявляння маршрутів
│   ├── services                # Сервіси для реакції на контроллери
│   ├── utils                   # handler
│   ├── app.js                  # Сервер, що піднімає backend базу
│   ├── prismaClient.js         # prisma клієнт
├── test                        # Тести
├── prisma/                     # Prisma схема та міграції
│   ├── schema.prisma           # Схема бази даних
│   └── migrations/             # Міграції бази даних
│   └── seed.js                 # Заповлення бази даних передбачуваними даними
├── node_modules                # Модулі, що встановлюються для роботи jest, node і іншого
├── docs/                       # Документація
│   ├── README.md              # Головна документація (цей файл)
│   ├── schema.md              # Документація структури БД
│   ├── queries.md             # Документація запитів
│   └── CONTRIBUTIONS.md       # Інструкції для контриб'юторів
├── docker-compose.yml         # Конфігурація Docker Compose
└── package.json               # Кореневий package.json
└── .env                       # Файл з DATAURL на базу
└── .gitignore                 # Файли, що ігноруються при публікації на Git
└── dataSQLWiki.sql            # sql зроблена база на основі schema.prisma
└── origin.env                 # Файл з DATAURL на головну базу
└── package-lock.json          # Встановлені модулі та інше
└── prisma.config.ts           # Налаштування prisma
```