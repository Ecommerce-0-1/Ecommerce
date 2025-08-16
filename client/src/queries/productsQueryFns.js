import { get, post, patch, del } from "../configs/api";

// ===============================
// PRODUCTS API FUNCTIONS
// ===============================

// GET - Fetch all products
export const getAllProducts = async () => {
  try {
    const response = await get('/api/products/get');
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Fetch single product by ID
export const getProductById = async (id) => {
  try {
    const response = await get(`/api/products/get/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// POST - Create new product (Admin only)
export const createProduct = async (productData) => {
  try {
    const response = await post('/api/products/create', productData);
    return response;
  } catch (error) {
    throw error;
  }
};

// POST - Create multiple products (Admin only)
export const createMultipleProducts = async (productsData) => {
  try {
    const response = await post('/api/products/bulk-create', { products: productsData });
    return response;
  } catch (error) {
    throw error;
  }
};

// PATCH - Update product (Admin only)
export const updateProduct = async (id, productData) => {
  try {
    const response = await patch(`/api/products/update/${id}`, productData);
    return response;
  } catch (error) {
    throw error;
  }
};

// DELETE - Delete product (Admin only)
export const deleteProduct = async (id) => {
  try {
    const response = await del(`/api/products/delete/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
