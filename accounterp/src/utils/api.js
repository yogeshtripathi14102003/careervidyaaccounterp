// import axios from "axios";

// const API_BASE_URL = "http://localhost:5000/api/v1";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor to attach token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // token from login
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from "axios";

// 1. Base URL define karein (Apne backend port ke hisaab se)
const API_BASE_URL = "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 * Har API call se pehle ye check karega ki LocalStorage mein token hai ya nahi.
 * Agar hai, toh use Headers mein 'Authorization' ke saath attach kar dega.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // LoginPage wala same key name

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debugging ke liye: Console mein check karein agar token null aa raha hai
      // console.log("Sending Token in Header:", token); 
    } else {
      console.warn("No token found in localStorage!");
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Agar server se 401 (Unauthorized) ya 500 error aati hai, toh yahan handle hoga.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Agar token expire ho gaya ho ya galat ho (401 error)
    if (error.response && error.response.status === 401) {
      console.error("Session expired or Unauthorized. Logging out...");
      // Optional: localStorage.clear(); window.location.href = "/login";
    }

    console.error("API Error Detail:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;