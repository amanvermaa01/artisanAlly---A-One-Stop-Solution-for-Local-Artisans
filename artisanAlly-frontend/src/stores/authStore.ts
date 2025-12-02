import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthResponse } from "../types";
import { authAPI, userAPI } from "../services/api";
import toast from "react-hot-toast";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    gender: string;
    location: string;
    mobile: string;
  }) => Promise<boolean>;
  logout: () => void;
  getMe: () => Promise<void>;
  updateProfile: (
    data: FormData | { name?: string; bio?: string; category?: string }
  ) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const normalizedEmail = (email || "").toLowerCase().trim();
          const response = await authAPI.login({
            email: normalizedEmail,
            password,
          });
          const data: AuthResponse = response.data;

          if (data.success) {
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            });
            localStorage.setItem("token", data.token);
            toast.success("Login successful!");
            return true;
          }
          return false;
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || "Login failed");
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register({
            ...userData,
            email: (userData.email || "").toLowerCase().trim(),
          });
          const data: AuthResponse = response.data;

          if (data.success) {
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            });
            localStorage.setItem("token", data.token);
            toast.success("Registration successful!");
            return true;
          }
          return false;
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || "Registration failed");
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        authAPI.logout();
        toast.success("Logged out successfully");
      },

      getMe: async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await authAPI.me();
          const userData = response.data.user || response.data; // Handle both formats
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          localStorage.removeItem("token");
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          let formData: FormData;
          if (data instanceof FormData) {
            formData = data;
          } else {
            formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
              if (value !== undefined) {
                formData.append(key, value as string);
              }
            });
          }

          const response = await userAPI.updateProfile(formData);
          set({
            user: response.data,
            isLoading: false,
          });
          toast.success("Profile updated successfully!");
          return true;
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || "Profile update failed");
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
