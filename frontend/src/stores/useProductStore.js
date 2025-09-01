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
            const response = await axios.post('/products', productData);
            set((state) => ({
                products: [...state.products, response.data],
                loading: false,
            }));
        } catch (error) {
            toast.error(error.response.data.error);
            set({loading: false});
        }
    },

})); 
