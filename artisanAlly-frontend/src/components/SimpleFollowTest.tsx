import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import FollowButton from './FollowButton';

const SimpleFollowTest: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [testUserId, setTestUserId] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
        <p className="text-yellow-800">Please login to test follow functionality</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg max-w-md mx-auto mt-8">
      <h3 className="text-lg font-semibold mb-4">Follow Test</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Current User: {user?.name}</p>
          <p className="text-xs text-gray-500">User ID: {user?._id}</p>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {testUserId && testUserId !== user?._id && (
          <div>
            <h4 className="font-medium mb-2">Follow Button Test:</h4>
            <FollowButton userId={testUserId} size="md" />
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 border-t pt-4">
          <p>• Login status: {isAuthenticated ? '✅ Logged in' : '❌ Not logged in'}</p>
          <p>• Token exists: {localStorage.getItem('token') ? '✅ Yes' : '❌ No'}</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleFollowTest;
