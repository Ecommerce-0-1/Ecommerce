import { get, post, del } from "../configs/api";

// ===============================
// WISHLIST API FUNCTIONS
// ===============================

// GET - Fetch user's wishlist
export const getUserWishlist = async () => {
  try {
    const response = await get("/api/wishlist");
    return response;
  } catch (error) {
    throw error;
  }
};

// POST - Add product to wishlist
export const addToWishlist = async (productId) => {
  try {
    const response = await post("/api/wishlist/add", { product_id: productId });
    return response;
  } catch (error) {
    throw error;
  }
};

// DELETE - Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const response = await del(`/api/wishlist/remove/${productId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// DELETE - Clear user's wishlist
export const clearWishlist = async () => {
  try {
    const response = await del("/api/wishlist/clear");
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Get wishlist count
export const getWishlistCount = async () => {
  try {
    const response = await get("/api/wishlist/count");
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Check if product is in wishlist
export const checkWishlistStatus = async (productId) => {
  try {
    const response = await get(`/api/wishlist/check/${productId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
