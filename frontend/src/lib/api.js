// frontend/src/lib/api.js
import axios from "axios";

/**
 * Strategy:
 * - Dev default: talk to backend at http://localhost:5000 (root origin)
 * - Production default: same-origin ('')
 * Then call api.post('/api/...') from the app code (you already do this).
 */
const base =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:5000" : "");

const api = axios.create({
  baseURL: base,           // <-- IMPORTANT: base is root, NOT '/api'
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API error:", error?.response?.data || error?.message);
    return Promise.reject(error);
  }
);

export default api;
