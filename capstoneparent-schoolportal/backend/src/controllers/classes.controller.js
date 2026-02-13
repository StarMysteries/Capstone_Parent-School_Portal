const classesService = require('../services/classes.service');

const classesController = {
  async getAllClasses(req, res, next) {
    try {
      const { page = 1, limit = 10, school_year, grade_level } = req.query;
      const result = await classesService.getAllClasses({
        page,
        limit,
        school_year,
        grade_level
      });

      res.status(200).json({
        data: result.classes,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  },

  async getClassById(req, res, next) {
    try {
      const { id } = req.params;
      const classData = await classesService.getClassById(parseInt(id));
      res.status(200).json({
        data: classData
      });
    } catch (error) {
      next(error);
    }
  },

  async createClass(req, res, next) {
    try {
      const classData = req.body;
      const newClass = await classesService.createClass(classData);
      res.status(201).json({
        message: 'Class created successfully',
        data: newClass
      });
    } catch (error) {
      next(error);
    }
  },

  async updateClass(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedClass = await classesService.updateClass(parseInt(id), updateData);
      res.status(200).json({
        message: 'Class updated successfully',
        data: updatedClass
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteClass(req, res, next) {
    try {
      const { id } = req.params;
      await classesService.deleteClass(parseInt(id));
      res.status(200).json({
        message: 'Class deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async addSubjectToClass(req, res, next) {
    try {
      const { id } = req.params;
      const subjectData = req.body;
      
      const subject = await classesService.addSubjectToClass(parseInt(id), subjectData);
      res.status(201).json({
        message: 'Subject added to class successfully',
        data: subject
      });
    } catch (error) {
      next(error);
    }
  },

  async getClassSubjects(req, res, next) {
    try {
      const { id } = req.params;
      const subjects = await classesService.getClassSubjects(parseInt(id));
      res.status(200).json({
        data: subjects
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStudentGrades(req, res, next) {
    try {
      const { subjectId, studentId } = req.params;
      const gradesData = req.body;

      const grades = await classesService.updateStudentGrades({
        subject_id: parseInt(subjectId),
        student_id: parseInt(studentId),
        ...gradesData
      });

      res.status(200).json({
        message: 'Grades updated successfully',
        data: grades
      });
    } catch (error) {
      next(error);
    }
  },

  async updateAttendance(req, res, next) {
    try {
      const { studentId } = req.params;
      const attendanceData = {
        student_id: parseInt(studentId),
        ...req.body
      };

      const attendance = await classesService.updateAttendance(attendanceData);
      res.status(200).json({
        message: 'Attendance updated successfully',
        data: attendance
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = classesController;