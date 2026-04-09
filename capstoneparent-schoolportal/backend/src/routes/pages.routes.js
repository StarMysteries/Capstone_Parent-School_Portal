const express = require('express');
const { body, param } = require('express-validator');
const multer = require("multer");

const pagesController = require('../controllers/pages.controller');
const validate = require('../middlewares/validation');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();
const upload = multer({ dest: process.env.UPLOAD_PATH || "uploads/" });

router.get('/contact-us', pagesController.getContactUs);
router.put('/contact-us', 
  authenticate,
  authorize('Admin'),
  [
    body('principalOffice').optional().isString(),
    body('libraryOffice').optional().isString(),
    body('facultyOffice').optional().isString(),
    body('facebookPageLabel').optional().isString(),
    body('facebookPageUrl').optional().isURL(),
    body('mapEmbedUrl').optional().isString()
  ],
  validate,
  pagesController.updateContactUs
);

router.get('/history', pagesController.getHistory);
router.put('/history', 
  authenticate,
  authorize('Admin'),
  upload.single('asset'),
  [
    body('title').optional().isString(),
    body('body').optional().isString(),
  ],
  validate,
  pagesController.updateHistory
);

router.get('/transparency', pagesController.getTransparency);
router.put('/transparency', 
  authenticate,
  authorize('Admin'),
  upload.single('asset'),
  pagesController.updateTransparency
);

router.get('/school-calendar', pagesController.getSchoolCalendars);
router.put('/school-calendar',
  authenticate,
  authorize('Admin'),
  upload.single('asset'),
  [
    body('year').notEmpty().isString(),
    body('label').optional().isString()
  ],
  validate,
  pagesController.updateSchoolCalendar
);

router.get('/org-chart', pagesController.getOrgCharts);
router.put('/org-chart',
  authenticate,
  authorize('Admin'),
  upload.single('asset'),
  [
    body('year').notEmpty().isString()
  ],
  validate,
  pagesController.updateOrgChart
);

module.exports = router;
