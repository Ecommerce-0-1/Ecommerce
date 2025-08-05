import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiArrowLeft, FiStar, FiShoppingCart, FiHeart } from "react-icons/fi";
import { getProductById } from "../../queries/getQueryFns";
import { Oval } from "react-loader-spinner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch product details
  const {
    data: productData,
    isLoading,
    error
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id
  });

  const product = productData?.category; // Based on your API response structure

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    alert("Product added to cart!"); // Placeholder
  };

  // Handle add to wishlist
  const handleAddToWishlist = () => {
    alert("Product added to wishlist!"); // Placeholder
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
        <FiStar key="half" className="w-5 h-5 fill-yellow-400 text-yellow-400 opacity-50" />
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
          <h2 className="text-2xl font-bold text-textColor2 mb-4">Product Not Found</h2>
          <p className="text-textColor mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleBack}
            className="bg-primary hover:bg-buttonHover text-white py-2 px-6 rounded-md transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-textColor hover:text-primary transition-colors duration-300 mb-8"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to Products
        </button>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="aspect-square">
              <img
                src={product.img || "/api/placeholder/500/500"}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-textColor2 mb-4">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating || 0)}
                  </div>
                  <span className="text-textColor">
                    ({product.rating || 0}) | {product.units_sold || 0} sold
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-primary">
                    ${product.price?.toFixed(2)}
                  </span>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-textColor2 mb-2">Description</h3>
                  <p className="text-textColor leading-relaxed">
                    {product.description || "No description available for this product."}
                  </p>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    product.qty > 0 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.qty > 0 
                      ? `In Stock (${product.qty} available)` 
                      : "Out of Stock"
                    }
                  </span>
                </div>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
