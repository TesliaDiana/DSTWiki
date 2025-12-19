const asyncHandler = require("../utils/asyncHandler");
const eventService = require("../services/eventsService");

class EventController {
  async createEvent(req, res) {
    const {
      eventName,
      description,
      seasonIds,
      structureIds,
      summonCreatures,
    } = req.body;

    const event = await eventService.createEvent({
      eventName,
      description,
      seasonIds,
      structureIds,
      summonCreatures,
    });

    res.status(201).json({
      message: "Подію створено",
      event,
    });
  }

  async getAllEvents(req, res) {
    const data = await eventService.getAllEvents();
    res.status(200).json(data);
  };

  async getEventById(req, res) {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    if (!event) { 
      res.status(404); 
      throw new Error("Подію не знайдено"); 
    }
    res.status(200).json(event);
  };

  async updateEvent(req, res) {
    const { id } = req.params;
    const updatedEvent = await eventService.updateEvent(id, req.body);
    res.status(200).json({ 
      message: "Подію оновлено", 
      event: updatedEvent 
    });
  };

  async deleteEvent(req, res, next) {
    try {
      const id = Number(req.params.id);
      await eventService.deleteEvent(id);
      res.status(204).end();
    } catch (err) {
      res.status(409);     
      next(err);           
    }
  };
}

module.exports = new EventController();
