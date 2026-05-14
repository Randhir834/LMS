const { query } = require('../config/database');

const findAssignmentsByCourse = async (courseId) => {
  const result = await query(
    'SELECT * FROM assignments WHERE course_id = $1 ORDER BY due_date ASC',
    [courseId]
  );
  return result.rows;
};

const findAssignmentById = async (id) => {
  const result = await query('SELECT * FROM assignments WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const createAssignment = async ({ course_id, title, description, due_date, max_score }) => {
  const result = await query(
    'INSERT INTO assignments (course_id, title, description, due_date, max_score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [course_id, title, description, due_date, max_score]
  );
  return result.rows[0];
};

const updateAssignmentById = async (id, data) => {
  const result = await query(
    'UPDATE assignments SET title = COALESCE($1, title), description = COALESCE($2, description), due_date = COALESCE($3, due_date), max_score = COALESCE($4, max_score), updated_at = NOW() WHERE id = $5 RETURNING *',
    [data.title, data.description, data.due_date, data.max_score, id]
  );
  return result.rows[0];
};

const deleteAssignmentById = async (id) => {
  await query('DELETE FROM assignments WHERE id = $1', [id]);
};

const submitAssignment = async ({ assignment_id, student_id, file_url, notes }) => {
  const result = await query(
    'INSERT INTO assignment_submissions (assignment_id, student_id, file_url, notes) VALUES ($1, $2, $3, $4) RETURNING *',
    [assignment_id, student_id, file_url, notes]
  );
  return result.rows[0];
};

const findSubmissionsByAssignment = async (assignmentId) => {
  const result = await query(
    'SELECT s.*, u.name AS student_name, u.email AS student_email FROM assignment_submissions s JOIN users u ON s.student_id = u.id WHERE s.assignment_id = $1 ORDER BY s.submitted_at DESC',
    [assignmentId]
  );
  return result.rows;
};

const findSubmissionsByStudent = async (studentId) => {
  const result = await query(
    'SELECT s.*, a.title AS assignment_title, a.course_id, c.title AS course_title FROM assignment_submissions s JOIN assignments a ON s.assignment_id = a.id JOIN courses c ON a.course_id = c.id WHERE s.student_id = $1 ORDER BY s.submitted_at DESC',
    [studentId]
  );
  return result.rows;
};

const gradeSubmission = async (id, { score, status }) => {
  const result = await query(
    'UPDATE assignment_submissions SET score = $1, status = $2, graded_at = NOW(), updated_at = NOW() WHERE id = $3 RETURNING *',
    [score, status || 'graded', id]
  );
  return result.rows[0];
};

module.exports = {
  findAssignmentsByCourse, findAssignmentById, createAssignment, updateAssignmentById, deleteAssignmentById,
  submitAssignment, findSubmissionsByAssignment, findSubmissionsByStudent, gradeSubmission,
};
