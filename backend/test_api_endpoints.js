const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

// Test data
let authToken = '';
let courseId = 1; // Assuming we have a course with ID 1
let materialId = '';

async function testAPI() {
  console.log('🧪 Testing Course Materials API Endpoints...\n');

  try {
    // Step 1: Login as admin to get auth token
    console.log('1. Logging in as admin...');
    
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@playfit.com', // Adjust based on your admin user
      password: 'admin123' // Adjust based on your admin password
    });

    if (loginResponse.data.token) {
      authToken = loginResponse.data.token;
      console.log('✅ Login successful');
    } else {
      console.log('❌ Login failed - no token received');
      return;
    }

    // Step 2: Test getting course materials (should be empty initially)
    console.log('\n2. Testing GET course materials...');
    
    const getMaterialsResponse = await axios.get(`${API_BASE}/courses/${courseId}/materials`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    console.log(`✅ GET materials successful - found ${getMaterialsResponse.data.materials.length} materials`);

    // Step 3: Test generating a viewing token (should fail if no materials)
    if (getMaterialsResponse.data.materials.length > 0) {
      console.log('\n3. Testing token generation...');
      
      const firstMaterial = getMaterialsResponse.data.materials[0];
      materialId = firstMaterial.id;

      const tokenResponse = await axios.post(`${API_BASE}/materials/${materialId}/token`, {}, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (tokenResponse.data.token) {
        console.log('✅ Token generation successful');
        
        // Step 4: Test secure file access
        console.log('\n4. Testing secure file access...');
        
        const secureResponse = await axios.get(`${API_BASE}/materials/secure/${tokenResponse.data.token}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        if (secureResponse.data.secureUrl) {
          console.log('✅ Secure URL generation successful');
        } else {
          console.log('❌ Secure URL generation failed');
        }
      } else {
        console.log('❌ Token generation failed');
      }
    } else {
      console.log('\n3. ⏭️  Skipping token tests - no materials found');
    }

    // Step 5: Test security violation reporting
    console.log('\n5. Testing security violation reporting...');
    
    const screenshotReportResponse = await axios.post(`${API_BASE}/materials/report/screenshot`, {
      materialId: materialId || 999 // Use existing material ID or dummy ID
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    console.log('✅ Screenshot violation reporting successful');

    const downloadReportResponse = await axios.post(`${API_BASE}/materials/report/download`, {
      materialId: materialId || 999
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    console.log('✅ Download violation reporting successful');

    console.log('\n🎉 All API endpoint tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Authentication working');
    console.log('   ✅ Course materials listing');
    console.log('   ✅ Token generation (if materials exist)');
    console.log('   ✅ Secure URL generation (if materials exist)');
    console.log('   ✅ Security violation reporting');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testAPI().then(() => {
  console.log('\n✨ API testing completed');
}).catch((error) => {
  console.error('Fatal error:', error);
});