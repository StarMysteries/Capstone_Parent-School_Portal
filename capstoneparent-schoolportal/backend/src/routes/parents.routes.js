const express = require("express");
const { body, param, query } = require("express-validator");
const parentsController = require("../controllers/parents.controller");
const prisma = require("../config/database");
const validate = require("../middlewares/validation");
const { authenticate, authorize } = require("../middlewares/auth");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Parent-facing routes should only be accessible after their registration has
// been verified by staff. Admin/teacher review routes remain available below.
const requireVerifiedParentRegistration = async (req, res, next) => {
  try {
    const userRoles = (req.user.roles || []).map((r) => r.role);

    if (!userRoles.includes("Parent")) {
      return next();
    }

    if (req.user.account_status !== "Active") {
      return res.status(403).json({
        message: "Parent account is pending verification",
      });
    }

    const verifiedRegistration = await prisma.parentRegistration.findFirst({
      where: {
        parent_id: req.user.user_id,
        status: "VERIFIED",
      },
    });

    if (!verifiedRegistration) {
      return res.status(403).json({
        message: "Parent registration is pending verification",
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

// Submit parent registration (accept file uploads)
router.post(
  "/register",
  upload.array("attachments", 10),
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
  authorize("Admin", "Teacher", "Principal"),
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
  authorize("Admin", "Teacher", "Principal"),
  [
    param("id").isInt(),
    body("status").isIn(["VERIFIED", "DENIED"]),
    body("remarks").optional(),
  ],
  validate,
  parentsController.verifyRegistration,
);

// Get my children (for parents)
router.get("/my-children", requireVerifiedParentRegistration, parentsController.getMyChildren);

// Get child grades
router.get(
  "/children/:studentId/grades",
  requireVerifiedParentRegistration,
  param("studentId").isInt(),
  validate,
  parentsController.getChildGrades,
);

// Get child attendance
router.get(
  "/children/:studentId/attendance",
  requireVerifiedParentRegistration,
  param("studentId").isInt(),
  validate,
  parentsController.getChildAttendance,
);

module.exports = router;
