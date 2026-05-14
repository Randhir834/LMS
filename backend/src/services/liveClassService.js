const { query } = require('../config/database');

const findLiveClassesByCourse = async (courseId) => {
  const result = await query(
    'SELECT * FROM live_classes WHERE course_id = $1 ORDER BY scheduled_at ASC',
    [courseId]
  );
  return result.rows;
};

const findUpcomingLiveClasses = async (studentId) => {
  const result = await query(
    `SELECT lc.*, c.title AS course_title FROM live_classes lc
     JOIN enrollments e ON lc.course_id = e.course_id
     JOIN courses c ON lc.course_id = c.id
     WHERE e.user_id = $1 AND lc.scheduled_at > NOW()
     ORDER BY lc.scheduled_at ASC`,
    [studentId]
  );
  return result.rows;
};

const findLiveClassById = async (id) => {
  const result = await query('SELECT * FROM live_classes WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const createLiveClass = async ({ course_id, title, description, meet_link, scheduled_at, duration_minutes }) => {
  const result = await query(
    'INSERT INTO live_classes (course_id, title, description, meet_link, scheduled_at, duration_minutes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [course_id, title, description, meet_link, scheduled_at, duration_minutes]
  );
  return result.rows[0];
};

const updateLiveClassById = async (id, data) => {
  const result = await query(
    'UPDATE live_classes SET title = COALESCE($1, title), description = COALESCE($2, description), meet_link = COALESCE($3, meet_link), scheduled_at = COALESCE($4, scheduled_at), duration_minutes = COALESCE($5, duration_minutes), status = COALESCE($6, status), updated_at = NOW() WHERE id = $7 RETURNING *',
    [data.title, data.description, data.meet_link, data.scheduled_at, data.duration_minutes, data.status, id]
  );
  return result.rows[0];
};

const deleteLiveClassById = async (id) => {
  await query('DELETE FROM live_classes WHERE id = $1', [id]);
};

module.exports = {
  findLiveClassesByCourse, findUpcomingLiveClasses, findLiveClassById,
  createLiveClass, updateLiveClassById, deleteLiveClassById,
};
