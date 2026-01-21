import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Cart = () => {
  const {
    items,
    getTotalPrice,
    getTotalItems,
    updateQuantity,
    removeFromCart,
    fetchCart,
    isLoading
  } = useCartStore();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const hasToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (isAuthLoading || (hasToken && !isAuthenticated)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center transition-colors duration-300">
        <div className="spinner dark:border-white"></div>
      </div>
    );
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center transition-colors duration-300">
        <div className="spinner dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-12">
            <ShoppingBagIcon className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Looks like you haven't added any items to your cart yet
            </p>
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-800 transition-colors duration-300">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cart Items</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.product._id} className="flex items-center space-x-4 py-4 border-b border-gray-100 dark:border-dark-800 last:border-b-0">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gray-100 dark:bg-dark-800 rounded-lg overflow-hidden">
                            {item.product.images?.[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-800">
                                <span className="text-2xl">🎨</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            by {item.product.artist.name}
                          </p>
                          <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            ₹{item.product.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                            title="Decrease quantity"
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                            title="Increase quantity"
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <PlusIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          title="Remove from cart"
                          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-800 sticky top-8 transition-colors duration-300">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium text-gray-900 dark:text-white">₹{getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className="font-medium text-gray-900 dark:text-white">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax</span>
                      <span className="font-medium text-gray-900 dark:text-white">₹0</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-dark-800 pt-3">
                      <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                        <span>Total</span>
                        <span>₹{getTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="w-full btn-primary flex items-center justify-center py-3"
                  >
                    Proceed to Checkout
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>

                  <Link
                    to="/products"
                    className="w-full btn-outline mt-3 flex items-center justify-center py-3 dark:text-white dark:border-gray-600 dark:hover:bg-dark-800"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
