const { pool } = require('../src/config/database');

async function main() {
  try {
    console.log('Adding missing columns to live_classes...');
    await pool.query(`
      ALTER TABLE live_classes
      ADD COLUMN IF NOT EXISTS lesson_id INTEGER REFERENCES lessons(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS section_id INTEGER REFERENCES sections(id) ON DELETE SET NULL;
    `);
    console.log('Successfully added columns!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

main();
