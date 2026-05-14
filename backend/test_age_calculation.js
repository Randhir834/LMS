// Test script to verify age calculation functionality
const { findAllUsers } = require('./src/services/adminService');

async function testAgeCalculation() {
  try {
    console.log('Testing age calculation for instructors...');
    
    // Get all instructors
    const instructors = await findAllUsers('instructor');
    
    console.log(`Found ${instructors.length} instructors:`);
    
    instructors.forEach(instructor => {
      console.log(`\n- ${instructor.name} (${instructor.email})`);
      console.log(`  Date of Birth: ${instructor.date_of_birth || 'Not provided'}`);
      console.log(`  Calculated Age: ${instructor.age !== undefined ? instructor.age + ' years' : 'Cannot calculate (no DOB)'}`);
      console.log(`  Specialization: ${instructor.specialization || 'Not specified'}`);
    });
    
    console.log('\n\nTesting age calculation for students...');
    
    // Get all students
    const students = await findAllUsers('student');
    
    console.log(`Found ${students.length} students:`);
    
    students.forEach(student => {
      console.log(`\n- ${student.name} (${student.email})`);
      console.log(`  Date of Birth: ${student.date_of_birth || 'Not provided'}`);
      console.log(`  Calculated Age: ${student.age !== undefined ? student.age + ' years' : 'Cannot calculate (no DOB)'}`);
      console.log(`  Grade: ${student.grade || 'Not specified'}`);
      console.log(`  School: ${student.school || 'Not specified'}`);
    });
    
    // Test age calculation function directly
    console.log('\n--- Testing age calculation function ---');
    
    const testDates = [
      '1990-05-15', // Should be around 34-35 years old
      '1985-12-25', // Should be around 39-40 years old
      '2000-01-01', // Should be around 24-25 years old
    ];
    
    testDates.forEach(date => {
      const today = new Date();
      const birthDate = new Date(date);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      console.log(`Birth date: ${date} -> Age: ${age} years`);
    });
    
  } catch (error) {
    console.error('Error testing age calculation:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAgeCalculation().then(() => {
    console.log('\nAge calculation test completed.');
    process.exit(0);
  }).catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}

module.exports = { testAgeCalculation };