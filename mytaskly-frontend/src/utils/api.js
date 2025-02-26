import axios from "axios";

const BASE_URL = "http://localhost:9091";

const api = axios.create({
  baseURL: BASE_URL,
});

// 🔹 Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default api;
export { BASE_URL };

