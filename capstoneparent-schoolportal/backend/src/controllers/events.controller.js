const eventsService = require('../services/events.service');

const eventsController = {
  async getAllEvents(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await eventsService.getAllEvents({ page, limit });
      
      res.status(200).json({
        data: result.events,
        pagination: result.pagination
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
        data: event
      });
    } catch (error) {
      next(error);
    }
  },

  async createEvent(req, res, next) {
    try {
      const eventData = {
        ...req.body,
        created_by: req.user.user_id
      };

      const event = await eventsService.createEvent(eventData);
      res.status(201).json({
        message: 'Event created successfully',
        data: event
      });
    } catch (error) {
      next(error);
    }
  },

  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const event = await eventsService.updateEvent(parseInt(id), updateData);
      res.status(200).json({
        message: 'Event updated successfully',
        data: event
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteEvent(req, res, next) {
    try {
      const { id } = req.params;
      await eventsService.deleteEvent(parseInt(id));
      res.status(200).json({
        message: 'Event deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = eventsController;