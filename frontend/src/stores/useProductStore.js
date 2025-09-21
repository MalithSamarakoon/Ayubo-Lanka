// frontend/src/stores/useProductStore.js
import { create } from 'zustand';
import toast from 'react-hot-toast';
import api from '../lib/api'; // ✅ use the consolidated client

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  selectedProduct: null,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/products/addProduct', productData);
      // Backend may return { product } OR the product directly
      const newProduct = data?.product ?? data;
      set((state) => ({
        products: [...state.products, newProduct],
        loading: false,
      }));
      toast.success('Product created successfully');
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        'Failed to create product';
      toast.error(msg);
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/products/allProducts');
      set({
        products: data?.products ?? [],
        loading: false,
      });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to fetch products';
      set({ loading: false });
      toast.error(msg);
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/products/featuredProducts');
      set({
        products: data?.featuredProducts ?? [],
        loading: false,
      });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to fetch featured products';
      set({ loading: false });
      toast.error(msg);
    }
  },

  getProductById: async (productId) => {
    set({ loading: true, selectedProduct: null });
    try {
      const { data } = await api.get(`/products/${productId}`);
      const product = data?.product ?? data;
      set({ selectedProduct: product, loading: false });
      return product;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to fetch product';
      set({ loading: false, selectedProduct: null });
      toast.error(msg);
      throw error;
    }
  },

  updateProduct: async (productId, productData) => {
    set({ loading: true });
    try {
      const { data } = await api.patch(`/products/${productId}`, productData);
      const updated = data?.product ?? data;
      set((state) => ({
        products: state.products.map((p) =>
          p._id === productId ? updated : p
        ),
        selectedProduct:
          state.selectedProduct && state.selectedProduct._id === productId
            ? updated
            : state.selectedProduct,
        loading: false,
      }));
      toast.success('Product updated successfully');
      return updated;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to update product';
      set({ loading: false });
      toast.error(msg);
      throw error;
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const { data } = await api.patch(`/products/${productId}/toggleFeatured`);
      const updated = data?.product ?? data;
      set((state) => ({
        products: state.products.map((p) =>
          p._id === updated?._id ? updated : p
        ),
        loading: false,
      }));
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to update product';
      set({ loading: false });
      toast.error(msg);
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await api.delete(`/products/${productId}`);
      set((state) => ({
        products: state.products.filter((p) => p._id !== productId),
        loading: false,
      }));
      toast.success('Product deleted successfully');
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to delete product';
      set({ loading: false });
      toast.error(msg);
    }
  },
}));
