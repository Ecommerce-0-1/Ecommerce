import { get, post, del } from "../configs/api";

// ===============================
// USER/AUTH API FUNCTIONS
// ===============================

// POST - User registration
export const registerUser = async (userData) => {
  try {
    const response = await post('/api/user/register', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

// POST - User login
export const loginUser = async (credentials) => {
  try {
    const response = await post('/api/user/login', credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

// POST - Google login
export const googleLogin = async (googleData) => {
  try {
    const response = await post('/api/user/googlelogin', googleData);
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Get user profile (Admin only)
export const getUserProfile = async () => {
  try {
    const response = await get('/api/user/get');
    return response;
  } catch (error) {
    throw error;
  }
};

// POST - Update user profile (Admin only)
export const updateUserProfile = async (userData) => {
  try {
    const response = await post('/api/user/update', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

// DELETE - Delete user account (Admin only)
export const deleteUserAccount = async () => {
  try {
    const response = await del('/api/user/delete');
    return response;
  } catch (error) {
    throw error;
  }
};
