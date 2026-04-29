import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.results !== undefined) {
      return response.data.results;
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response?.data || error.message);
  },
);

export default axiosClient;
