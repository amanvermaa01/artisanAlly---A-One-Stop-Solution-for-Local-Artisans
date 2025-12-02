import React, { useState } from 'react';
import { useAIStore } from '../stores/aiStore';
import { 
  SparklesIcon,
  LightBulbIcon,
  TagIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  PhotoIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AITools = () => {
  const { 
    trends, 
    isLoading, 
    getTrends, 
    generateDescription, 
    getImageTags, 
    semanticSearch,
    generateCaption,
    generateHashtags
  } = useAIStore();

  const [activeTool, setActiveTool] = useState('trends');
  const [formData, setFormData] = useState({
    location: 'India',
    productType: 'handicraft',
    productName: '',
    keywords: '',
    imageUrl: '',
    searchQuery: '',
    captionImageUrl: '',
    captionText: '',
  });
  const [results, setResults] = useState<any>(null);

  const tools = [
    {
      id: 'trends',
      name: 'Market Trends',
      description: 'Get AI-powered insights about current market trends',
      icon: ChartBarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'description',
      name: 'Product Description',
      description: 'Generate compelling product descriptions using AI',
      icon: DocumentTextIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 'tags',
      name: 'Image Colors',
      description: 'Extract color palette from product images',
      icon: PhotoIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 'search',
      name: 'Semantic Search',
      description: 'Find products using natural language queries',
      icon: MagnifyingGlassIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      id: 'caption',
      name: 'Image Caption',
      description: 'Generate captions for your product images',
      icon: SparklesIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      id: 'hashtags',
      name: 'Hashtag Generator',
      description: 'Create trending hashtags for social media',
      icon: TagIcon,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTrendsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await getTrends(formData.location, formData.productType);
  };

  const handleDescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const keywords = formData.keywords.split(',').map(k => k.trim()).filter(k => k);
    const result = await generateDescription(formData.productName, keywords);
    setResults(result);
  };

  const handleTagsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await getImageTags(formData.imageUrl);
    setResults(result);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await semanticSearch(formData.searchQuery);
    setResults(result);
  };

  const handleCaptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await generateCaption(formData.captionImageUrl);
    setResults(result);
  };

  const handleHashtagsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await generateHashtags(formData.captionText);
    setResults(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Tools</h1>
          <p className="text-gray-600">
            Leverage AI to enhance your products and reach more customers
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-6 rounded-lg border-2 text-left transition-all ${
                activeTool === tool.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`w-12 h-12 ${tool.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <tool.icon className={`h-6 w-6 ${tool.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
              <p className="text-sm text-gray-600">{tool.description}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tool Interface */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {tools.find(t => t.id === activeTool)?.name}
            </h2>

            {/* Market Trends */}
            {activeTool === 'trends' && (
              <form onSubmit={handleTrendsSubmit} className="space-y-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., India, Mumbai, Delhi"
                  />
                </div>
                <div>
                  <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Type
                  </label>
                  <input
                    type="text"
                    id="productType"
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., handicraft, pottery, textiles"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary"
                >
                  {isLoading ? 'Analyzing...' : 'Get Trends'}
                </button>
              </form>
            )}

            {/* Product Description */}
            {activeTool === 'description' && (
              <form onSubmit={handleDescriptionSubmit} className="space-y-4">
                <div>
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Handmade Ceramic Vase"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., ceramic, handmade, rustic, traditional"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary"
                >
                  {isLoading ? 'Generating...' : 'Generate Description'}
                </button>
              </form>
            )}

            {/* Image Tags */}
            {activeTool === 'tags' && (
              <form onSubmit={handleTagsSubmit} className="space-y-4">
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary"
                >
                  {isLoading ? 'Analyzing...' : 'Extract Tags'}
                </button>
              </form>
            )}

            {/* Semantic Search */}
            {activeTool === 'search' && (
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div>
                  <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Query
                  </label>
                  <input
                    type="text"
                    id="searchQuery"
                    name="searchQuery"
                    value={formData.searchQuery}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., blue ceramic vase for home decoration"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </form>
            )}

            {/* Image Caption */}
            {activeTool === 'caption' && (
              <form onSubmit={handleCaptionSubmit} className="space-y-4">
                <div>
                  <label htmlFor="captionImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="captionImageUrl"
                    name="captionImageUrl"
                    value={formData.captionImageUrl}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="https://example.com/product-image.jpg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary"
                >
                  {isLoading ? 'Generating...' : 'Generate Caption'}
                </button>
              </form>
            )}

            {/* Hashtag Generator */}
            {activeTool === 'hashtags' && (
              <form onSubmit={handleHashtagsSubmit} className="space-y-4">
                <div>
                  <label htmlFor="captionText" className="block text-sm font-medium text-gray-700 mb-1">
                    Caption or Description
                  </label>
                  <textarea
                    id="captionText"
                    name="captionText"
                    value={formData.captionText}
                    onChange={handleInputChange}
                    className="input"
                    rows={3}
                    placeholder="Enter a caption or description to generate hashtags from..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary"
                >
                  {isLoading ? 'Generating...' : 'Generate Hashtags'}
                </button>
              </form>
            )}
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Results</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="spinner"></div>
              </div>
            ) : activeTool === 'trends' && trends ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Current Trends</h3>
                  <div className="space-y-2">
                    {trends.trends?.map((trend, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <SparklesIcon className="h-4 w-4 text-primary-600" />
                        <span className="text-gray-700">{trend}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Insights</h3>
                  <div className="space-y-2">
                    {trends.insights?.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <LightBulbIcon className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <span className="text-gray-700">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Recommendations</h3>
                  <div className="space-y-2">
                    {trends.recommendations?.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <ChartBarIcon className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : results ? (
              <div className="space-y-4">
                {/* Product Description Results */}
                {results.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{results.description}</p>
                  </div>
                )}
                
                {results.tags && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {results.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {results.marketingTips && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Marketing Tips</h3>
                    <ul className="space-y-1">
                      {results.marketingTips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-primary-600">•</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Image Tags Results */}
                {results.confidence && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Extracted Colors</h3>
                    <div className="space-y-2">
                      {results.tags?.map((tag, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div 
                            className="w-6 h-6 rounded border border-gray-300" 
                            style={{ backgroundColor: tag }}
                          ></div>
                          <span className="text-gray-700 font-mono text-sm">{tag}</span>
                          <span className="text-gray-500 text-xs">
                            {(results.confidence[index] * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Caption Results */}
                {results.caption && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Generated Caption</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 italic">"{results.caption}"</p>
                    </div>
                  </div>
                )}
                
                {/* Hashtags Results */}
                {results.hashtags && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Generated Hashtags</h3>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-700 font-mono text-sm">{results.hashtags}</p>
                    </div>
                  </div>
                )}
                
                {/* Semantic Search Results */}
                {(results.products || results.posts || results.users) && (
                  <div className="space-y-6">
                    {results.products && results.products.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Products</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {results.products.map((product) => (
                            <div key={product._id} className="border rounded-lg p-4">
                              <div className="flex space-x-3">
                                {product.images?.[0] && (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                                  <p className="text-primary-600 font-semibold">${product.price}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {results.posts && results.posts.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Posts</h3>
                        <div className="space-y-3">
                          {results.posts.map((post) => (
                            <div key={post._id} className="border rounded-lg p-4">
                              <h4 className="font-medium text-gray-900">{post.title}</h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                              <div className="text-xs text-gray-500 mt-2">
                                by {post.user?.name} • {post.views} views
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {results.users && results.users.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Users</h3>
                        <div className="space-y-3">
                          {results.users.map((user) => (
                            <div key={user._id} className="border rounded-lg p-4">
                              <div className="flex items-center space-x-3">
                                {user.profilePicture && (
                                  <img 
                                    src={user.profilePicture} 
                                    alt={user.name}
                                    className="w-12 h-12 object-cover rounded-full"
                                  />
                                )}
                                <div>
                                  <h4 className="font-medium text-gray-900">{user.name}</h4>
                                  <p className="text-sm text-gray-600">{user.bio}</p>
                                  <p className="text-xs text-gray-500">{user.role} • {user.location}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(!results.products || results.products.length === 0) && 
                     (!results.posts || results.posts.length === 0) && 
                     (!results.users || results.users.length === 0) && (
                      <div className="text-center py-8">
                        <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-600">
                          Try a different search query to find products, posts, or users
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <SparklesIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
                <p className="text-gray-600">
                  Use the AI tools on the left to get insights and recommendations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;
