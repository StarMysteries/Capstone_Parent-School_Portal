const express = require('express');
const { body, param, query } = require('express-validator');
const classesController = require('../controllers/classes.controller');
const validate = require('../middlewares/validation');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all class lists
router.get('/',
  authorize('Teacher', 'Admin', 'Principal', 'Vice_Principal'),
  [
    query('school_year').optional().isInt(),
    query('grade_level').optional().isInt(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validate,
  classesController.getAllClasses
);

// Get class by ID
router.get('/:id',
  authorize('Teacher', 'Admin', 'Principal', 'Vice_Principal'),
  param('id').isInt(),
  validate,
  classesController.getClassById
);

// Create class (Admin only)
router.post('/',
  authorize('Admin', 'Principal', 'Vice_Principal'),
  [
    body('gl_id').isInt(),
    body('section_id').isInt(),
    body('class_adviser').isInt(),
    body('syear_start').isInt({ min: 2000, max: 2100 }),
    body('syear_end').isInt({ min: 2000, max: 2100 }),
    body('class_sched').optional()
  ],
  validate,
  classesController.createClass
);

// Update class
router.put('/:id',
  authorize('Admin', 'Principal', 'Vice_Principal'),
  [
    param('id').isInt(),
    body('gl_id').optional().isInt(),
    body('section_id').optional().isInt(),
    body('class_adviser').optional().isInt(),
    body('class_sched').optional()
  ],
  validate,
  classesController.updateClass
);

// Delete class
router.delete('/:id',
  authorize('Admin', 'Principal'),
  param('id').isInt(),
  validate,
  classesController.deleteClass
);

// Add subject to class
router.post('/:id/subjects',
  authorize('Admin', 'Principal', 'Vice_Principal', 'Teacher'),
  [
    param('id').isInt(),
    body('subject_name').notEmpty(),
    body('time_start').matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body('time_end').matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body('subject_teacher').isInt()
  ],
  validate,
  classesController.addSubjectToClass
);

// Get class subjects
router.get('/:id/subjects',
  authorize('Teacher', 'Admin', 'Principal', 'Vice_Principal'),
  param('id').isInt(),
  validate,
  classesController.getClassSubjects
);

// Update student grades
router.put('/subjects/:subjectId/students/:studentId/grades',
  authorize('Teacher', 'Admin', 'Principal', 'Vice_Principal'),
  [
    param('subjectId').isInt(),
    param('studentId').isInt(),
    body('q1_grade').optional().isInt({ min: 0, max: 100 }),
    body('q2_grade').optional().isInt({ min: 0, max: 100 }),
    body('q3_grade').optional().isInt({ min: 0, max: 100 }),
    body('q4_grade').optional().isInt({ min: 0, max: 100 })
  ],
  validate,
  classesController.updateStudentGrades
);

// Update attendance
router.post('/students/:studentId/attendance',
  authorize('Teacher', 'Admin', 'Principal', 'Vice_Principal'),
  [
    param('studentId').isInt(),
    body('school_days').isInt({ min: 0 }),
    body('days_present').isInt({ min: 0 }),
    body('days_absent').isInt({ min: 0 }),
    body('month').isIn(['Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'])
  ],
  validate,
  classesController.updateAttendance
);

module.exports = router;