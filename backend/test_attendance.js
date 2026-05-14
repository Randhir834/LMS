const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test data
const instructorId = 10; // Dr. Sarah Johnson
const courseId = 1; // Complete Fitness Fundamentals
const testDate = new Date().toISOString().split('T')[0]; // Today's date

async function testAttendanceSystem() {
  try {
    console.log('🧪 Testing Attendance System...\n');

    // 1. Test getting instructor courses
    console.log('1. Testing: Get instructor courses');
    const coursesResponse = await axios.get(`${BASE_URL}/attendance/courses`, {
      headers: { 'instructor-id': instructorId } // Simulating auth
    });
    console.log('✅ Instructor courses:', coursesResponse.data.courses.length);

    // 2. Test getting course students
    console.log('\n2. Testing: Get course students');
    const studentsResponse = await axios.get(`${BASE_URL}/attendance/courses/${courseId}/students`, {
      headers: { 'instructor-id': instructorId }
    });
    console.log('✅ Course students:', studentsResponse.data.students.length);
    console.log('Students:', studentsResponse.data.students.map(s => s.name));

    // 3. Test marking attendance
    console.log('\n3. Testing: Mark attendance');
    const attendanceData = {
      course_id: courseId,
      date: testDate,
      students: studentsResponse.data.students.map(student => ({
        student_id: student.id,
        status: Math.random() > 0.5 ? 'present' : 'absent',
        notes: `Test attendance for ${student.name}`
      }))
    };

    const markResponse = await axios.post(`${BASE_URL}/attendance/mark`, attendanceData, {
      headers: { 
        'instructor-id': instructorId,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Attendance marked:', markResponse.data.message);

    // 4. Test getting attendance by date
    console.log('\n4. Testing: Get attendance by date');
    const attendanceResponse = await axios.get(`${BASE_URL}/attendance/courses/${courseId}?date=${testDate}`, {
      headers: { 'instructor-id': instructorId }
    });
    console.log('✅ Attendance records:', attendanceResponse.data.attendance.length);

    // 5. Test getting attendance reports
    console.log('\n5. Testing: Get attendance reports');
    const reportsResponse = await axios.get(`${BASE_URL}/attendance/reports?course_id=${courseId}`, {
      headers: { 'instructor-id': instructorId }
    });
    console.log('✅ Attendance reports:', reportsResponse.data.attendance.length);

    // 6. Test getting course stats
    console.log('\n6. Testing: Get course attendance stats');
    const statsResponse = await axios.get(`${BASE_URL}/attendance/courses/${courseId}/stats`, {
      headers: { 'instructor-id': instructorId }
    });
    console.log('✅ Course stats:', statsResponse.data.stats);

    console.log('\n🎉 All attendance tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAttendanceSystem();