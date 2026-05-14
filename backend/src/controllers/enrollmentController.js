const {
  createEnrollment,
  findEnrollmentsByUser,
  findEnrollmentById,
  findEnrollmentByUserAndCourse,
  findAllEnrollments,
} = require('../services/enrollmentService');
const { createPaymentRecord } = require('../services/paymentService');
const { findCourseById } = require('../services/courseService');

const enrollCourse = async (req, res, next) => {
  try {
    const { course_id, payment_method } = req.body;
    
    // Get course details to check price
    const course = await findCourseById(course_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Create enrollment first
    const enrollment = await createEnrollment({ user_id: req.user.id, course_id });
    
    // If course has a price, create payment record
    if (course.price > 0) {
      if (!payment_method) {
        return res.status(400).json({ error: 'Payment method is required for paid courses' });
      }
      
      const payment = await createPaymentRecord({
        user_id: req.user.id,
        enrollment_id: enrollment.id,
        amount: course.price,
        payment_method
      });
      
      res.status(201).json({ 
        message: 'Enrolled successfully. Payment pending.', 
        enrollment,
        payment,
        course_price: course.price
      });
    } else {
      res.status(201).json({ 
        message: 'Enrolled successfully in free course', 
        enrollment 
      });
    }
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

const getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await findEnrollmentsByUser(req.user.id);
    res.json({ enrollments });
  } catch (error) {
    next(error);
  }
};

const getEnrollmentById = async (req, res, next) => {
  try {
    const enrollment = await findEnrollmentById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.json({ enrollment });
  } catch (error) {
    next(error);
  }
};

const checkEnrollment = async (req, res, next) => {
  try {
    const enrollment = await findEnrollmentByUserAndCourse(req.user.id, req.params.courseId);
    res.json({ enrolled: !!enrollment, enrollment });
  } catch (error) {
    next(error);
  }
};

const getAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await findAllEnrollments();
    res.json({ enrollments });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollCourse,
  getEnrollments,
  getEnrollmentById,
  checkEnrollment,
  getAllEnrollments,
};
