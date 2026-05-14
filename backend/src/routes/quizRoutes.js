const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  getQuizzes, getQuizById, createQuizController, updateQuiz, deleteQuiz,
  addQuestion, deleteQuestion,
  startQuizAttempt, submitQuizAnswer, completeQuizAttempt, getMyAttempts, getAttemptDetails,
} = require('../controllers/quizController');

const router = express.Router();

router.get('/', authenticate, getQuizzes);
router.get('/:id', authenticate, getQuizById);
router.post('/', authenticate, authorizeRoles('instructor', 'admin'), createQuizController);
router.put('/:id', authenticate, authorizeRoles('instructor', 'admin'), updateQuiz);
router.delete('/:id', authenticate, authorizeRoles('instructor', 'admin'), deleteQuiz);

router.post('/:id/questions', authenticate, authorizeRoles('instructor', 'admin'), addQuestion);
router.delete('/:id/questions/:questionId', authenticate, authorizeRoles('instructor', 'admin'), deleteQuestion);

router.post('/:id/attempt', authenticate, authorizeRoles('student'), startQuizAttempt);
router.post('/attempts/:attemptId/answer', authenticate, authorizeRoles('student'), submitQuizAnswer);
router.post('/attempts/:attemptId/complete', authenticate, authorizeRoles('student'), completeQuizAttempt);
router.get('/my-attempts', authenticate, authorizeRoles('student'), getMyAttempts);
router.get('/attempts/:attemptId', authenticate, getAttemptDetails);

module.exports = router;
