import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  EyeIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { usePostStore } from '../stores/postStore';
import { useAuthStore } from '../stores/authStore';
import FollowButton from './FollowButton';
import EditPostModal from './EditPostModal';
import ConfirmModal from './ConfirmModal';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  isLiked?: boolean;
  currentUserId?: string;
}

const PostCard = ({ post, onLike, isLiked = false, currentUserId }: PostCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deletePost, isLoading } = usePostStore();
  const { user } = useAuthStore();
  
  // Safety check for post data
  if (!post || !post.user) {
    return (
      <div className="card p-4">
        <div className="text-gray-500 dark:text-gray-400 text-center">Post data unavailable</div>
      </div>
    );
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      onLike?.(post._id);
    } catch (error) {
      console.error('Error in handleLike:', error);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.origin + `/posts/${post._id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/posts/${post._id}`);
    }
  };

  const handleDelete = async () => {
    const success = await deletePost(post._id);
    if (success) {
      setShowDeleteModal(false);
    }
  };

  const isOwner = user && user._id === post.user?._id;

  return (
    <article className="card group">
      <Link to={`/posts/${post._id}`} className="block">
        {/* Header */}
        <div className="flex items-center space-x-3 p-4 pb-2">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
              {post.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <Link 
              to={`/user/${post.user._id}`}
              className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate block"
              onClick={(e) => e.stopPropagation()}
            >
              {post.user?.name || 'Unknown User'}
            </Link>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Follow Button - Only show if not current user's post */}
            {currentUserId && currentUserId !== post.user._id && (
              <div onClick={(e) => e.stopPropagation()}>
                <FollowButton 
                  userId={post.user._id} 
                  size="sm"
                />
              </div>
            )}
            
            {/* Owner Actions */}
            {isOwner && (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="p-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                >
                  <EllipsisVerticalIcon className="h-4 w-4" />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 top-6 bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowEditModal(true);
                        setShowActions(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowDeleteModal(true);
                        setShowActions(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-200 text-sm line-clamp-3 mb-3">
            {post.content}
          </p>
        </div>

        {/* Image */}
        {post.image && !imageError && (
          <div className="relative">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
            >
              {isLiked ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{post.likes?.length || 0}</span>
            </button>
            
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">{post.comments?.length || 0}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
              <EyeIcon className="h-5 w-5" />
              <span className="text-sm font-medium">{post.views || 0}</span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Share"
          >
            <ShareIcon className="h-5 w-5" />
          </button>
        </div>
      </Link>
      
      {/* Edit Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={post}
      />
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </article>
  );
};

export default PostCard;
