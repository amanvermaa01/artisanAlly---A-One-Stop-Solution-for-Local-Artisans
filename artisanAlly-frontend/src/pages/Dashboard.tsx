import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useDashboardStore } from '../stores/dashboardStore';
import { useCartStore } from '../stores/cartStore';
import CreatePostModal from '../components/CreatePostModal';
import CreateProductModal from '../components/CreateProductModal';
import EditProfileModal from '../components/EditProfileModal';
import { 
  PlusIcon,
  EyeIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { 
    dashboard, 
    analytics, 
    posts, 
    followers, 
    following, 
    users, 
    artisans,
    fetchDashboard,
    isLoading 
  } = useDashboardStore();
  const { getTotalItems, getTotalPrice } = useCartStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // For backward compatibility with existing stats
  const userProducts = [];
  const userPosts = posts;

  const getStatsForRole = () => {
    if (dashboard === 'artisan' && analytics) {
      return [
        {
          name: 'Followers',
          value: analytics.totalFollowers,
          icon: UserGroupIcon,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        },
        {
          name: 'Posts',
          value: analytics.totalPosts,
          icon: EyeIcon,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        },
        {
          name: 'Total Likes',
          value: analytics.totalLikes,
          icon: HeartIcon,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
        },
        {
          name: 'Total Views',
          value: analytics.totalViews,
          icon: EyeIcon,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
        },
      ];
    } else {
      // Customer or fallback stats
      return [
        {
          name: 'Artisans',
          value: artisans.length,
          icon: UserGroupIcon,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        },
        {
          name: 'Posts',
          value: posts.length,
          icon: EyeIcon,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        },
        {
          name: 'Cart Items',
          value: getTotalItems(),
          icon: ShoppingCartIcon,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
        },
        {
          name: 'Cart Value',
          value: `₹${getTotalPrice().toLocaleString()}`,
          icon: CurrencyRupeeIcon,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
        },
      ];
    }
  };

  const stats = getStatsForRole();

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'products', name: 'My Products' },
    { id: 'posts', name: 'My Posts' },
    { id: 'profile', name: 'Profile' },
    { id: 'analytics', name: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}! Here's what's happening with your account.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {userProducts.slice(0, 3).map((product) => (
                      <div key={product._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <ShoppingCartIcon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Created product: {product.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-primary-600">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {user?.role === 'artisan' && (
                      <button 
                        onClick={() => setShowCreateProduct(true)}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <PlusIcon className="h-8 w-8 text-primary-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Add Product</h4>
                        <p className="text-sm text-gray-500">Create a new product listing</p>
                      </button>
                    )}
                    <button 
                      onClick={() => setShowCreatePost(true)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <EyeIcon className="h-8 w-8 text-green-600 mb-2" />
                      <h4 className="font-medium text-gray-900">Create Post</h4>
                      <p className="text-sm text-gray-500">Share your story with the community</p>
                    </button>
                    <button 
                      onClick={() => setActiveTab('analytics')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <ChartBarIcon className="h-8 w-8 text-purple-600 mb-2" />
                      <h4 className="font-medium text-gray-900">View Analytics</h4>
                      <p className="text-sm text-gray-500">Check your performance metrics</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Products</h3>
                  <button 
                    onClick={() => setShowCreateProduct(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Product</span>
                  </button>
                </div>
                
                {userProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCartIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first product</p>
                    <button 
                      onClick={() => setShowCreateProduct(true)}
                      className="btn-primary"
                    >
                      Add Product
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProducts.map((product) => (
                      <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-4xl">🎨</span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                        <p className="text-lg font-semibold text-primary-600 mb-2">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Stock: {product.stock} items
                        </p>
                        <div className="flex space-x-2">
                          <button className="flex-1 btn-outline text-sm">Edit</button>
                          <button className="flex-1 btn-primary text-sm">View</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Posts</h3>
                  <button 
                    onClick={() => setShowCreatePost(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Create Post</span>
                  </button>
                </div>
                
                {userPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <EyeIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-6">Share your story with the community</p>
                    <button 
                      onClick={() => setShowCreatePost(true)}
                      className="btn-primary"
                    >
                      Create Post
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <div key={post._id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>👁️ {post.views}</span>
                            <span>❤️ {post.likes.length}</span>
                            <span>💬 {post.comments.length}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
                  <button 
                    onClick={() => setShowEditProfile(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Edit Profile</span>
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                      {user?.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-2xl font-bold text-primary-600">
                          {user?.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{user?.name}</h4>
                      <p className="text-gray-600 capitalize">{user?.role}</p>
                      {user?.category && (
                        <p className="text-sm text-gray-500">{user.category}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Email:</span> {user?.email}</p>
                        <p><span className="font-medium">Mobile:</span> {user?.mobile || 'Not provided'}</p>
                        <p><span className="font-medium">Location:</span> {user?.location}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Bio</h5>
                      <p className="text-sm text-gray-600">
                        {user?.bio || 'No bio provided. Click Edit Profile to add one.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics</h3>
                <div className="text-center py-12">
                  <ChartBarIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600">
                    We're working on detailed analytics for your products and posts
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={showCreatePost} 
        onClose={() => setShowCreatePost(false)} 
      />
      
      {/* Create Product Modal */}
      {user?.role === 'artisan' && (
        <CreateProductModal 
          isOpen={showCreateProduct} 
          onClose={() => setShowCreateProduct(false)} 
        />
      )}
      
      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={showEditProfile} 
        onClose={() => setShowEditProfile(false)} 
      />
    </div>
  );
};

export default Dashboard;
