const studentsService = require("../services/students.service");

const studentsController = {
  async getAllStudents(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        grade_level,
        syear_start,
      } = req.query; 
      const result = await studentsService.getAllStudents({
        page,
        limit,
        status,
        grade_level,
        syear_start, 
      });

      res.status(200).json({
        data: result.students,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  async getStudentById(req, res, next) {
    try {
      const { id } = req.params;
      const student = await studentsService.getStudentById(parseInt(id));
      res.status(200).json({
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  async createStudent(req, res, next) {
    try {
      const studentData = req.body;
      const student = await studentsService.createStudent(studentData);
      res.status(201).json({
        message: "Student created successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStudent(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const student = await studentsService.updateStudent(
        parseInt(id),
        updateData,
      );
      res.status(200).json({
        message: "Student updated successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteStudent(req, res, next) {
    try {
      const { id } = req.params;
      await studentsService.deleteStudent(parseInt(id));
      res.status(200).json({
        message: "Student deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async getStudentGrades(req, res, next) {
    try {
      const { id } = req.params;
      const grades = await studentsService.getStudentGrades(parseInt(id));
      res.status(200).json({
        data: grades,
      });
    } catch (error) {
      next(error);
    }
  },

  async getStudentAttendance(req, res, next) {
    try {
      const { id } = req.params;
      const attendance = await studentsService.getStudentAttendance(
        parseInt(id),
      );
      res.status(200).json({
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = studentsController;
