import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const BASE_URL = VITE_BACKEND_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

export const setAxiosInterceptors = (onUnauthorized) =>{
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
  });

  api.interceptors.response.use((response)=>{
    return response;
  },(error)=>{
    if(error.response.status === 401){
      console.log("Unauthorized, redirecting to login...",error);
        localStorage.removeItem("token");
        if (onUnauthorized) onUnauthorized();
      }
      return Promise.reject(error);
  });
};



export default api;

