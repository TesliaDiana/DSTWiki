const express = require("express");
const cors = require("cors");
const path = require("path");

// Routes
const creatureRoutes = require("./routes/creatureRoutes");
const biomeRoutes = require("./routes/biomeRoutes");
const structureRoutes = require("./routes/structureRoutes");
const seasonRoutes = require("./routes/seasonRoutes");
const itemRoutes = require("./routes/itemRoutes");
const itemTypeRoutes = require("./routes/itemTypeRoutes");
const creatureDropRoutes = require("./routes/creatureDropRoutes");
const itemsInBiomeRoutes = require("./routes/itemsInBiomeRoutes");
const itemToItemTypeRoutes = require("./routes/itemToItemTypeRoutes");
const eventRoutes = require("./routes/eventRoutes");
const gameCharacterRoutes = require("./routes/gameCharacterRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Simple logging
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/creatures", creatureRoutes);
app.use("/api/biomes", biomeRoutes);
app.use("/api/structures", structureRoutes);
app.use("/api/seasons", seasonRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/item-types", itemTypeRoutes);
app.use("/api/creature-drops", creatureDropRoutes);
app.use("/api/items-in-biomes", itemsInBiomeRoutes);
app.use("/api/item-to-item-types", itemToItemTypeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/game-characters", gameCharacterRoutes);

// Health check
app.get("/health", async (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Serve static files (optional, якщо потрібні)
app.use(express.static(path.join(__dirname, "../public")));

// Global error handler
app.use(errorHandler);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
