import { create } from "zustand";
import { User, Post } from "../types";
import { dashboardAPI } from "../services/api";
import toast from "react-hot-toast";

interface DashboardAnalytics {
  totalFollowers?: number;
  totalFollowing?: number;
  totalPosts?: number;
  totalLikes?: number;
  totalViews?: number;
  totalRevenue?: number;
  totalOrders?: number;
  totalSpent?: number;
  ordersPlaced?: number;
  recentOrders?: any[];
}

interface DashboardState {
  dashboard: "artisan" | "customer" | null;
  analytics?: DashboardAnalytics;
  posts: Post[];
  followers: User[];
  following: User[];
  users: User[];
  artisans: User[];
  isLoading: boolean;
  
  fetchDashboard: (category?: string, search?: string) => Promise<void>;
  clearDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dashboard: null,
  analytics: undefined,
  posts: [],
  followers: [],
  following: [],
  users: [],
  artisans: [],
  isLoading: false,

  fetchDashboard: async (category?: string, search?: string) => {
    set({ isLoading: true });
    try {
      const response = await dashboardAPI.getDashboard(category, search);
      const data = response.data;

      if (data.dashboard === "Artisan" || data.dashboard === "artisan") {
        set({
          dashboard: "artisan",
          analytics: data.analytics,
          posts: data.posts || [],
          followers: data.followers || [],
          following: data.following || [],
          users: data.users || [],
          isLoading: false,
        });
      } else if (data.dashboard === "Customer" || data.dashboard === "customer") {
        set({
          dashboard: "customer",
          analytics: data.analytics,
          artisans: data.artisans || [],
          posts: data.posts || [],
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to fetch dashboard");
    }
  },

  clearDashboard: () => {
    set({
      dashboard: null,
      analytics: undefined,
      posts: [],
      followers: [],
      following: [],
      users: [],
      artisans: [],
      isLoading: false,
    });
  },
}));
