const eventService = require("../services/eventService");
const asyncHandler = require("../utils/asyncHandler");

class EventController {
  createEvent = asyncHandler(async (req, res) => {
    const { event_name, description } = req.body;
    if (!event_name) { res.status(400); throw new Error("Назва події обов'язкова"); }

    const newEvent = await eventService.createEvent({ event_name, description });
    res.status(201).json({ message: "Подію створено", event: newEvent });
  });

  getAllEvents = asyncHandler(async (req, res) => {
    const events = await eventService.getAllEvents({ include: { eventForSeason: { include: { season: true } }, structureEvent: { include: { structure: true } } } });
    res.json(events);
  });

  getEventById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await eventService.getEventById(Number(id), { include: { eventForSeason: { include: { season: true } }, structureEvent: { include: { structure: true } } } });
    if (!event) { res.status(404); throw new Error("Подію не знайдено"); }
    res.json(event);
  });

  updateEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedEvent = await eventService.updateEvent(Number(id), req.body);
    res.json({ message: "Подію оновлено", event: updatedEvent });
  });

  deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await eventService.deleteEvent(Number(id));
    res.status(204).end();
  });
}

module.exports = new EventController();
