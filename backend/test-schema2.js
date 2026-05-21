const { query } = require('./src/config/database');
async function test() {
  try {
    const res = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='users' AND table_schema='public';");
    console.log("Public User Columns:", res.rows);
  } catch (e) {
    console.error("DB Error:", e);
  }
  process.exit();
}
test();
