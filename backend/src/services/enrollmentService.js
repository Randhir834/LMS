const { query } = require('../config/database');

const createEnrollment = async ({ user_id, course_id }) => {
  const existing = await query(
    'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
    [user_id, course_id]
  );
  if (existing.rows.length > 0) {
    const err = new Error('Already enrolled in this course');
    err.statusCode = 409;
    throw err;
  }

  const course = await query(
    "SELECT id, status FROM courses WHERE id = $1",
    [course_id]
  );
  if (!course.rows[0]) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }
  if (course.rows[0].status !== 'published') {
    const err = new Error('Course is not available for enrollment');
    err.statusCode = 400;
    throw err;
  }

  const result = await query(
    'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *',
    [user_id, course_id]
  );
  return result.rows[0];
};

const findEnrollmentsByUser = async (user_id) => {
  const result = await query(
    `SELECT e.*, c.title AS course_title, c.description AS course_description,
      c.thumbnail_url, c.price, c.duration_value, c.duration_unit, c.level, c.status AS course_status,
      COALESCE(
        json_agg(
          json_build_object('id', u.id, 'name', u.name, 'email', u.email, 'is_primary', ci.is_primary)
        ) FILTER (WHERE u.id IS NOT NULL),
        '[]'
      ) AS instructors
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    LEFT JOIN course_instructors ci ON ci.course_id = c.id
    LEFT JOIN users u ON ci.instructor_id = u.id
    WHERE e.user_id = $1
    GROUP BY e.id, c.id
    ORDER BY e.created_at DESC`,
    [user_id]
  );
  return result.rows;
};

const findEnrollmentById = async (id) => {
  const result = await query(
    `SELECT e.*, c.title AS course_title, c.description AS course_description,
      c.thumbnail_url, c.price, c.duration_value, c.duration_unit, c.level,
      COALESCE(
        json_agg(
          json_build_object('id', u.id, 'name', u.name, 'email', u.email, 'is_primary', ci.is_primary)
        ) FILTER (WHERE u.id IS NOT NULL),
        '[]'
      ) AS instructors
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    LEFT JOIN course_instructors ci ON ci.course_id = c.id
    LEFT JOIN users u ON ci.instructor_id = u.id
    WHERE e.id = $1
    GROUP BY e.id, c.id`,
    [id]
  );
  return result.rows[0] || null;
};

const findEnrollmentByUserAndCourse = async (user_id, course_id) => {
  const result = await query(
    'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
    [user_id, course_id]
  );
  return result.rows[0] || null;
};

const findAllEnrollments = async () => {
  const result = await query(
    `SELECT e.*, u.name AS student_name, u.email AS student_email,
      c.title AS course_title, c.price AS course_price
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    JOIN courses c ON e.course_id = c.id
    ORDER BY e.created_at DESC`
  );
  return result.rows;
};

module.exports = {
  createEnrollment,
  findEnrollmentsByUser,
  findEnrollmentById,
  findEnrollmentByUserAndCourse,
  findAllEnrollments,
};
