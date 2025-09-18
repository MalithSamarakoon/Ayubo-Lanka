import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Upload, Loader, ArrowLeft, Edit } from 'lucide-react';
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
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
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
      const updateData = { ...productData };
      if (newImageFile) {
        updateData.image = previewImage;
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
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoBack = () => {
    navigate('/product-dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="animate-spin h-6 w-6 text-green-600" />
          <span className="text-gray-600">Loading product data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="mb-6 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </button>

        <div className="max-w-2xl mx-auto">
          {/* Form Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Edit className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Update Product</h2>
            <p className="text-gray-600">Modify your Ayurvedic product details</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Enter product name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                placeholder="Enter product description"
              />
            </div>

            {/* Category and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={productData.category}
                  onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Stock and Minimum Stock Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={productData.stock}
                  onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter current stock"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Stock Level *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={productData.minimumStock}
                  onChange={(e) => setProductData({ ...productData, minimumStock: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter minimum stock"
                />
              </div>
            </div>

            {/* Featured Product Checkbox */}
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <input
                type="checkbox"
                id="isFeatured"
                checked={productData.isFeatured}
                onChange={(e) => setProductData({ ...productData, isFeatured: e.target.checked })}
                className="w-5 h-5 text-green-600 bg-white border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2 transition-colors"
              />
              <div className="flex-1">
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Featured Product
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Mark this product as featured to display it prominently on the homepage
                </p>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {(previewImage || currentImageUrl) && (
                <div className="mt-4">
                  <img
                    src={previewImage || currentImageUrl}
                    alt="Product preview"
                    className="h-32 w-32 object-cover rounded-lg mx-auto border-2 border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isUpdating ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Updating Product...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
