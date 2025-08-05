import { get, post, patch, del } from "../configs/api";

// ===============================
// CATEGORIES API FUNCTIONS
// ===============================

// GET - Fetch all categories
export const getAllCategories = async () => {
  try {
    const response = await get('/ctgy/get');
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Fetch single category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await get(`/ctgy/get/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// POST - Create new category (Admin only)
export const createCategory = async (categoryData) => {
  try {
    const response = await post('/ctgy/create', categoryData);
    return response;
  } catch (error) {
    throw error;
  }
};

// POST - Update category (Admin only)
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await post(`/ctgy/update/${id}`, categoryData);
    return response;
  } catch (error) {
    throw error;
  }
};

// DELETE - Delete category (Admin only)
export const deleteCategory = async (id) => {
  try {
    const response = await del(`/ctgy/delete/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
