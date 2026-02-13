const parentsService = require('../services/parents.service');

const parentsController = {
  async submitRegistration(req, res, next) {
    try {
      const { student_ids, file_ids } = req.body;
      const parent_id = req.user.user_id;

      const registration = await parentsService.submitRegistration({
        parent_id,
        student_ids,
        file_ids
      });

      res.status(201).json({
        message: 'Registration submitted successfully',
        data: registration
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllRegistrations(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const result = await parentsService.getAllRegistrations({
        page,
        limit,
        status
      });

      res.status(200).json({
        data: result.registrations,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  },

  async getRegistrationById(req, res, next) {
    try {
      const { id } = req.params;
      const registration = await parentsService.getRegistrationById(parseInt(id));
      res.status(200).json({
        data: registration
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyRegistration(req, res, next) {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;
      const verified_by = req.user.user_id;

      const registration = await parentsService.verifyRegistration({
        pr_id: parseInt(id),
        status,
        remarks,
        verified_by
      });

      res.status(200).json({
        message: 'Registration verified successfully',
        data: registration
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyChildren(req, res, next) {
    try {
      const parent_id = req.user.user_id;
      const children = await parentsService.getMyChildren(parent_id);
      res.status(200).json({
        data: children
      });
    } catch (error) {
      next(error);
    }
  },

  async getChildGrades(req, res, next) {
    try {
      const { studentId } = req.params;
      const parent_id = req.user.user_id;

      const grades = await parentsService.getChildGrades({
        parent_id,
        student_id: parseInt(studentId)
      });

      res.status(200).json({
        data: grades
      });
    } catch (error) {
      next(error);
    }
  },

  async getChildAttendance(req, res, next) {
    try {
      const { studentId } = req.params;
      const parent_id = req.user.user_id;

      const attendance = await parentsService.getChildAttendance({
        parent_id,
        student_id: parseInt(studentId)
      });

      res.status(200).json({
        data: attendance
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = parentsController;