import {create} from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

// Client-side validation helper
const validateProductData = (productData) => {
  const errors = [];
  
  if (!productData.name || productData.name.trim().length < 2) {
    errors.push("Product name must be at least 2 characters");
  }
  
  if (!productData.description || productData.description.trim().length < 10) {
    errors.push("Description must be at least 10 characters");
  }
  
  if (!productData.category) {
    errors.push("Category is required");
  }
  
  const price = Number(productData.price);
  if (isNaN(price) || price < 0) {
    errors.push("Price must be a valid positive number");
  }
  
  const stock = Number(productData.stock);
  if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.push("Stock must be a valid non-negative integer");
  }
  
  const minimumStock = Number(productData.minimumStock);
  if (isNaN(minimumStock) || minimumStock < 0 || !Number.isInteger(minimumStock)) {
    errors.push("Minimum stock must be a valid non-negative integer");
  }
  
  if (minimumStock > stock) {
    errors.push("Minimum stock cannot be greater than current stock");
  }
  
  if (!productData.image) {
    errors.push("Product image is required");
  }
  
  return errors;
};

const validateProductId = (id) => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const useProductStore = create((set) => ({
    products: [],
    loading: false,
    selectedProduct: null,
    
    setProducts: (products) => set({products}),

    createProduct: async (productData) => {
        // Client-side validation
        const validationErrors = validateProductData(productData);
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error));
            return { success: false, errors: validationErrors };
        }

        set({loading: true});
        try {
            const response = await axios.post('/products/addProduct', productData);
            set((state) => ({
                products: [...state.products, response.data.product],
                loading: false,
            }));
            toast.success("Product created successfully");
            return { success: true, product: response.data.product };
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create product";
            const errors = error.response?.data?.errors || [errorMessage];
            
            errors.forEach(err => toast.error(err));
            set({loading: false});
            return { success: false, errors };
        }
    },

    getProductById: async (productId) => {
        // Validate product ID format
        if (!validateProductId(productId)) {
            toast.error("Invalid product ID format");
            return null;
        }

        set({ loading: true, selectedProduct: null });
        try {
            const response = await axios.get(`/products/${productId}`);
            set({ 
                selectedProduct: response.data.product, 
                loading: false 
            });
            return response.data.product;
        } catch (error) {
            set({ loading: false, selectedProduct: null });
            const errorMessage = error.response?.data?.message || "Failed to fetch product";
            toast.error(errorMessage);
            throw error;
        }
    },

    updateProduct: async (productId, productData) => {
        // Validate product ID format
        if (!validateProductId(productId)) {
            toast.error("Invalid product ID format");
            return { success: false, errors: ["Invalid product ID format"] };
        }

        // Client-side validation
        const validationErrors = validateProductData(productData);
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error));
            return { success: false, errors: validationErrors };
        }

        set({ loading: true });
        try {
            const response = await axios.patch(`/products/${productId}`, productData);
            set((prevState) => ({
                products: prevState.products.map((product) =>
                    product._id === productId ? response.data.product : product
                ),
                selectedProduct: response.data.product,
                loading: false,
            }));
            toast.success("Product updated successfully");
            return { success: true, product: response.data.product };
        } catch (error) {
            set({ loading: false });
            const errorMessage = error.response?.data?.message || "Failed to update product";
            const errors = error.response?.data?.errors || [errorMessage];
            
            errors.forEach(err => toast.error(err));
            return { success: false, errors };
        }
    },

    toggleFeaturedProduct: async (productId) => {
        // Validate product ID format
        if (!validateProductId(productId)) {
            toast.error("Invalid product ID format");
            return;
        }

        set({ loading: true });
        try {
            const response = await axios.patch(`/products/${productId}/toggleFeatured`);
            set((prevProducts) => ({
                products: prevProducts.products.map((product) =>
                    product._id === productId ? response.data.updatedProduct : product
                ),
                loading: false,
            }));
            toast.success("Product updated successfully");
        } catch (error) {
            set({ loading: false });
            const errorMessage = error.response?.data?.message || "Failed to update product";
            toast.error(errorMessage);
        }
    },

    deleteProduct: async (productId) => {
        // Validate product ID format
        if (!validateProductId(productId)) {
            toast.error("Invalid product ID format");
            return;
        }

        set({ loading: true });
        try {
            await axios.delete(`/products/${productId}`);
            set((prevProducts) => ({
                products: prevProducts.products.filter((product) => product._id !== productId),
                loading: false,
            }));
            toast.success("Product deleted successfully");
        } catch (error) {
            set({ loading: false });
            const errorMessage = error.response?.data?.message || "Failed to delete product";
            toast.error(errorMessage);
        }
    },

    // Keep your existing fetchAllProducts and fetchFeaturedProducts methods unchanged

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

    fetchFeaturedProducts: async() => {
        set({loading: true});
        try {
            const response = await axios.get('/products/featuredProducts');
            set({products: response.data.featuredProducts, loading: false});
        } catch (error) {
            set({error: "Failed to fetch featured products", loading: false});
            toast.error(error.response.data.error || "Failed to fetch featured products");
        }
    }
}));
