import { get, post, put, del } from "../configs/api";

// ===============================
// ORDERS API FUNCTIONS
// ===============================

// ===== USER & ADMIN ROUTES (auth:sanctum, role:user,admin) =====

// GET - Fetch user's orders
export const getUserOrders = async () => {
  try {
    const response = await get('/api/orders/user');
    return response;
  } catch (error) {
    throw error;
  }
};

// POST - Create new order
export const createOrder = async (orderData) => {
  try {
    const response = await post('/api/orders/create', orderData);
    return response;
  } catch (error) {
    throw error;
  }
};

// ===== ADMIN ONLY ROUTES (auth:sanctum, role:admin) =====

// GET - Fetch all orders (Admin only)
export const getAllOrders = async () => {
  try {
    const response = await get('/api/orders/all');
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Fetch single order by ID (Admin only)
export const getOrderById = async (id) => {
  try {
    const response = await get(`/api/orders/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Fetch orders by status (Admin only)
export const getOrdersByStatus = async (status) => {
  try {
    const response = await get(`/api/orders/status/${status}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Fetch order statistics (Admin only)
export const getOrderStatistics = async () => {
  try {
    const response = await get('/api/orders/statistics');
    return response;
  } catch (error) {
    throw error;
  }
};

// PUT - Update order (Admin only)
export const updateOrder = async (id, orderData) => {
  try {
    const response = await put(`/api/orders/update/${id}`, orderData);
    return response;
  } catch (error) {
    throw error;
  }
};

// DELETE - Delete order (Admin only)
export const deleteOrder = async (id) => {
  try {
    const response = await del(`/api/orders/delete/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
