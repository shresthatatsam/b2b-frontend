import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7168/api", // change to your backend URL
});

export default api;