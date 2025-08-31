// frontend/src/lib/api.js
import axios from "axios";

const fallback =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "http://127.0.0.1:3000";

const baseURL = import.meta.env.VITE_API_URL || fallback;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

if (import.meta.env.DEV) {
  console.log("[api] baseURL =", baseURL);
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      console.error(
        "[api] error",
        {
          url: (err?.config?.baseURL || "") + (err?.config?.url || ""),
          method: err?.config?.method,
          status: err?.response?.status,
        },
        err?.response?.data || err?.message
      );
      return Promise.reject(err);
    }
  );
}

export default api;
