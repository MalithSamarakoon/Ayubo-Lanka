import {create} from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

export const useProductStore = create((set) => ({
    products: [],
    loading: false,
    
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
    }

})); 
