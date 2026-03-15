const express = require("express");
const { body, param, query } = require("express-validator");
const eventsController = require("../controllers/events.controller");
const validate = require("../middlewares/validation");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

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
  authorize("Admin", "Principal", "Vice_Principal"),
  [
    body("event_title").notEmpty().trim(),
    body("event_desc").optional(),
    body("event_date").isISO8601(),
    body("photo_path").notEmpty(),
  ],
  validate,
  eventsController.createEvent,
);

// Update event
router.put(
  "/:id",
  authorize("Admin", "Principal", "Vice_Principal"),
  [
    param("id").isInt(),
    body("event_title").optional().trim(),
    body("event_desc").optional(),
    body("event_date").optional().isISO8601(),
    body("photo_path").optional(),
  ],
  validate,
  eventsController.updateEvent,
);

// Delete event
router.delete(
  "/:id",
  authorize("Admin", "Principal", "Vice_Principal"),
  param("id").isInt(),
  validate,
  eventsController.deleteEvent,
);

module.exports = router;
