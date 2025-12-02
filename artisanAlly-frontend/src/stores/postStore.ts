import { create } from "zustand";
import { Post } from "../types";
import { postsAPI } from "../services/api";
import toast from "react-hot-toast";

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
  fetchPost: (id: string) => Promise<void>;
  createPost: (data: FormData | {
    title: string;
    content: string;
    image?: string;
  }) => Promise<boolean>;
  updatePost: (
    id: string,
    data: FormData | {
      title?: string;
      content?: string;
      image?: string;
    }
  ) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  searchPosts: (query: string) => Post[];
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,

  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const response = await postsAPI.getAllPosts();
      set({ posts: response.data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to fetch posts");
    }
  },

  fetchPost: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await postsAPI.getPost(id);
      set({ currentPost: response.data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to fetch post");
    }
  },

  createPost: async (data) => {
    set({ isLoading: true });
    try {
      const response = await postsAPI.createPost(data);
      const newPost = response.data;
      set((state) => ({
        posts: [newPost, ...state.posts],
        isLoading: false,
      }));
      toast.success("Post created successfully!");
      return true;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to create post");
      return false;
    }
  },

  updatePost: async (id: string, data) => {
    set({ isLoading: true });
    try {
      const response = await postsAPI.updatePost(id, data);
      const updatedPost = response.data;
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === id ? updatedPost : post
        ),
        currentPost:
          state.currentPost?._id === id
            ? updatedPost
            : state.currentPost,
        isLoading: false,
      }));
      toast.success("Post updated successfully!");
      return true;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to update post");
      return false;
    }
  },

  deletePost: async (id: string) => {
    set({ isLoading: true });
    try {
      await postsAPI.deletePost(id);
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== id),
        currentPost: state.currentPost?._id === id ? null : state.currentPost,
        isLoading: false,
      }));
      toast.success("Post deleted successfully!");
      return true;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to delete post");
      return false;
    }
  },

  likePost: async (postId: string) => {
    try {
      // Make API call to toggle like
      const response = await postsAPI.toggleLike(postId);
      
      // Update local state based on response
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? { ...post, likes: response.data.likes || [] }
            : post
        ),
        currentPost:
          state.currentPost?._id === postId
            ? { ...state.currentPost, likes: response.data.likes || [] }
            : state.currentPost,
      }));
    } catch (error: any) {
      console.error('Like post error:', error);
      toast.error(error.response?.data?.message || "Failed to like post");
    }
  },

  addComment: async (postId: string, text: string) => {
    try {
      const response = await postsAPI.addComment(postId, { text });
      const updatedComments = response.data;
      
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? { ...post, comments: updatedComments }
            : post
        ),
        currentPost:
          state.currentPost?._id === postId
            ? { ...state.currentPost, comments: updatedComments }
            : state.currentPost,
      }));
      
      toast.success("Comment added successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  },

  searchPosts: (query: string) => {
    const { posts } = get();
    if (!query) return posts;

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.user.name.toLowerCase().includes(query.toLowerCase())
    );
  },
}));
