const { updateUser } = require('./src/services/adminService');

async function testUserUpdate() {
  try {
    console.log('Testing user update functionality...');
    
    // Test data
    const testData = {
      name: 'Updated Test Name',
      email: 'updated@test.com',
      phone: '123-456-7890',
      location: 'Test Location',
      specialization: 'Test Specialization'
    };
    
    // Try to update user with ID 22 (from your error logs)
    const result = await updateUser(22, testData);
    
    console.log('Update successful!');
    console.log('Updated user:', result);
    
  } catch (error) {
    console.error('Update failed:', error);
  }
}

testUserUpdate();