const { query } = require('./src/config/database');
async function test() {
  try {
    const res = await query("SELECT * FROM password_reset_tokens;");
    console.log("Tokens:", res.rows);
  } catch (e) {
    console.error("DB Error:", e);
  }
  process.exit();
}
test();
