const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  getInstructorCoursesForAttendance,
  getCourseStudentsForAttendance,
  getAttendanceByDate,
  submitAttendance,
  getAttendanceReports,
  getCourseAttendanceStats,
} = require('../controllers/attendanceController');

// Instructor routes
router.get('/courses', authenticate, authorizeRoles('instructor', 'admin'), getInstructorCoursesForAttendance);
router.get('/courses/:courseId/students', authenticate, authorizeRoles('instructor', 'admin'), getCourseStudentsForAttendance);
router.get('/courses/:courseId', authenticate, authorizeRoles('instructor', 'admin'), getAttendanceByDate);
router.post('/mark', authenticate, authorizeRoles('instructor', 'admin'), submitAttendance);
router.get('/courses/:courseId/stats', authenticate, authorizeRoles('instructor', 'admin'), getCourseAttendanceStats);

// Admin routes
router.get('/instructor/:instructorId/courses', authenticate, authorizeRoles('admin'), getInstructorCoursesForAttendance);
router.get('/reports', authenticate, authorizeRoles('instructor', 'admin'), getAttendanceReports);

module.exports = router;