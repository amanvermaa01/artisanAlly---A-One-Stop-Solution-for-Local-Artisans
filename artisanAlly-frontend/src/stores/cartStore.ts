import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "../types";
import { cartAPI } from "../services/api";
import toast from "react-hot-toast";

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addToCart: async (product: Product, quantity: number) => {
        set({ isLoading: true });
        try {
          await cartAPI.addToCart({ productId: product._id, quantity });

          set((state) => {
            const existingItem = state.items.find(
              (item) => item.product._id === product._id
            );

            if (existingItem) {
              return {
                items: state.items.map((item) =>
                  item.product._id === product._id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
                isLoading: false,
              };
            } else {
              return {
                items: [...state.items, { product, quantity }],
                isLoading: false,
              };
            }
          });

          toast.success("Added to cart!");
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || "Failed to add to cart");
        }
      },

      removeFromCart: async (productId: string) => {
        set({ isLoading: true });
        try {
          await cartAPI.removeFromCart(productId);

          set((state) => ({
            items: state.items.filter((item) => item.product._id !== productId),
            isLoading: false,
          }));

          toast.success("Removed from cart!");
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(
            error.response?.data?.message || "Failed to remove from cart"
          );
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const originalItems = get().items;

        // Optimistic update
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          ),
        }));

        try {
          await cartAPI.updateCartItemQuantity({ productId, quantity });
        } catch (error: any) {
          // Revert on error
          set({ items: originalItems });
          toast.error(
            error.response?.data?.message || "Failed to update quantity"
          );
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await cartAPI.getCart();
          set({ items: response.data.items || [], isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || "Failed to fetch cart");
        }
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
