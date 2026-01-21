import { create } from "zustand";
import { Product } from "../types";
import { productsAPI } from "../services/api";
import toast from "react-hot-toast";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  createProduct: (data: FormData | {
    name: string;
    description?: string;
    price: number;
    stock: number;
    images?: string[];
  }) => Promise<boolean>;
  updateProduct: (
    id: string,
    data: FormData | {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      images?: string[];
    }
  ) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  searchProducts: (query: string) => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await productsAPI.getAllProducts();
      set({ products: response.data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  },

  fetchProduct: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await productsAPI.getProduct(id);
      set({ currentProduct: response.data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to fetch product");
    }
  },

  createProduct: async (data) => {
    set({ isLoading: true });
    try {
      const response = await productsAPI.createProduct(data);
      const newProduct = response.data;
      set((state) => ({
        products: [newProduct, ...state.products],
        isLoading: false,
      }));
      toast.success("Product created successfully!");
      return true;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to create product");
      return false;
    }
  },

  updateProduct: async (id: string, data) => {
    set({ isLoading: true });
    try {
      const response = await productsAPI.updateProduct(id, data);
      const updatedProduct = response.data;
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? updatedProduct : product
        ),
        currentProduct:
          state.currentProduct?._id === id
            ? updatedProduct
            : state.currentProduct,
        isLoading: false,
      }));
      toast.success("Product updated successfully!");
      return true;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to update product");
      return false;
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true });
    try {
      await productsAPI.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
        currentProduct:
          state.currentProduct?._id === id ? null : state.currentProduct,
        isLoading: false,
      }));
      toast.success("Product deleted successfully!");
      return true;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to delete product");
      return false;
    }
  },

  searchProducts: (query: string) => {
    const { products } = get();
    if (!query) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase()) ||
        product.artist?.name.toLowerCase().includes(query.toLowerCase())
    );
  },
}));
