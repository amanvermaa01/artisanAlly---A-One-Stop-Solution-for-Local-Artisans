import React, { useState, useEffect } from 'react';
import { followAPI } from '../services/api';
import toast from 'react-hot-toast';

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
  initialFollowersCount?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialFollowing = false,
  initialFollowersCount = 0,
  className = '',
  size = 'md'
}) => {
  const [following, setFollowing] = useState(initialFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Size classes with improved visibility
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-w-[70px]',
    md: 'px-4 py-2 text-sm min-w-[90px]',
    lg: 'px-6 py-3 text-base min-w-[120px]'
  };


  // Fetch follow status on component mount
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        const response = await followAPI.getFollowStatus(userId);

        setFollowing(response.data.following || false);
        setFollowersCount(response.data.followersCount || 0);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching follow status:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch follow status';
        setError(errorMessage);
        // Don't show toast for follow status errors as they're not critical
      }
    };

    if (userId) {
      fetchFollowStatus();
    }
  }, [userId]);

  const handleFollowToggle = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to follow users');
        setLoading(false);
        return;
      }

      const response = following 
        ? await followAPI.unfollowUser(userId)
        : await followAPI.followUser(userId);

      // Update local state based on API response
      const newFollowingState = response.data.following;
      setFollowing(newFollowingState);
      
      // Update followers count from response (backend provides accurate count)
      if (response.data.followersCount !== undefined) {
        setFollowersCount(response.data.followersCount);
      }
      
      toast.success(response.data.message || (following ? 'Unfollowed successfully' : 'Followed successfully'));
    } catch (error: any) {
      console.error('Error toggling follow:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update follow status';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  try {
    return (
      <div className="flex flex-col items-center space-y-1">
        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={`
            ${sizeClasses[size]}
            ${following 
              ? 'bg-green-100 text-green-800 border-2 border-green-300 hover:bg-green-200 shadow-md' 
              : 'bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
            }
            rounded-lg font-semibold transition-all duration-200 transform hover:scale-105
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${className}
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-1">
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              {size !== 'sm' && <span className="ml-1">{following ? 'Unfollowing...' : 'Following...'}</span>}
            </div>
          ) : (
            <span className="font-semibold">{following ? '✓ Following' : '+ Follow'}</span>
          )}
        </button>
        
        {/* Show follower count for larger sizes */}
        {followersCount > 0 && size !== 'sm' && (
          <span className="text-xs text-gray-500 text-center">
            {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
          </span>
        )}
      </div>
    );
  } catch (error) {
    console.error('FollowButton render error:', error);
    return (
      <button className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded">
        Follow
      </button>
    );
  }
};

export default FollowButton;
