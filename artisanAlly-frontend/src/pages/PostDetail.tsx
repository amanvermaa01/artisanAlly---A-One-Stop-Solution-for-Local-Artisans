import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePostStore } from '../stores/postStore';
import { useAuthStore } from '../stores/authStore';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  ArrowLeftIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentPost, fetchPost, likePost, addComment, isLoading } = usePostStore();
  const { user } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id, fetchPost]);

  useEffect(() => {
    if (currentPost && user && currentPost.likes) {
      setIsLiked(currentPost.likes.includes(user._id));
    }
  }, [currentPost, user]);

  const handleLike = () => {
    if (currentPost) {
      likePost(currentPost._id);
      setIsLiked(!isLiked);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && currentPost) {
      addComment(currentPost._id, commentText.trim());
      setCommentText('');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentPost?.title,
        text: currentPost?.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center transition-colors duration-300">
        <div className="spinner dark:border-white"></div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Post not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The post you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }

  // Additional safety check for post data structure
  if (!currentPost.user || !currentPost.title || !currentPost.content) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Post data incomplete</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">This post has incomplete data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-800 overflow-hidden transition-colors duration-300">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-dark-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-primary-600 dark:text-primary-300">
                  {currentPost.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{currentPost.user?.name || 'Unknown User'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(currentPost.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{currentPost.title}</h1>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Image */}
            {currentPost.image && (
              <div className="mb-6">
                <img
                  src={currentPost.image}
                  alt={currentPost.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Text Content */}
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {currentPost.content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-dark-800">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                >
                  {isLiked ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                  <span>{currentPost.likes?.length || 0}</span>
                </button>

                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <ChatBubbleLeftIcon className="h-6 w-6" />
                  <span>{currentPost.comments?.length || 0}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <span>👁️</span>
                  <span>{currentPost.views || 0}</span>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <ShareIcon className="h-6 w-6" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 dark:border-dark-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Comments ({currentPost.comments?.length || 0})
            </h3>

            {/* Add Comment */}
            {user && (
              <form onSubmit={handleComment} className="mb-6">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {(currentPost.comments?.length || 0) === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No comments yet</p>
              ) : (
                currentPost.comments?.map((comment) => (
                  <div key={comment._id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {comment.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-3 border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-200">
                            {comment.user?.name || 'Unknown User'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown date'}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{comment.text || ''}</p>
                      </div>
                    </div>
                  </div>
                )) || []
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
