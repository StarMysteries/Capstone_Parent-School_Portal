const express = require("express");
const { body, param, query } = require("express-validator");
const multer = require("multer");
const eventsController = require("../controllers/events.controller");
const validate = require("../middlewares/validation");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();
const upload = multer({
  dest: process.env.UPLOAD_PATH || "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 50 * 1024 * 1024,
  },
});

// Public route - get all events
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  eventsController.getAllEvents,
);

// Public route - get event by ID
router.get(
  "/:id",
  param("id").isInt(),
  validate,
  eventsController.getEventById,
);

// Protected routes
router.use(authenticate);

// Create event (Admin, Principal, Vice Principal only)
router.post(
  "/",
  authorize("Admin", "Principal"),
  upload.single("asset"),
  [
    body("event_title").notEmpty().trim(),
    body("event_desc").optional(),
    body("event_date").optional().isISO8601(),
  ],
  validate,
  eventsController.createEvent,
);

// Update event
router.put(
  "/:id",
  authorize("Admin", "Principal"),
  upload.single("asset"),
  [
    param("id").isInt(),
    body("event_title").optional().trim(),
    body("event_desc").optional(),
    body("event_date").optional().isISO8601(),
  ],
  validate,
  eventsController.updateEvent,
);

// Delete event
router.delete(
  "/:id",
  authorize("Admin", "Principal"),
  param("id").isInt(),
  validate,
  eventsController.deleteEvent,
);

module.exports = router;
