const { query } = require('./src/config/database');
async function test() {
  try {
    const res = await query("SELECT email, role FROM users WHERE id = 25;");
    console.log("User 25:", res.rows);
  } catch (e) {
    console.error("DB Error:", e);
  }
  process.exit();
}
test();
