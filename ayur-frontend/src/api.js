import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000",
  headers: { "Content-Type": "application/json" }
});

// attach demo user header for cart/orders
api.interceptors.request.use((config) => {
  config.headers["x-user-id"] = import.meta.env.VITE_USER_ID || "demo-user";
  return config;
});

export default api;
