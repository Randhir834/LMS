const { query } = require('./src/config/database');
async function test() {
  try {
    const res = await query("SELECT token FROM password_reset_tokens WHERE user_id = 25 ORDER BY created_at DESC LIMIT 1;");
    const token = res.rows[0].token;
    console.log(`http://localhost:3000/reset-password?token=${token}`);
  } catch (e) {
    console.error("DB Error:", e);
  }
  process.exit();
}
test();
