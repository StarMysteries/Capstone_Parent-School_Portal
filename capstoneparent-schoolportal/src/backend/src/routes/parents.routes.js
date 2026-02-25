const express = require("express");
const { body, param, query } = require("express-validator");
const parentsController = require("../controllers/parents.controller");
const validate = require("../middlewares/validation");
const { authenticate, authorize } = require("../middlewares/auth");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Submit parent registration (accept file uploads)
router.post(
  "/register",
  upload.array("files", 10),
  [
    body("student_ids").isArray({ min: 1 }),
    body("student_ids.*").isInt(),
    // files are handled via multipart form-data (req.files)
  ],
  validate,
  parentsController.submitRegistration,
);

// Get all parent registrations (Admin, Teacher only)
router.get(
  "/registrations",
  authorize("Admin", "Teacher", "Principal", "Vice_Principal"),
  [
    query("status").optional().isIn(["VERIFIED", "PENDING", "DENIED"]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  parentsController.getAllRegistrations,
);

// Get parent registration by ID
router.get(
  "/registrations/:id",
  param("id").isInt(),
  validate,
  parentsController.getRegistrationById,
);

// Verify parent registration (Admin, Teacher only)
router.patch(
  "/registrations/:id/verify",
  authorize("Admin", "Teacher", "Principal", "Vice_Principal"),
  [
    param("id").isInt(),
    body("status").isIn(["VERIFIED", "DENIED"]),
    body("remarks").optional(),
  ],
  validate,
  parentsController.verifyRegistration,
);

// Get my children (for parents)
router.get("/my-children", parentsController.getMyChildren);

// Get child grades
router.get(
  "/children/:studentId/grades",
  param("studentId").isInt(),
  validate,
  parentsController.getChildGrades,
);

// Get child attendance
router.get(
  "/children/:studentId/attendance",
  param("studentId").isInt(),
  validate,
  parentsController.getChildAttendance,
);

module.exports = router;
