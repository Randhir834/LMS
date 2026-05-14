const express = require('express');

const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  enrollCourse,
  getEnrollments,
  getEnrollmentById,
  checkEnrollment,
  getAllEnrollments,
} = require('../controllers/enrollmentController');

router.post('/', authenticate, enrollCourse);
router.get('/', authenticate, getEnrollments);
router.get('/check/:courseId', authenticate, checkEnrollment);
router.get('/all', authenticate, authorizeRoles('admin'), getAllEnrollments);
router.get('/:id', authenticate, getEnrollmentById);

module.exports = router;
