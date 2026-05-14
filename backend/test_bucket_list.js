// Load environment variables
require('dotenv').config();

const { getSupabaseClient } = require('./src/config/supabase');

async function listBuckets() {
  console.log('🧪 Checking Available Supabase Buckets...\n');

  try {
    const supabase = getSupabaseClient();
    
    console.log('Environment variables:');
    console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL}`);
    console.log(`SUPABASE_BUCKET: ${process.env.SUPABASE_BUCKET}`);
    console.log(`SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'}`);
    
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Failed to list buckets:', error.message);
      return;
    }

    console.log('\n📦 Available buckets:');
    if (buckets && buckets.length > 0) {
      buckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    } else {
      console.log('   No buckets found');
    }

    // Try to create the playfit-storage bucket if it doesn't exist
    const bucketExists = buckets && buckets.find(b => b.name === 'playfit-storage');
    
    if (!bucketExists) {
      console.log('\n🔧 Creating playfit-storage bucket...');
      
      const { data: createData, error: createError } = await supabase.storage.createBucket('playfit-storage', {
        public: true
      });

      if (createError) {
        console.error('❌ Failed to create bucket:', createError.message);
      } else {
        console.log('✅ Bucket created successfully');
      }
    } else {
      console.log('\n✅ playfit-storage bucket exists');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
listBuckets().then(() => {
  console.log('\n✨ Bucket check completed');
}).catch((error) => {
  console.error('Fatal error:', error);
});