const { query } = require('./src/config/database');
async function test() {
  try {
    const res = await query('SELECT email, role FROM users LIMIT 1;');
    console.log("Users:", res.rows);
    const tables = await query("SELECT table_name FROM information_schema.tables WHERE table_schema='public';");
    console.log("Tables:", tables.rows.map(r => r.table_name));
  } catch (e) {
    console.error("DB Error:", e);
  }
  process.exit();
}
test();
