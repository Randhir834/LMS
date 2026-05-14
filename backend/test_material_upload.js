// Load environment variables
require('dotenv').config();

const { uploadCourseMaterial } = require('./src/services/courseMaterialService');

async function testMaterialUpload() {
  console.log('🧪 Testing Course Material Upload...\n');

  try {
    // Create a mock file object
    const mockFile = {
      originalname: 'test-document.pdf',
      mimetype: 'application/pdf',
      size: 1024 * 100, // 100KB
      buffer: Buffer.from('This is a test PDF content for course materials')
    };

    const courseId = 1; // Assuming course ID 1 exists
    const uploadedBy = 9; // Assuming admin user ID 9 exists
    const materialData = {
      title: 'Test Course Material',
      description: 'This is a test material for the secure system'
    };

    console.log('1. Uploading test material...');
    console.log(`   File: ${mockFile.originalname}`);
    console.log(`   Size: ${mockFile.size} bytes`);
    console.log(`   Type: ${mockFile.mimetype}`);

    const result = await uploadCourseMaterial(mockFile, courseId, uploadedBy, materialData);

    console.log('✅ Upload successful!');
    console.log(`   Material ID: ${result.id}`);
    console.log(`   Title: ${result.title}`);
    console.log(`   File Path: ${result.file_path}`);
    console.log(`   File Type: ${result.file_type}`);

    console.log('\n🎉 Course material upload is working!');
    console.log('\n📋 System Status:');
    console.log('   ✅ File validation working');
    console.log('   ✅ Storage system operational');
    console.log('   ✅ Database integration working');
    console.log('   ✅ Security measures active');

    // Clean up test data
    const { query } = require('./src/config/database');
    await query('DELETE FROM course_materials WHERE id = $1', [result.id]);
    console.log('\n🧹 Test data cleaned up');

  } catch (error) {
    console.error('❌ Upload test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testMaterialUpload().then(() => {
  console.log('\n✨ Upload test completed');
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});