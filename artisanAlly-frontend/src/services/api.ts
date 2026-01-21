import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Don't redirect, just let the app handle the logged out state
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    gender: string;
    location: string;
    mobile: string;
  }) => api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

// User API
export const userAPI = {
  updateProfile: (data: FormData) =>
    api.put("/user/profile", data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getAllUsers: () => api.get("/user/all"),
  getArtisans: () => api.get("/user/artisans"),
  searchUsers: (query?: string, category?: string) =>
    api.get(`/user/search`, { params: { query, category } }),
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: (category?: string, search?: string) =>
    api.get('/dashboard', { params: { category, search } }),
};

// Profile/Follow API
export const profileAPI = {
  getUserProfile: (id: string) => api.get(`/profile/${id}`),
  followUser: (id: string) => api.post(`/profile/${id}/follow`),
  unfollowUser: (id: string) => api.post(`/profile/${id}/unfollow`),
  // Alternative routes from followRoute.js
  followUserAlt: (id: string) => api.post(`/users/${id}/follow`),
  unfollowUserAlt: (id: string) => api.post(`/users/${id}/unfollow`),
};

// Follow API (new dedicated follow functions)
export const followAPI = {
  getFollowStatus: (id: string) => api.get(`/users/${id}/status`),
  followUser: (id: string) => api.post(`/users/${id}/follow`),
  unfollowUser: (id: string) => api.post(`/users/${id}/unfollow`),
};

// Posts API
export const postsAPI = {
  createPost: (data: FormData | { title: string; content: string; image?: string }) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.post("/posts", data, config);
  },
  getAllPosts: () => api.get("/posts"),
  getPost: (id: string) => api.get(`/posts/${id}`),
  updatePost: (
    id: string,
    data: FormData | {
      title?: string;
      content?: string;
      image?: string;
    }
  ) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.put(`/posts/${id}`, data, config);
  },
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  toggleLike: (id: string) => api.post(`/posts/${id}/like`),
  addComment: (id: string, data: { text: string }) => api.post(`/posts/${id}/comment`, data),
};

// Products API
export const productsAPI = {
  createProduct: (data: FormData | {
    name: string;
    description?: string;
    price: number;
    stock: number;
    images?: string[];
  }) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.post("/products", data, config);
  },
  getAllProducts: () => api.get("/products"),
  getProduct: (id: string) => api.get(`/products/${id}`),
  updateProduct: (
    id: string,
    data: FormData | {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      images?: string[];
    }
  ) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.put(`/products/${id}`, data, config);
  },
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  addToCart: (data: { productId: string; quantity: number }) =>
    api.post("/cart/add", data),
  getCart: () => api.get("/cart"),
  removeFromCart: (productId: string) =>
    api.delete(`/cart/remove/${productId}`),
  updateCartItemQuantity: (data: { productId: string; quantity: number }) =>
    api.put("/cart/update", data),
};

// Checkout API
export const checkoutAPI = {
  createCheckoutSession: (data: {
    cartItems: { productId: string; quantity: number }[];
  }) => api.post("/checkout/create", data),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get("/wishlist"),
  addToWishlist: (productId: string) => api.post("/wishlist/add", { productId }),
  removeFromWishlist: (productId: string) => api.delete(`/wishlist/remove/${productId}`),
};

// AI API
export const aiAPI = {
  getTrends: (location: string, productType: string) =>
    api.get(`/ai/trends?location=${location}&productType=${productType}`),
  generateDescription: (data: { name: string; keywords: string[] }) =>
    api.post("/ai/description", data),
  getImageTags: (data: { imageUrl: string }) =>
    api.post("/ai/image-tags", data),
  semanticSearch: (data: { query: string }) => api.post("/ai/search", data),
  generateCaption: (data: { imageUrl: string }) =>
    api.post("/ai/caption", data),
  generateHashtags: (data: { caption: string }) =>
    api.post("/ai/hashtags", data),
  extractColors: (data: { imageUrl: string }) =>
    api.post("/ai/colors", data),
};

export default api;
