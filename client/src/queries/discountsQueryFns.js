import { get, patch, del } from "../configs/api";

// ===============================
// DISCOUNTS API FUNCTIONS
// ===============================

// GET - Fetch all discounted products
export const getDiscountedProducts = async () => {
  try {
    const response = await get('/api/discounts/get');
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Fetch single discount by ID
export const getDiscountById = async (id) => {
  try {
    const response = await get(`/api/discounts/get/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// PATCH - Update discount (Admin only)
export const updateDiscount = async (id, discountData) => {
  try {
    const response = await patch(`/api/discounts/update/${id}`, discountData);
    return response;
  } catch (error) {
    throw error;
  }
};

// DELETE - Delete discount (Admin only)
export const deleteDiscount = async (id) => {
  try {
    const response = await del(`/api/discounts/delete/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
