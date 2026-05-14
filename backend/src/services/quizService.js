const { query } = require('../config/database');

const findQuizzesByCourse = async (courseId) => {
  const result = await query(
    'SELECT * FROM quizzes WHERE course_id = $1 ORDER BY created_at DESC',
    [courseId]
  );
  return result.rows;
};

const findQuizById = async (id) => {
  const result = await query('SELECT * FROM quizzes WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const createQuiz = async ({ course_id, title, description, time_limit_minutes, passing_score }) => {
  const result = await query(
    'INSERT INTO quizzes (course_id, title, description, time_limit_minutes, passing_score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [course_id, title, description, time_limit_minutes, passing_score]
  );
  return result.rows[0];
};

const updateQuizById = async (id, data) => {
  const result = await query(
    'UPDATE quizzes SET title = COALESCE($1, title), description = COALESCE($2, description), time_limit_minutes = COALESCE($3, time_limit_minutes), passing_score = COALESCE($4, passing_score), is_published = COALESCE($5, is_published), updated_at = NOW() WHERE id = $6 RETURNING *',
    [data.title, data.description, data.time_limit_minutes, data.passing_score, data.is_published, id]
  );
  return result.rows[0];
};

const deleteQuizById = async (id) => {
  await query('DELETE FROM quizzes WHERE id = $1', [id]);
};

const findQuestionsByQuiz = async (quizId) => {
  const result = await query(
    'SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY sort_order ASC',
    [quizId]
  );
  return result.rows;
};

const createQuestion = async ({ quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, marks, sort_order }) => {
  const result = await query(
    'INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, marks, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, marks, sort_order]
  );
  return result.rows[0];
};

const deleteQuestionById = async (id) => {
  await query('DELETE FROM quiz_questions WHERE id = $1', [id]);
};

const startAttempt = async ({ quiz_id, student_id }) => {
  const result = await query(
    'INSERT INTO quiz_attempts (quiz_id, student_id) VALUES ($1, $2) RETURNING *',
    [quiz_id, student_id]
  );
  return result.rows[0];
};

const submitAnswer = async ({ attempt_id, question_id, selected_option, is_correct }) => {
  const result = await query(
    'INSERT INTO quiz_answers (attempt_id, question_id, selected_option, is_correct) VALUES ($1, $2, $3, $4) RETURNING *',
    [attempt_id, question_id, selected_option, is_correct]
  );
  return result.rows[0];
};

const completeAttempt = async (id, { score, total_marks }) => {
  const result = await query(
    'UPDATE quiz_attempts SET score = $1, total_marks = $2, status = $3, completed_at = NOW() WHERE id = $4 RETURNING *',
    [score, total_marks, 'completed', id]
  );
  return result.rows[0];
};

const findAttemptsByStudent = async (studentId) => {
  const result = await query(
    'SELECT a.*, q.title AS quiz_title, q.course_id, c.title AS course_title FROM quiz_attempts a JOIN quizzes q ON a.quiz_id = q.id JOIN courses c ON q.course_id = c.id WHERE a.student_id = $1 ORDER BY a.created_at DESC',
    [studentId]
  );
  return result.rows;
};

const findAttemptById = async (id) => {
  const result = await query('SELECT * FROM quiz_attempts WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const findAnswersByAttempt = async (attemptId) => {
  const result = await query(
    'SELECT a.*, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option FROM quiz_answers a JOIN quiz_questions q ON a.question_id = q.id WHERE a.attempt_id = $1 ORDER BY q.sort_order ASC',
    [attemptId]
  );
  return result.rows;
};

module.exports = {
  findQuizzesByCourse, findQuizById, createQuiz, updateQuizById, deleteQuizById,
  findQuestionsByQuiz, createQuestion, deleteQuestionById,
  startAttempt, submitAnswer, completeAttempt, findAttemptsByStudent, findAttemptById, findAnswersByAttempt,
};
