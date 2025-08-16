import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../providers/CartProvider";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart,
  } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleClearCart = () => {
    if (items.length === 0) {
      toast.info("Your cart is already empty!");
      return;
    }
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
            </div>
            <button
              onClick={handleContinueShopping}
              className="bg-primary hover:bg-buttonHover text-white font-medium py-3 px-6 rounded-md transition-colors duration-300"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition-colors duration-300"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
            <span className="text-gray-500">({getCartCount()} items)</span>
          </div>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-medium transition-colors duration-300"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Cart Items
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.product.id} className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.img || "/api/placeholder/100/100"}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-800 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.product.description ||
                            "No description available"}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                className="p-2 hover:bg-gray-100 transition-colors duration-200"
                                disabled={item.quantity <= 1}
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 text-center min-w-[3rem]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-2 hover:bg-gray-100 transition-colors duration-200"
                                disabled={item.quantity >= item.product.qty}
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-600 hover:text-red-700 transition-colors duration-200"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-lg font-bold text-primary">
                          $
                          {(item.product.finalPrice * item.quantity).toFixed(2)}
                        </div>
                        {item.discount && (
                          <div className="text-sm text-gray-500 line-through">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          ${item.product.finalPrice.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-primary hover:bg-buttonHover text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 mb-4"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full border border-gray-300 text-gray-700 hover:border-primary hover:text-primary font-medium py-3 px-6 rounded-md transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
