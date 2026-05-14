const { query } = require('./src/config/database');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await query('SELECT NOW() as current_time');
    console.log('Database connected successfully!');
    console.log('Current time:', result.rows[0].current_time);
    
    // Check if user 22 exists
    const userCheck = await query('SELECT id, name, email, role FROM users WHERE id = $1', [22]);
    
    if (userCheck.rows.length > 0) {
      console.log('User 22 found:');
      console.log(userCheck.rows[0]);
    } else {
      console.log('User 22 not found');
      
      // Get a list of available users
      const allUsers = await query('SELECT id, name, email, role FROM users LIMIT 5');
      console.log('Available users:');
      console.log(allUsers.rows);
    }
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
  
  process.exit(0);
}

testConnection();