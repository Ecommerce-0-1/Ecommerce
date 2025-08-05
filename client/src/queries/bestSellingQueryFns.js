import { get, post, del } from "../configs/api";

// ===============================
// BEST SELLING PRODUCTS API FUNCTIONS
// ===============================

// GET - Fetch all best selling products
export const getBestSellingProducts = async () => {
  try {
    const response = await get('/bsp/get');
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Fetch single best selling product by ID
export const getBestSellingProductById = async (id) => {
  try {
    const response = await get(`/bsp/get/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Fetch best selling products by month
export const getBestSellingProductsByMonth = async () => {
  try {
    const response = await get('/bsp/month');
    return response;
  } catch (error) {
    throw error;
  }
};

// POST - Create best selling product record (Admin only)
export const createBestSellingProduct = async (productData) => {
  try {
    const response = await post('/ctgy/create', productData);
    return response;
  } catch (error) {
    throw error;
  }
};

// POST - Update best selling product record (Admin only)
export const updateBestSellingProduct = async (id, productData) => {
  try {
    const response = await post(`/ctgy/update/${id}`, productData);
    return response;
  } catch (error) {
    throw error;
  }
};

// DELETE - Delete best selling product record (Admin only)
export const deleteBestSellingProduct = async (id) => {
  try {
    const response = await del(`/ctgy/delete/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
