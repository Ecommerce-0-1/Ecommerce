import React, { useState } from "react";
import { FiStar, FiShoppingCart, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, discount }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Handle product click to navigate to details page
  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent product click navigation
    alert("Product added to cart!"); // Placeholder for cart functionality
  };

  // Handle wishlist
  const handleWishlist = (e) => {
    e.stopPropagation(); // Prevent product click navigation
    alert("Product added to wishlist!"); // Placeholder for wishlist functionality
  };

  // Calculate discounted price
  const originalPrice = product.price;
  const discountPercentage = discount?.discount_percentage || 0;
  const finalPrice = discount?.final_price || originalPrice;

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FiStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-md text-sm font-medium z-10">
          -{discountPercentage}%
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 z-10"
      >
        <FiHeart className="w-4 h-4 text-gray-600 hover:text-primary" />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.img || "/api/placeholder/300/300"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Add to Cart Button - Shows on Hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white py-3 px-4 transform transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-buttonHover transition-colors duration-300 py-2 px-4 rounded-md font-medium"
          >
            <FiShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-medium text-textColor2 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-primary">
            ${finalPrice.toFixed(2)}
          </span>
          {discountPercentage > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-sm text-gray-500 ml-1">
            ({product.rating || 0})
          </span>
        </div>

        {/* Stock Status */}
        <div className="text-sm text-gray-500">
          {product.qty > 0 ? (
            <span className="text-green-600">In Stock ({product.qty} available)</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
