const { query } = require('./src/config/database');
async function test() {
  try {
    const res = await query("SELECT email, role FROM users WHERE role='student' LIMIT 5;");
    console.log("Students:", res.rows);
  } catch (e) {
    console.error("DB Error:", e);
  }
  process.exit();
}
test();
