import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useCartStore } from '../stores/cartStore';
import { useProductStore } from '../stores/productStore';
import { useAuthStore } from '../stores/authStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { ShoppingCartIcon, HeartIcon, EyeIcon, PencilIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import FollowButton from './FollowButton';
import EditProductModal from './EditProductModal';
import ConfirmModal from './ConfirmModal';

interface ProductCardProps {
  product: Product;
  onLike?: (productId: string) => void;
  isLiked?: boolean;
  currentUserId?: string;
}

const ProductCard = ({ product, onLike, isLiked = false, currentUserId }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { addToCart } = useCartStore();
  const { deleteProduct, isLoading } = useProductStore();
  const { user } = useAuthStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const navigate = useNavigate();
  
  // Safety check for product data
  if (!product || !product.artist) {
    return (
      <div className="card p-4">
        <div className="text-gray-500 dark:text-gray-400 text-center">Product data unavailable</div>
      </div>
    );
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.(product._id);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      return; // User must be logged in
    }
    
    const productInWishlist = isInWishlist(product._id);
    if (productInWishlist) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  const handleDelete = async () => {
    const success = await deleteProduct(product._id);
    if (success) {
      setShowDeleteModal(false);
    }
  };

  const isOwner = user && user._id === product.artist?._id;

  return (
    <div className="card-hover group">
      <Link to={`/products/${product._id}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl">
          {!imageError && product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-200 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🎨</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No image available</p>
              </div>
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <button
                onClick={handleAddToCart}
                className="bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 p-2 rounded-full shadow-lg hover:bg-primary-50 dark:hover:bg-dark-700 transition-colors"
                title="Add to cart"
              >
                <ShoppingCartIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full shadow-lg transition-colors ${
                  isInWishlist(product._id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white text-red-500 hover:bg-red-50'
                }`}
                title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist(product._id) ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/products/${product._id}`);
                }}
                className="bg-white text-gray-600 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                title="View details"
              >
                <EyeIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              Only {product.stock} left
            </div>
          )}
          
          {product.stock === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Out of Stock
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Artist */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary-600 dark:text-primary-300">
                {product.artist?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <Link 
                to={`/user/${product.artist._id}`}
                className="text-sm text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/user/${product.artist._id}`);
                }}
              >
                {product.artist?.name || 'Unknown Artist'}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              {/* Follow Button - Only show if not current user's product */}
              {currentUserId && currentUserId !== product.artist._id && (
                <div onClick={(e) => e.stopPropagation()}>
                  <FollowButton 
                    userId={product.artist._id} 
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

          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                ₹{product.price.toLocaleString()}
              </span>
              {product.stock > 0 && (
                <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                  ({product.stock} available)
                </span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary text-sm py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
      
      {/* Edit Modal */}
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={product}
      />
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductCard;
