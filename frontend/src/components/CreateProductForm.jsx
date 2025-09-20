import React from 'react'
import { useState } from 'react'
import { CirclePlus, Upload, Loader } from 'lucide-react'
import { useProductStore } from '../stores/useProductStore';

const categories = ["Kasthausadhi", "Rasaushadhi", "Jangama", "Kwatha", "Kalka"];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState ({
    name: "",
    description: "",
    category: "",
    price:"",
    stock: "",
    minimumStock: "",
    image: "",
    isFeatured: false
  });

  const {createProduct, loading} = useProductStore();

  const [errors, setErrors] = useState({
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  minimumStock: "",
  image: ""
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!newProduct.name.trim()) newErrors.name = "Name is required";
    if (!newProduct.description.trim()) newErrors.description = "Description is required";
    if (!newProduct.category.trim()) newErrors.category = "Category is required";
    if (!newProduct.image) newErrors.image = "Image is required";

   
    if (!newProduct.price || newProduct.price.trim() === "") {
      newErrors.price = "Price is required";
    } else if (Number(newProduct.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!newProduct.stock || newProduct.stock.trim() === "") {
      newErrors.stock = "Stock is required";
    } else if (Number(newProduct.stock) <= 0) {
      newErrors.stock = "Stock must be a positive number";
    }

    if (!newProduct.minimumStock || newProduct.minimumStock.trim() === "") {
      newErrors.minimumStock = "Minimum stock is required";
    } else if (Number(newProduct.minimumStock) <= 0) {
      newErrors.minimumStock = "Minimum stock must be a positive number";
    }

     setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await createProduct(newProduct);
      setNewProduct({name: "", description: "", category: "", price:"", stock: "", minimumStock: "", image: "", isFeatured: false});
      setErrors({});
    } catch (error) {
      console.error("Error creating product:", error);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file); // base64
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Form Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CirclePlus className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Product</h2>
        <p className="text-gray-600">Add a new Ayurvedic product to your inventory</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            required
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Enter product name"
          />
          {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            required
            rows={4}
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
            placeholder="Enter product description"
          />
          {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
        </div>

        {/* Category and Price Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <span className="text-red-500 text-xs">{errors.category}</span>}
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
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="0.00"
            />
            {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
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
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter current stock"
            />
            {errors.stock && <span className="text-red-500 text-xs">{errors.stock}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Stock Level *
            </label>
            <input
              type="number"
              required
              min="0"
              value={newProduct.minimumStock}
              onChange={(e) => setNewProduct({ ...newProduct, minimumStock: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter minimum stock"
            />
            {errors.minimumStock && <span className="text-red-500 text-xs">{errors.minimumStock}</span>}
          </div>
        </div>

        {/* Featured Product Checkbox */}
        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <input
            type="checkbox"
            id="isFeatured"
            checked={newProduct.isFeatured}
            onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
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
          {newProduct.image && (
            <div className="mt-4">
              <img
                src={newProduct.image}
                alt="Product preview"
                className="h-32 w-32 object-cover rounded-lg mx-auto border-2 border-gray-200"
              />
              {errors.image && <span className="text-red-500 text-xs">{errors.image}</span>}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Creating Product...
              </>
            ) : (
              <>
                <CirclePlus className="w-5 h-5 mr-2" />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProductForm
