const express = require('express');
const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const announcementsRoutes = require('./announcements.routes');
const eventsRoutes = require('./events.routes');
const studentsRoutes = require('./students.routes');
const parentsRoutes = require('./parents.routes');
const classesRoutes = require('./classes.routes');
const libraryRoutes = require('./library.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/announcements', announcementsRoutes);
router.use('/events', eventsRoutes);
router.use('/students', studentsRoutes);
router.use('/parents', parentsRoutes);
router.use('/classes', classesRoutes);
router.use('/library', libraryRoutes);

module.exports = router;