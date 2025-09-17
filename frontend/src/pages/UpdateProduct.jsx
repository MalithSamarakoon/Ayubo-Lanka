import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Upload, Loader, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ["Kasthausadhi", "Rasaushadhi", "Jangama", "Kwatha", "Kalka"];

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    minimumStock: "",
    isFeatured: false
  });
  
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // For displaying existing image
  const [newImageFile, setNewImageFile] = useState(null); // For new image upload
  const [previewImage, setPreviewImage] = useState(""); // For preview of new image
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch product data when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          const product = data.product;
          setProductData({
            name: product.name || "",
            description: product.description || "",
            category: product.category || "",
            price: product.price?.toString() || "",
            stock: product.stock?.toString() || "",
            minimumStock: product.minimumStock?.toString() || "",
            isFeatured: product.isFeatured || false
          });
          // Set the current image URL for display
          setCurrentImageUrl(product.image || "");
        } else {
          toast.error(data.message || "Failed to fetch product");
          navigate('/product-dashboard');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product data");
        navigate('/product-dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Prepare the data to send
      const updateData = { ...productData };
      
      // Only include image if a new one was selected
      if (newImageFile) {
        updateData.image = previewImage; // Send base64 data
      }
      
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Product updated successfully");
        navigate('/product-dashboard');
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Store base64 for upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoBack = () => {
    navigate('/product-dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-300">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={handleGoBack}
            className="mr-4 p-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-semibold text-emerald-300">Update Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
               px-3 text-white focus:outline-none focus:ring-2
              focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              rows="3"
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
               py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
               focus:border-emerald-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={productData.category}
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
               shadow-sm py-2 px-3 text-white focus:outline-none 
               focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
              step="0.01"
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
              py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
               focus:border-emerald-500"
              required
            />
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-300">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={productData.stock}
              onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
              step="0.01"
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
              py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
               focus:border-emerald-500"
              required
            />
          </div>

          {/* Minimum Stock */}
          <div>
            <label htmlFor="minimumStock" className="block text-sm font-medium text-gray-300">
              Minimum Stock
            </label>
            <input
              type="number"
              id="minimumStock"
              name="minimumStock"
              value={productData.minimumStock}
              onChange={(e) => setProductData({ ...productData, minimumStock: e.target.value })}
              step="0.01"
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
              py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
               focus:border-emerald-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Image
            </label>
            {(previewImage || currentImageUrl) && (
              <div className="mb-3">
                <img 
                  src={previewImage || currentImageUrl} 
                  alt="Product preview" 
                  className="w-full h-32 object-cover rounded-md border border-gray-600"
                />
                {previewImage && (
                  <p className="text-sm text-emerald-400 mt-1">New image selected</p>
                )}
              </div>
            )}
            <div className="mt-1 flex items-center">
              <input 
                type="file" 
                id="image" 
                className="sr-only" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
              <label
                htmlFor="image"
                className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Upload className="h-5 w-5 inline-block mr-2" />
                {currentImageUrl ? 'Change Image' : 'Upload Image'}
              </label>
              {previewImage && (
                <span className="ml-3 text-sm text-emerald-400">New image ready to upload</span>
              )}
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={productData.isFeatured}
              onChange={(e) => setProductData({ ...productData, isFeatured: e.target.checked })}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-300">
              Featured Product
            </label>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
            shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;