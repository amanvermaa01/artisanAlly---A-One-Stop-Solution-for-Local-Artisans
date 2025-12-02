import React, { useState, useEffect } from 'react';
import { followAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import FollowButton from './FollowButton';

const DebugFollow: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [testUserId, setTestUserId] = useState('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testFollowAPI = async () => {
    if (!testUserId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    try {
      setError(null);
      console.log('Testing follow API with user ID:', testUserId);
      
      const response = await followAPI.getFollowStatus(testUserId);
      setApiResponse(response.data);
      console.log('Follow API Response:', response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'API Error';
      setError(errorMsg);
      console.error('Follow API Error:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please login to test follow functionality</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg max-w-md mx-auto mt-8">
      <h3 className="text-lg font-semibold mb-4">Follow API Debug Tool</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Current User: {user?.name} ({user?._id})</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test User ID:
          </label>
          <input
            type="text"
            value={testUserId}
            onChange={(e) => setTestUserId(e.target.value)}
            placeholder="Enter user ID to test follow"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={testFollowAPI}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Test Follow API
        </button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
            Error: {error}
          </div>
        )}

        {apiResponse && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <h4 className="font-medium text-green-800 mb-2">API Response:</h4>
            <pre className="text-xs text-green-700 overflow-auto">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}

        {testUserId && testUserId !== user?._id && (
          <div>
            <h4 className="font-medium mb-2">Follow Button Test:</h4>
            <FollowButton userId={testUserId} size="md" />
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <h4 className="font-medium mb-1">Debug Info:</h4>
        <p>• API Base: {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</p>
        <p>• Token exists: {!!localStorage.getItem('token')}</p>
        <p>• Environment: {import.meta.env.VITE_NODE_ENV || 'development'}</p>
        <p>• Follow API endpoints: GET/POST /users/:id/status, /users/:id/follow, /users/:id/unfollow</p>
      </div>
    </div>
  );
};

export default DebugFollow;
