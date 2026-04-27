

"use client";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5173/",
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Logic to prevent multiple refresh calls at once
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for Inactivity Logout (Matching the change we made in Backend Middleware)
    if (error.response?.data?.code === "INACTIVITY_LOGOUT") {
      localStorage.clear();
      document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login?reason=inactivity";
      return Promise.reject(error);
    }

    // Handle Token Expiration
    if (error.response?.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, wait in queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.get(`${api.defaults.baseURL}/api/v1/refresh`, {
          withCredentials: true,
        });

        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        
        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Cleanup on total failure
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;


