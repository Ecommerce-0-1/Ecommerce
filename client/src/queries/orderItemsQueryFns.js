import { get, post, put, del } from "../configs/api";

// ===============================
// ORDER ITEMS API FUNCTIONS
// ===============================

// ===== USER & ADMIN ROUTES (auth:sanctum, role:user,admin) =====

// GET - Fetch user's order items
export const getUserOrderItems = async () => {
  try {
    const response = await get('/order-items/user');
    return response;
  } catch (error) {
    throw error;
  }
};

// POST - Create new order item
export const createOrderItem = async (orderItemData) => {
  try {
    const response = await post('/order-items/create', orderItemData);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUT - Update order item
export const updateOrderItem = async (id, orderItemData) => {
  try {
    const response = await put(`/order-items/update/${id}`, orderItemData);
    return response;
  } catch (error) {
    throw error;
  }
};

// DELETE - Delete order item
export const deleteOrderItem = async (id) => {
  try {
    const response = await del(`/order-items/delete/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// ===== ADMIN ONLY ROUTES (auth:sanctum, role:admin) =====

// GET - Fetch all order items (Admin only)
export const getAllOrderItems = async () => {
  try {
    const response = await get('/order-items/all');
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Fetch single order item by ID (Admin only)
export const getOrderItemById = async (id) => {
  try {
    const response = await get(`/order-items/get/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Fetch order items by order ID (Admin only)
export const getOrderItemsByOrderId = async (orderId) => {
  try {
    const response = await get(`/order-items/order/${orderId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
