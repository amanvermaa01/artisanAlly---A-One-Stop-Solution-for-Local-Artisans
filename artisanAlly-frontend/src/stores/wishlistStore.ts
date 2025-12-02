import { create } from "zustand";
import { Product } from "../types";
import { wishlistAPI } from "../services/api";
import toast from "react-hot-toast";

interface WishlistState {
  wishlistItems: Product[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistItems: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const response = await wishlistAPI.getWishlist();
      set({ wishlistItems: response.data || [], isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      console.error("Failed to fetch wishlist:", error);
      // Don't show error toast for fetching as it's not critical
    }
  },

  addToWishlist: async (productId: string) => {
    try {
      const response = await wishlistAPI.addToWishlist(productId);
      const { wishlistItems } = get();
      
      // Add product to local state if not already there
      if (!wishlistItems.find(item => item._id === productId)) {
        set({ 
          wishlistItems: [...wishlistItems, response.data.product] 
        });
      }
      
      toast.success("Added to wishlist!");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
      return false;
    }
  },

  removeFromWishlist: async (productId: string) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      const { wishlistItems } = get();
      
      set({ 
        wishlistItems: wishlistItems.filter(item => item._id !== productId)
      });
      
      toast.success("Removed from wishlist!");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove from wishlist");
      return false;
    }
  },

  isInWishlist: (productId: string) => {
    const { wishlistItems } = get();
    return wishlistItems.some(item => item._id === productId);
  },

  clearWishlist: () => {
    set({ wishlistItems: [] });
  }
}));
