import React, { useState } from "react";
import { FiStar, FiShoppingCart, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../providers/CartProvider";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from "../../queries/wishlistQueryFns";
import { toast } from "react-toastify";

const ProductCard = ({ product, discount }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  // Check if product is in wishlist
  const { data: wishlistStatus } = useQuery({
    queryKey: ["wishlistStatus", product.id],
    queryFn: () => checkWishlistStatus(product.id),
    enabled: !!product.id,
  });

  const isInWishlist = wishlistStatus?.in_wishlist || false;

  // Wishlist mutations
  const addToWishlistMutation = useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      toast.success("Added to wishlist!");
      queryClient.invalidateQueries(["wishlistStatus", product.id]);
      queryClient.invalidateQueries(["userWishlist"]);
    },
    onError: () => {
      toast.error("Failed to add to wishlist");
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      toast.success("Removed from wishlist!");
      queryClient.invalidateQueries(["wishlistStatus", product.id]);
      queryClient.invalidateQueries(["userWishlist"]);
    },
    onError: () => {
      toast.error("Failed to remove from wishlist");
    },
  });

  // Handle product click to navigate to details page
  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent product click navigation
    addToCart(product, 1, discount);
  };

  // Handle wishlist
  const handleWishlist = (e) => {
    e.stopPropagation(); // Prevent product click navigation
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(product.id);
    } else {
      addToWishlistMutation.mutate(product.id);
    }
  };

  // Calculate discounted price
  const originalPrice = product.price;
  const discountPercentage = discount?.discount_percentage || 0;
  const finalPrice = isNaN(Number(discount?.final_price))
    ? originalPrice
    : Number(discount.final_price);

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
        <FiStar
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50"
        />
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
        <FiHeart 
          className={`w-4 h-4 transition-colors duration-300 ${
            isInWishlist ? "text-red-500 fill-current" : "text-gray-600 hover:text-primary"
          }`} 
        />
      </button>

      {/* Product Image */}
      <div className="relative bg-white border rounded-lg p-4 group transition-shadow hover:shadow-md">
        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}

        {/* Product Image */}
        <div className="relative flex items-center justify-center aspect-square overflow-hidden bg-gray-100 rounded">
          <img
            src={product.img || "/api/placeholder/300/300"}
            alt={product.name}
            className="max-h-[90%] max-w-90%] object-contain transition-transform duration-300 group-hover:scale-105"
          />

          {/* Add to Cart Button - Shows on Hover */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white py-2 px-3 transition-all duration-300 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <button
              onClick={handleAddToCart}
              disabled={product.qty <= 0}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-buttonHover disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 py-2 px-4 rounded font-medium text-sm"
            >
              <FiShoppingCart className="w-4 h-4" />
              {product.qty > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
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
            ${finalPrice?.toFixed(2)}
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
            <span className="text-green-600">
              In Stock ({product.qty} available)
            </span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
