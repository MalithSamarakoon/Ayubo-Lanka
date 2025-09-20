import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
// If you already have a cart store, you can import it like this:
// import { useCartStore } from "../stores/useCartStore";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProduct, loading, getProductById } = useProductStore();
  const [quantity, setQuantity] = useState(1);
  // const { addItem } = useCartStore(); // optional, if you maintain a cart store

  useEffect(() => {
    if (id) {
      getProductById(id);
    }
  }, [id, getProductById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/collection")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Back to Collection
        </button>
      </div>
    );
  }

  // ✅ Changed Add to Cart
  const handleAddToCart = () => {
    // If you have cart store, you can add product here
    // addItem({ id: selectedProduct._id, name: selectedProduct.name, qty: quantity, price: selectedProduct.price });

    navigate("/Cart", {
      state: {
        flash: `🧺 Added ${quantity} × ${selectedProduct.name} to your cart`,
      },
    });
  };

  // ✅ Changed Buy Now
  const handleBuyNow = () => {
    navigate("/Cart", {
      state: {
        flash: `⚡ Buy Now: ${quantity} × ${selectedProduct.name} (review in cart)`,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600"
            >
              Home
            </button>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <button
                onClick={() => navigate("/collection")}
                className="ml-1 text-sm font-medium text-gray-700 hover:text-green-600 md:ml-2"
              >
                Collection
              </button>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 truncate">
                {selectedProduct.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Product Detail Section */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Product Image */}
        <div className="flex flex-col-reverse">
          <div className="w-full aspect-w-1 aspect-h-1">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-96 object-cover object-center sm:rounded-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {selectedProduct.name}
          </h1>

          {/* Category */}
          <div className="mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {selectedProduct.category}
            </span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-3xl font-bold text-gray-900">
              Rs. {selectedProduct.price?.toLocaleString()}
            </p>
          </div>

          {/* Stock Status */}
          <div className="mt-4">
            {selectedProduct.stock > 0 ? (
              <p className="text-green-600 font-medium">
                ✓ In Stock ({selectedProduct.stock} available)
              </p>
            ) : (
              <p className="text-red-600 font-medium">✗ Out of Stock</p>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <div className="mt-4">
              <p className="text-base text-gray-700 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mt-8">
            <div className="flex items-center space-x-4">
              <label
                htmlFor="quantity"
                className="text-sm font-medium text-gray-700"
              >
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(selectedProduct.stock, quantity + 1))
                  }
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  disabled={quantity >= selectedProduct.stock}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={selectedProduct.stock <= 0}
              className="flex-1 bg-green-600 text-white px-8 py-3 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={selectedProduct.stock <= 0}
              className="flex-1 bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300"
            >
              Buy Now
            </button>
          </div>

          {/* Additional Product Information */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Product Details
                </h4>
                <dl className="mt-2 space-y-1">
                  <div className="flex text-sm">
                    <dt className="font-medium text-gray-700 w-24">Category:</dt>
                    <dd className="text-gray-600">
                      {selectedProduct.category}
                    </dd>
                  </div>
                  <div className="flex text-sm">
                    <dt className="font-medium text-gray-700 w-24">Stock:</dt>
                    <dd className="text-gray-600">
                      {selectedProduct.stock} units
                    </dd>
                  </div>
                  <div className="flex text-sm">
                    <dt className="font-medium text-gray-700 w-24">
                      Min Stock:
                    </dt>
                    <dd className="text-gray-600">
                      {selectedProduct.minimumStock} units
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">Features</h4>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>✓ Authentic Ayurvedic Medicine</li>
                  <li>✓ Natural Herbal Ingredients</li>
                  <li>✓ Traditional Ceylon Formula</li>
                  <li>✓ Quality Assured</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
