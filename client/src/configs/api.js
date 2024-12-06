import axios from "axios";
import { getUserCookies } from "../utils/methods";

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const userData = getUserCookies();
    if (userData && userData.access_token) {
      config.headers["Authorization"] = `Bearer ${userData.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Define generic API methods
async function request(
  method,
  url,
  { data = null, params = {}, headers = {}, isPrivate = true } = {},
) {
  try {
    const config = { method, url, headers, params, ...(data && { data }) };

    const response = await api(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const get = (url, params, headers) =>
  request("get", url, { params, headers });
export const post = (url, data, headers) =>
  request("post", url, { data, headers });
export const put = (url, data, headers) =>
  request("put", url, { data, headers });
export const patch = (url, data, headers) =>
  request("patch", url, { data, headers });
export const del = (url, headers) => request("delete", url, { headers });

export default api;
