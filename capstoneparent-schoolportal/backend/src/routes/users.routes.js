const express = require("express");
const { body, param } = require("express-validator");
const usersController = require("../controllers/users.controller");
const validate = require("../middlewares/validation");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all users (Admin only)
router.get("/", authorize("Admin", "Principal"), usersController.getAllUsers);

// Get user by ID
router.get("/:id", param("id").isInt(), validate, usersController.getUserById);

// Update user
router.put(
  "/:id",
  [
    param("id").isInt(),
    body("fname").optional().trim(),
    body("lname").optional().trim(),
    body("contact_num").optional(),
    body("address").optional(),
  ],
  validate,
  usersController.updateUser,
);

// Update user status (Admin only)
router.patch(
  "/:id/status",
  authorize("Admin", "Principal"),
  [param("id").isInt(), body("account_status").isIn(["Active", "Inactive"])],
  validate,
  usersController.updateUserStatus,
);

// Bulk replace all roles for a user (Admin, Principal only)
// Accepts a full roles array and replaces the user's current roles in one shot
router.put(
  "/:id/roles",
  authorize("Admin", "Principal"),
  [
    param("id").isInt(),
    body("roles")
      .isArray({ min: 1 })
      .withMessage("roles must be a non-empty array"),
    body("roles.*")
      .isIn([
        "Parent",
        "Librarian",
        "Teacher",
        "Admin",
        "Principal",
        "Vice_Principal",
      ])
      .withMessage(
        "Each role must be one of: Parent, Librarian, Teacher, Admin, Principal, Vice_Principal",
      ),
  ],
  validate,
  usersController.updateRoles,
);

// Assign a single role (Admin, Principal only)
router.post(
  "/:id/roles",
  authorize("Admin", "Principal"),
  [
    param("id").isInt(),
    body("role").isIn([
      "Parent",
      "Librarian",
      "Teacher",
      "Admin",
      "Principal",
      "Vice_Principal",
    ]),
  ],
  validate,
  usersController.assignRole,
);

// Remove a single role (Admin, Principal only)
router.delete(
  "/:id/roles/:roleId",
  authorize("Admin", "Principal"),
  [param("id").isInt(), param("roleId").isInt()],
  validate,
  usersController.removeRole,
);

module.exports = router;
