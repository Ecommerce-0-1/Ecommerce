import api from "../configs/api";
import { get, post } from "../configs/api";

// Log In
export async function LogInUser(formData) {
  const { data } = await api.post(`/api/user/login`, { ...formData });
  return data;
}

// Sign Up
export async function SignUpUser(formData) {
  const { data } = await api.post(`/api/user/register`, { ...formData });
  return data;
}

// ===============================
// PAYMENT API FUNCTIONS
// ===============================

// POST - Create Stripe Checkout session
export const createCheckoutSession = async (checkoutData) => {
  try {
    const response = await post(
      "/api/payments/create-checkout-session",
      checkoutData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// GET - Get checkout session status
export const getSessionStatus = async (sessionId) => {
  try {
    const response = await get(`/api/payments/session-status/${sessionId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
