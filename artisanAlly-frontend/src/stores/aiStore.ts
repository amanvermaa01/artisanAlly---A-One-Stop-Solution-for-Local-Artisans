import { create } from "zustand";
import { AITrends, AIDescription, AIImageTags, AISearchResult } from "../types";
import { aiAPI } from "../services/api";
import toast from "react-hot-toast";

interface AIState {
  trends: AITrends | null;
  isLoading: boolean;
  getTrends: (location: string, productType: string) => Promise<void>;
  generateDescription: (
    name: string,
    keywords: string[]
  ) => Promise<AIDescription | null>;
  getImageTags: (imageUrl: string) => Promise<AIImageTags | null>;
  semanticSearch: (query: string) => Promise<AISearchResult | null>;
  generateCaption: (imageUrl: string) => Promise<{ caption: string } | null>;
  generateHashtags: (caption: string) => Promise<{ hashtags: string } | null>;
}

export const useAIStore = create<AIState>((set) => ({
  trends: null,
  isLoading: false,

  getTrends: async (location: string, productType: string) => {
    set({ isLoading: true });
    try {
      const response = await aiAPI.getTrends(location, productType);
      set({ trends: response.data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to fetch trends");
    }
  },

  generateDescription: async (name: string, keywords: string[]) => {
    set({ isLoading: true });
    try {
      const response = await aiAPI.generateDescription({ name, keywords });
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(
        error.response?.data?.message || "Failed to generate description"
      );
      return null;
    }
  },

  getImageTags: async (imageUrl: string) => {
    set({ isLoading: true });
    try {
      const response = await aiAPI.getImageTags({ imageUrl });
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to get image tags");
      return null;
    }
  },

  semanticSearch: async (query: string) => {
    set({ isLoading: true });
    try {
      const response = await aiAPI.semanticSearch({ query });
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to perform search");
      return null;
    }
  },

  generateCaption: async (imageUrl: string) => {
    set({ isLoading: true });
    try {
      const response = await aiAPI.generateCaption({ imageUrl });
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to generate caption");
      return null;
    }
  },

  generateHashtags: async (caption: string) => {
    set({ isLoading: true });
    try {
      const response = await aiAPI.generateHashtags({ caption });
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to generate hashtags");
      return null;
    }
  },
}));
