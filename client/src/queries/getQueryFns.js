// ===============================
// MAIN QUERY FUNCTIONS INDEX
// ===============================
// This file re-exports all query functions for easy imports

// Categories
export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from './categoriesQueryFns';

// Products
export {
  getAllProducts,
  getProductById,
  createProduct,
  createMultipleProducts,
  updateProduct,
  deleteProduct
} from './productsQueryFns';

// Discounts
export {
  getDiscountedProducts,
  getDiscountById,
  updateDiscount,
  deleteDiscount
} from './discountsQueryFns';

// Best Selling Products
export {
  getBestSellingProducts,
  getBestSellingProductById,
  getBestSellingProductsByMonth,
  createBestSellingProduct,
  updateBestSellingProduct,
  deleteBestSellingProduct
} from './bestSellingQueryFns';

// Authentication & Users
export {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount
} from './authQueryFns';

// Orders
export {
  getUserOrders,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByStatus,
  getOrderStatistics,
  updateOrder,
  deleteOrder
} from './ordersQueryFns';

// Order Items
export {
  getUserOrderItems,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId
} from './orderItemsQueryFns';
