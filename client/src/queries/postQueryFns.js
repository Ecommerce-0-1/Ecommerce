import api from "../configs/api";

// Log In
export async function LogInUser(formData) {
  const { data } = await api.post(`/user/login`, { ...formData });
  return data;
}

// Sign Up
export async function SignUpUser(formData) {
  const { data } = await api.post(`/user/register`, { ...formData });
  return data;
}
