const announcementsService = require('../services/announcements.service');

const announcementsController = {
  async getAllAnnouncements(req, res, next) {
    try {
      const { page = 1, limit = 10, type } = req.query;
      const userRoles = req.user.roles.map(r => r.role);
      
      const result = await announcementsService.getAllAnnouncements({
        page,
        limit,
        type,
        userRoles
      });

      res.status(200).json({
        data: result.announcements,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  },

  async getAnnouncementById(req, res, next) {
    try {
      const { id } = req.params;
      const announcement = await announcementsService.getAnnouncementById(parseInt(id));
      res.status(200).json({
        data: announcement
      });
    } catch (error) {
      next(error);
    }
  },

  async createAnnouncement(req, res, next) {
    try {
      const announcementData = {
        ...req.body,
        announced_by: req.user.user_id
      };

      const announcement = await announcementsService.createAnnouncement(announcementData);
      res.status(201).json({
        message: 'Announcement created successfully',
        data: announcement
      });
    } catch (error) {
      next(error);
    }
  },

  async updateAnnouncement(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const announcement = await announcementsService.updateAnnouncement(
        parseInt(id),
        updateData
      );

      res.status(200).json({
        message: 'Announcement updated successfully',
        data: announcement
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteAnnouncement(req, res, next) {
    try {
      const { id } = req.params;
      await announcementsService.deleteAnnouncement(parseInt(id));
      res.status(200).json({
        message: 'Announcement deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = announcementsController;