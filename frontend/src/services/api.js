import axios from "axios";
import { extractErrorMessage } from "./errorUtils";
import { getStoredSession, handleUnauthorized } from "./session";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
});

api.interceptors.request.use((config) => {
  const { token } = getStoredSession();
  const url = config.url || "";
  const isAuthRoute = url.startsWith("/auth/");
  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.config?.url || "";
    const isAuthRoute = url.startsWith("/auth/");

    if (error?.response?.status === 401 && !isAuthRoute) {
      handleUnauthorized();
    }

    error.message = extractErrorMessage(error, "Request failed");
    return Promise.reject(error);
  }
);

export default api;
