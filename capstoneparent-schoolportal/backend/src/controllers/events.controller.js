const eventsService = require("../services/events.service");

const eventsController = {
  async getAllEvents(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await eventsService.getAllEvents({ page, limit });

      res.status(200).json({
        data: result.events,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  async getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const event = await eventsService.getEventById(parseInt(id));

      res.status(200).json({
        data: event,
      });
    } catch (error) {
      if (error.message === "Event not found") {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },

  async createEvent(req, res, next) {
    try {
      const eventData = {
        ...req.body,
        created_by: req.user.user_id,
        file: req.file,
      };

      const event = await eventsService.createEvent(eventData);

      res.status(201).json({
        message: "Event created successfully",
        data: event,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },

  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        file: req.file,
      };

      const event = await eventsService.updateEvent(parseInt(id), updateData);

      res.status(200).json({
        message: "Event updated successfully",
        data: event,
      });
    } catch (error) {
      if (error.message === "Event not found") {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },

  async deleteEvent(req, res, next) {
    try {
      const { id } = req.params;
      await eventsService.deleteEvent(parseInt(id));

      res.status(200).json({
        message: "Event deleted successfully",
      });
    } catch (error) {
      if (error.message === "Event not found") {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },
};

module.exports = eventsController;
