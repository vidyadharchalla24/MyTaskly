import axios from "axios";

const BASE_URL = "http://localhost:9091";

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

