const {
  findQuizzesByCourse, findQuizById, createQuiz, updateQuizById, deleteQuizById,
  findQuestionsByQuiz, createQuestion, deleteQuestionById,
  startAttempt, submitAnswer, completeAttempt, findAttemptsByStudent, findAttemptById, findAnswersByAttempt,
} = require('../services/quizService');

const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await findQuizzesByCourse(req.query.course_id);
    res.json({ quizzes });
  } catch (error) { next(error); }
};

const getQuizById = async (req, res, next) => {
  try {
    const quiz = await findQuizById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    const questions = await findQuestionsByQuiz(req.params.id);
    res.json({ quiz, questions });
  } catch (error) { next(error); }
};

const createQuizController = async (req, res, next) => {
  try {
    const quiz = await createQuiz(req.body);
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) { next(error); }
};

const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await updateQuizById(req.params.id, req.body);
    res.json({ message: 'Quiz updated successfully', quiz });
  } catch (error) { next(error); }
};

const deleteQuiz = async (req, res, next) => {
  try {
    await deleteQuizById(req.params.id);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) { next(error); }
};

const addQuestion = async (req, res, next) => {
  try {
    const question = await createQuestion({ ...req.body, quiz_id: req.params.id });
    res.status(201).json({ message: 'Question added successfully', question });
  } catch (error) { next(error); }
};

const deleteQuestion = async (req, res, next) => {
  try {
    await deleteQuestionById(req.params.questionId);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) { next(error); }
};

const startQuizAttempt = async (req, res, next) => {
  try {
    const attempt = await startAttempt({ quiz_id: req.params.id, student_id: req.user.id });
    res.status(201).json({ message: 'Quiz attempt started', attempt });
  } catch (error) { next(error); }
};

const submitQuizAnswer = async (req, res, next) => {
  try {
    const answer = await submitAnswer({ attempt_id: req.params.attemptId, ...req.body });
    res.status(201).json({ message: 'Answer submitted', answer });
  } catch (error) { next(error); }
};

const completeQuizAttempt = async (req, res, next) => {
  try {
    const attempt = await completeAttempt(req.params.attemptId, req.body);
    res.json({ message: 'Quiz attempt completed', attempt });
  } catch (error) { next(error); }
};

const getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await findAttemptsByStudent(req.user.id);
    res.json({ attempts });
  } catch (error) { next(error); }
};

const getAttemptDetails = async (req, res, next) => {
  try {
    const attempt = await findAttemptById(req.params.attemptId);
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
    const answers = await findAnswersByAttempt(req.params.attemptId);
    res.json({ attempt, answers });
  } catch (error) { next(error); }
};

module.exports = {
  getQuizzes, getQuizById, createQuizController, updateQuiz, deleteQuiz,
  addQuestion, deleteQuestion,
  startQuizAttempt, submitQuizAnswer, completeQuizAttempt, getMyAttempts, getAttemptDetails,
};
