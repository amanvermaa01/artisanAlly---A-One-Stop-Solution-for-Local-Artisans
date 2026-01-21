import React, { useEffect, useState } from 'react';
import { usePostStore } from '../stores/postStore';
import { useAuthStore } from '../stores/authStore';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Posts = () => {
  const { posts, fetchPosts, searchPosts, isLoading, likePost } = usePostStore();
  const { isAuthenticated, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = (searchPosts(searchQuery) || []).sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'most-liked':
        return b.likes.length - a.likes.length;
      case 'most-commented':
        return b.comments.length - a.comments.length;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Artisan Stories</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover the stories behind the crafts and connect with artisans
              </p>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create Post</span>
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-800 p-6 mb-8 transition-colors duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts, artisans, or stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Sort */}
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                title="Sort posts"
                className="w-full border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg px-3 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-liked">Most Liked</option>
                <option value="most-commented">Most Commented</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredPosts.length} of {posts?.length || 0} posts
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'No posts available at the moment'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn-primary"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?._id}
                onLike={likePost}
                isLiked={user ? post.likes.includes(user._id) : false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default Posts;
