//для post
http://localhost:3000/api/creatures
{
  "creatureName": "Тестова істота",
  "behaviour": "NEUTRAL",
  "health": 100,
  "description": "Це тестова істота"
}

{
  "creatureName": "Вогняний Дракон",
  "behaviour": "HOSTILE",
  "health": 300,
  "speedMove": 3.5,
  "speedAttack": 5,
  "strengthAttack": 50,
  "description": "Великий агресивний дракон",
  "biomes": [2, 3],
  "drops": [
    {
      "itemId": 1,
      "quantity": 10,
      "chance": 70
    },
    {
      "itemId": 2,
      "quantity": 5,
      "chance": 50
    }
  ]
}

//для getAll
http://localhost:3000/api/creatures

//для getId
http://localhost:3000/api/creatures/1

//для post зі зв'язуючими таблицями
{
  "creatureName": "Оновлена Істота",
  "behaviour": "HOSTILE",
  "health": 120,
  "speedMove": 3.0,
  "speedAttack": 1.5,
  "strengthAttack": 20,
  "description": "Істота оновлена з новими біомами та дропами",
  "biomes": [1],    // новий масив біомів
  "drops": [
    { "itemId": 2, "quantity": 3, "chance": 40 }
  ]
}
  

{
  "creatureName": "Вогняний Дракон",
  "behaviour": "HOSTILE",
  "health": 300,
  "speedMove": 3.5,
  "speedAttack": 5,
  "strengthAttack": 50,
  "description": "Великий агресивний дракон",
  "biomes": [1, 2],
  "drops": [
    {
      "itemId": 1,
      "quantity": 10,
      "chance": 70
    },
    {
      "itemId": 2,
      "quantity": 5,
      "chance": 50
    },
    {
      "itemId": 3,
      "quantity": 5,
      "chance": 50
    }
  ]
}
