const express = require("express");
const { body, param, query } = require("express-validator");
const studentsController = require("../controllers/students.controller");
const validate = require("../middlewares/validation");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all students
router.get(
  "/",
  authorize("Teacher", "Admin", "Principal", "Vice_Principal"),
  [
    query("status")
      .optional()
      .isIn(["ENROLLED", "GRADUATED", "TRANSFERRED", "DROPPED", "SUSPENDED"]),
    query("grade_level").optional().isInt(),
    query("syear_start").optional().isInt(),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  studentsController.getAllStudents,
);

// Get student by ID
router.get(
  "/:id",
  param("id").isInt(),
  validate,
  studentsController.getStudentById,
);

// Create student (Admin, Principal, Vice Principal only)
router.post(
  "/",
  authorize("Admin", "Principal", "Vice_Principal"),
  [
    body("fname").notEmpty().trim(),
    body("lname").notEmpty().trim(),
    body("sex").isIn(["Male", "Female"]),
    body("lrn_number").notEmpty(),
    body("gl_id").isInt(),
    body("syear_start").isInt({ min: 2000, max: 2100 }),
    body("syear_end").isInt({ min: 2000, max: 2100 }),
  ],
  validate,
  studentsController.createStudent,
);

// Update student
router.put(
  "/:id",
  authorize("Admin", "Principal", "Vice_Principal", "Teacher"),
  [
    param("id").isInt(),
    body("fname").optional().trim(),
    body("lname").optional().trim(),
    body("sex").optional().isIn(["Male", "Female"]),
    body("lrn_number").optional(),
    body("syear_start").optional().isInt({ min: 2000, max: 2100 }),
    body("syear_end").optional().isInt({ min: 2000, max: 2100 }),
    body("status")
      .optional()
      .isIn(["ENROLLED", "GRADUATED", "TRANSFERRED", "DROPPED", "SUSPENDED"]),
  ],
  validate,
  studentsController.updateStudent,
);

// Delete student
router.delete(
  "/:id",
  authorize("Admin", "Principal"),
  param("id").isInt(),
  validate,
  studentsController.deleteStudent,
);

// Get student grades
router.get(
  "/:id/grades",
  param("id").isInt(),
  validate,
  studentsController.getStudentGrades,
);

// Get student attendance
router.get(
  "/:id/attendance",
  param("id").isInt(),
  validate,
  studentsController.getStudentAttendance,
);

module.exports = router;
