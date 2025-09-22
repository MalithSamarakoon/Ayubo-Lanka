// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useProductStore } from "../stores/useProductStore";
import { addItem } from "../utils/cart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { selectedProduct, loading, getProductById, error } = useProductStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) getProductById(id);
  }, [id, getProductById]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    if (typeof selectedProduct.stock !== "undefined" && selectedProduct.stock <= 0) {
      toast.error("Out of stock");
      return;
    }
    addItem(selectedProduct, quantity);
    toast.success("Added to cart successfully");
    // stay on page; Navbar badge auto-updates
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;
    if (typeof selectedProduct.stock !== "undefined" && selectedProduct.stock <= 0) {
      toast.error("Out of stock");
      return;
    }
    addItem(selectedProduct, quantity);
    navigate("/order-form"); // ✅ your route name in App.jsx
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse grid md:grid-cols-2 gap-8">
          <div className="h-80 bg-gray-100 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded" />
            <div className="h-6 bg-gray-100 rounded w-2/3" />
            <div className="h-32 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-red-600">
        Failed to load product: {String(error)}
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4">
          Product not found.
        </div>
      </div>
    );
  }

  const {
    _id,
    name,
    title,
    productName,
    price,
    image,
    images,
    description,
    details,
    stock,
    category,
    brand,
  } = selectedProduct || {};

  const displayName = name || title || productName || "Product";
  const displayPrice = Number(price || 0);
  const displayImg =
    image || (Array.isArray(images) && images.length > 0 ? images[0] : null);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li>
            <button
              onClick={() => navigate(-1)}
              className="hover:text-gray-700 underline-offset-2"
            >
              Back
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-800 font-medium truncate max-w-[40ch]">
            {displayName}
          </li>
        </ol>
      </nav>

      {/* Main */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-white border rounded-2xl p-4">
          {displayImg ? (
            <img
              src={displayImg}
              alt={displayName}
              className="w-full h-96 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-96 bg-gray-100 rounded-xl grid place-items-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {displayName}
          </h1>

          {(category || brand) && (
            <div className="text-sm text-gray-600">
              {category && (
                <span className="mr-3">
                  <span className="font-semibold">Category:</span> {category}
                </span>
              )}
              {brand && (
                <span>
                  <span className="font-semibold">Brand:</span> {brand}
                </span>
              )}
            </div>
          )}

          <div className="text-2xl font-semibold text-emerald-700">
            Rs. {displayPrice.toFixed(2)}
          </div>

          <p className="text-gray-700 leading-relaxed">
            {description || details || "No description available."}
          </p>

          {typeof stock !== "undefined" && (
            <div
              className={`text-sm font-medium ${
                stock > 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {stock > 0 ? `${stock} in stock` : "Out of stock"}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Qty</span>
            <div className="flex items-center border rounded-lg">
              <button
                className="px-3 py-1 text-lg"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <input
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-14 text-center border-x py-1 outline-none"
              />
              <button
                className="px-3 py-1 text-lg"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              className="px-5 py-3 rounded-xl bg-black text-white hover:opacity-90"
              disabled={stock === 0}
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="px-5 py-3 rounded-xl border hover:bg-gray-50"
              disabled={stock === 0}
            >
              Buy Now
            </button>
          </div>

          {_id && (
            <div className="text-xs text-gray-400 mt-2 select-all">
              Product ID: {_id}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
