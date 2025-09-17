import {create} from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

export const useProductStore = create((set) => ({
    products: [],
    loading: false,
    selectedProduct: null, // Add state for selected product
    
    setProducts: (products) => set({products}),

    createProduct: async (productData) => {
        set({loading: true});
        try {
            const response = await axios.post('/products/addProduct', productData);
            set((state) => ({
                products: [...state.products, response.data],
                loading: false,
            }));
            toast.success("Product created successfully");
        } catch (error) {
            toast.error(error.response.data.error);
            set({loading: false});
        }
    },

    fetchAllProducts: async() => {
        set({loading: true});
        try {
            const response = await axios.get('/products/allProducts');
            set({products: response.data.products, loading: false});
        } catch (error) {
            set({error: "Failed to fetch products", loading: false});
            toast.error(error.response.data.error || "Failed to fetch products");
        }
    },

    getProductById: async (productId) => {
        set({ loading: true, selectedProduct: null });
        try {
            const response = await axios.get(`/products/${productId}`);
            set({ 
                selectedProduct: response.data.product, 
                loading: false 
            });
            return response.data.product; // Return the product for direct use
        } catch (error) {
            set({ loading: false, selectedProduct: null });
            const errorMessage = error.response?.data?.message || "Failed to fetch product";
            toast.error(errorMessage);
            throw error; // Re-throw for component error handling
        }
    },

    updateProduct: async (productId, productData) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/products/${productId}`, productData);
            set((prevState) => ({
                products: prevState.products.map((product) =>
                    product._id === productId ? response.data.product : product
                ),
                selectedProduct: response.data.product, // Update selected product if it's the same
                loading: false,
            }));
            toast.success("Product updated successfully");
            return response.data.product;
        } catch (error) {
            set({ loading: false });
            const errorMessage = error.response?.data?.message || "Failed to update product";
            toast.error(errorMessage);
            throw error;
        }
    },

    
    toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}/toggleFeatured`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === response.data._id ? response.data : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	},

    deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	}

})); 
