export interface User {
  _id: string;
  name: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  location: string;
  mobile: string;
  bio?: string;
  role: "customer" | "artisan";
  category?: string;
  googleId?: string;
  githubId?: string;
  profilePicture?: string;
  backgroundPhoto?: string;
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  artist: User;
  name: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  aiStory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  user: User;
  title: string;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  product: Product;
  buyer: User;
  artist: User;
  price: number;
  status: string;
  createdAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AITrends {
  trends: string[];
  insights: string[];
  recommendations: string[];
}

export interface AIDescription {
  description: string;
  tags: string[];
  marketingTips: string[];
}

export interface AIImageTags {
  tags: string[];
  confidence: number[];
}

export interface AISearchResult {
  products: Product[];
  posts: Post[];
  users: User[];
}
