// Simple Node.js test script to verify follow API is working
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testFollowAPI() {
  try {
    // Test if server is running
    console.log('Testing server connection...');
    const serverResponse = await axios.get('http://localhost:5000/');
    console.log('✅ Server is running:', serverResponse.data.message);
    
    // You would need to replace these with real user IDs and tokens
    // from your database after login
    
    console.log('\n🔍 To test follow functionality:');
    console.log('1. Make sure backend server is running on port 5000');
    console.log('2. Login as a user to get authentication token');
    console.log('3. Try to follow another user');
    console.log('4. Check if follow button appears in frontend');
    
    console.log('\n📋 Follow API endpoints should be available at:');
    console.log('- GET /api/users/:id/status - Check follow status');
    console.log('- POST /api/users/:id/follow - Follow user');
    console.log('- POST /api/users/:id/unfollow - Unfollow user');
    
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    console.log('Make sure your backend server is running on port 5000');
  }
}

testFollowAPI();
