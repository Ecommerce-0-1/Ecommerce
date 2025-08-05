import { get } from "../configs/api";

// Fetch all discounted products
export const getDiscountedProducts = async () => {
  try {
    const response = await get('/discounts/get');
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetch single product by ID
export const getProductById = async (id) => {
  try {
    const response = await get(`/products/get/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetch all products
export const getAllProducts = async () => {
  try {
    const response = await get('/products/get');
    return response;
  } catch (error) {
    throw error;
  }
};
