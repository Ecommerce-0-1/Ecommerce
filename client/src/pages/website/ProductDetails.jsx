import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiArrowLeft, FiStar, FiShoppingCart, FiHeart } from "react-icons/fi";
import { getProductById } from "../../queries/productsQueryFns";
import { useCart } from "../../providers/CartProvider";
import { Oval } from "react-loader-spinner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  const {
    data: productData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  const product = productData?.product; // Based on your API response structure

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  // Handle add to wishlist
  const handleAddToWishlist = () => {
    alert("Product added to wishlist!"); // Placeholder
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.qty || 1)) {
      setQuantity(newQuantity);
    }
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar
          key="half"
          className="w-5 h-5 fill-yellow-400 text-yellow-400 opacity-50"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FiStar key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Oval
          height={50}
          width={50}
          color="#DB4444"
          secondaryColor="#f3f4f6"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={handleBack}
            className="bg-primary hover:bg-buttonHover text-white px-6 py-2 rounded-md transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors duration-300"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Products
            </button>
          </div>

          {/* Product Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={product.img || "/api/placeholder/600/600"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {product.description || "No description available"}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating || 0)}
                  </div>
                  <span className="text-gray-600">
                    ({product.rating || 0} rating)
                  </span>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    ${product.price?.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.qty > 0 ? (
                      <span className="text-green-600">
                        In Stock ({product.qty} available)
                      </span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </div>
                </div>

                {/* Quantity Selector */}
                {product.qty > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md w-fit">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FiArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 text-center min-w-[3rem]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.qty}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FiArrowLeft className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.qty <= 0}
                    className="flex-1 bg-primary hover:bg-buttonHover disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-md transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    {product.qty > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>

                  <button
                    onClick={handleAddToWishlist}
                    className="p-3 border border-gray-300 hover:border-primary hover:text-primary rounded-md transition-colors duration-300"
                  >
                    <FiHeart className="w-5 h-5" />
                  </button>
                </div>

                {/* Product Details */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Product Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span>{product.category?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SKU:</span>
                      <span>{product.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stock:</span>
                      <span>{product.qty} units</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
