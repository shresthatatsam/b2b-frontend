import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7168/api",
});


// 🔐 Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;