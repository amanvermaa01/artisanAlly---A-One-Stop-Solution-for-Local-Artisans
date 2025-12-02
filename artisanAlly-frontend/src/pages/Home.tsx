import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import { usePostStore } from '../stores/postStore';
import { useAuthStore } from '../stores/authStore';
import ProductCard from '../components/ProductCard';
import PostCard from '../components/PostCard';
import {
  SparklesIcon, 
  ArrowRightIcon,
  StarIcon,
  UsersIcon,
  GlobeAltIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { products, fetchProducts } = useProductStore();
  const { posts, fetchPosts } = usePostStore();
  const { user } = useAuthStore();
  const [featuredProducts, setFeaturedProducts] = useState(products.slice(0, 6));
  const [recentPosts, setRecentPosts] = useState(posts.slice(0, 3));

  useEffect(() => {
    fetchProducts();
    fetchPosts();
  }, [fetchProducts, fetchPosts]);

  useEffect(() => {
    setFeaturedProducts(products.slice(0, 6));
  }, [products]);

  useEffect(() => {
    setRecentPosts(posts.slice(0, 3));
  }, [posts]);

  const features = [
    {
      icon: <SparklesIcon className="h-8 w-8" />,
      title: "AI-Powered Marketing",
      description: "Leverage AI to create compelling product descriptions and marketing content"
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8" />,
      title: "Global Reach",
      description: "Connect with customers worldwide and expand your market presence"
    },
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: "Community Support",
      description: "Join a vibrant community of artisans and craft enthusiasts"
    },
    {
      icon: <LightBulbIcon className="h-8 w-8" />,
      title: "Trend Insights",
      description: "Stay ahead with AI-powered market trends and consumer insights"
    }
  ];


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-dark-900 overflow-hidden min-h-screen flex items-center transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  Empowering
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                    Local Artisans
                  </span>
                  <br />
                  <span className="text-blue-600 dark:text-blue-400">with AI</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                  ArtisanAlly provides an effective and powerful way to connect traditional craftsmanship with modern AI technology.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products" 
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Explore Products
                </Link>
                {(!user || user.role !== 'artisan') && (
                  <Link 
                    to="/register" 
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 dark:text-gray-100 border-2 border-gray-900 dark:border-gray-100 rounded-lg hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900 transition-colors"
                  >
                    Join as Artisan
                  </Link>
                )}
              </div>

              {/* Feature highlights */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">⚡</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Speed &</p>
                    <p className="text-sm text-gray-600">Security</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🔄</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Flexibility &</p>
                    <p className="text-sm text-gray-600">Scalability</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🤝</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Better</p>
                    <p className="text-sm text-gray-600">Collaboration</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Illustration */}
            <div className="relative">
              <div className="relative z-10">
                {/* This will be replaced with the actual illustration */}
                <div className="w-full h-96 bg-gradient-to-br from-orange-100 to-blue-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
                  {/* Artisan illustration placeholder */}
                  <div className="text-8xl">🎨</div>
                  {/* Robot illustration placeholder */}
                  <div className="absolute top-4 right-4 text-4xl">🤖</div>
                  {/* Chart/growth indicator */}
                  <div className="absolute top-4 left-4 w-16 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
                    <div className="text-2xl">📈</div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-200 rounded-2xl transform rotate-12 opacity-80"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-200 rounded-full opacity-80"></div>
              <div className="absolute top-1/2 -right-8 w-12 h-12 bg-green-200 rounded-xl transform rotate-45 opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Illustration */}
            <div className="relative order-2 lg:order-1">
              <div className="relative">
                {/* Main illustration container */}
                <div className="w-full h-80 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
                  {/* Robot character */}
                  <div className="text-7xl animate-bounce">🤖</div>
                  {/* Tools around the robot */}
                  <div className="absolute top-8 left-8 text-3xl animate-pulse">🔧</div>
                  <div className="absolute bottom-8 right-8 text-3xl animate-pulse delay-100">⚙️</div>
                  <div className="absolute top-8 right-8 text-2xl animate-pulse delay-200">💡</div>
                  <div className="absolute bottom-8 left-8 text-2xl animate-pulse delay-300">🎯</div>
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-orange-300 rounded-2xl transform rotate-12 opacity-70"></div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-blue-300 rounded-full opacity-70"></div>
                <div className="absolute top-1/3 -right-4 w-12 h-12 bg-green-300 rounded-xl transform rotate-45 opacity-60"></div>
                <div className="absolute bottom-1/3 -left-4 w-10 h-10 bg-purple-300 rounded-lg transform -rotate-12 opacity-60"></div>
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                  Why Choose
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    ArtisanAlly?
                  </span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We combine the beauty of traditional craftsmanship with cutting-edge AI technology to empower artisans worldwide.
                </p>
              </div>
              
              {/* Feature list */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <SparklesIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">AI-Powered Marketing</h3>
                    <p className="text-gray-600">Leverage AI to create compelling product descriptions and marketing content</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <GlobeAltIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Global Reach</h3>
                    <p className="text-gray-600">Connect with customers worldwide and expand your market presence</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Community Support</h3>
                    <p className="text-gray-600">Join a vibrant community of artisans and craft enthusiasts</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <LightBulbIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Trend Insights</h3>
                    <p className="text-gray-600">Stay ahead with AI-powered market trends and consumer insights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Discover unique handcrafted items from talented artisans
              </p>
            </div>
            <Link to="/products" className="btn-outline">
              View All
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Artisan Stories
              </h2>
              <p className="text-xl text-gray-600">
                Read about the journey and inspiration behind each creation
              </p>
            </div>
            <Link to="/posts" className="btn-outline">
              View All
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of artisans who are already using ArtisanAlly to grow their business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <Link to="/register" className="bg-gray-900 text-white hover:bg-gray-800 font-medium py-3 px-8 rounded-lg transition-colors">
                Get Started Today
              </Link>
            )}
            <Link to="/ai-tools" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Try AI Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
