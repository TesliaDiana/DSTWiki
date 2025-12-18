const express = require("express");
const cors = require("cors");
const path = require("path");

const creatureRoutes = require("./routes/creatureRoutes");
const biomeRoutes = require("./routes/biomeRoutes");
const structureRoutes = require("./routes/structuresRoutes");
const seasonRoutes = require("./routes/seasonsRoutes");
const itemRoutes = require("./routes/itemRoutes");
const itemTypeRoutes = require("./routes/itemsTypesRoutes");
const eventRoutes = require("./routes/eventsRoutes");
const featureSkillRoutes = require("./routes/featureSkillRoutes");
const gameCharacterRoutes = require("./routes/gameCharacterRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url}`);
  next();
});

app.use("/api/creatures", creatureRoutes);
app.use("/api/biomes", biomeRoutes);
app.use("/api/structures", structureRoutes);
app.use("/api/seasons", seasonRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/item-types", itemTypeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/feature-skills", featureSkillRoutes);
app.use("/api/game-characters", gameCharacterRoutes);

app.get("/health", async (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.use(express.static(path.join(__dirname, "../public")));

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = { app };
