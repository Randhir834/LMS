// Load environment variables
require('dotenv').config();

const { getSupabaseClient } = require('./src/config/supabase');

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection and Storage...\n');

  try {
    const supabase = getSupabaseClient();
    
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...');
    
    // Test with a simple storage operation
    const testContent = 'This is a test file for course materials';
    const testFileName = `test-${Date.now()}.txt`;
    
    // Try uploading to the existing bucket
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET || 'playfit-storage')
      .upload(`test/${testFileName}`, Buffer.from(testContent), {
        contentType: 'text/plain'
      });

    if (error) {
      console.error('❌ Upload test failed:', error.message);
      console.log('   This might be due to:');
      console.log('   - Incorrect SUPABASE_SERVICE_ROLE_KEY');
      console.log('   - Bucket permissions');
      console.log('   - Network connectivity');
      return;
    }

    console.log('✅ Upload test successful');
    console.log(`   File uploaded to: ${data.path}`);

    // Test 2: Generate signed URL
    console.log('\n2. Testing signed URL generation...');
    
    const { data: urlData, error: urlError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET || 'playfit-storage')
      .createSignedUrl(`test/${testFileName}`, 60);

    if (urlError) {
      console.log('⚠️  Signed URL failed, trying public URL...');
      
      const { data: publicData } = supabase.storage
        .from(process.env.SUPABASE_BUCKET || 'playfit-storage')
        .getPublicUrl(`test/${testFileName}`);
      
      console.log('✅ Public URL generated (fallback)');
      console.log(`   URL: ${publicData.publicUrl.substring(0, 50)}...`);
    } else {
      console.log('✅ Signed URL generated successfully');
      console.log(`   URL: ${urlData.signedUrl.substring(0, 50)}...`);
    }

    // Test 3: Clean up
    console.log('\n3. Cleaning up test file...');
    
    const { error: deleteError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET || 'playfit-storage')
      .remove([`test/${testFileName}`]);

    if (deleteError) {
      console.log('⚠️  Cleanup failed, but upload/download works');
    } else {
      console.log('✅ Cleanup successful');
    }

    console.log('\n🎉 Supabase storage is working!');
    console.log('\n📋 Configuration Status:');
    console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   SUPABASE_BUCKET: ${process.env.SUPABASE_BUCKET || 'playfit-storage'}`);

    console.log('\n💡 Course materials upload should now work!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('signature verification failed')) {
      console.log('\n🔧 Fix Required:');
      console.log('   1. Go to your Supabase Dashboard');
      console.log('   2. Navigate to: Project Settings → API');
      console.log('   3. Copy the "service_role" secret key');
      console.log('   4. Update SUPABASE_SERVICE_ROLE_KEY in backend/.env');
      console.log('   5. Restart the backend server');
    }
  }
}

// Run the test
testSupabaseConnection().then(() => {
  console.log('\n✨ Test completed');
}).catch((error) => {
  console.error('Fatal error:', error);
});