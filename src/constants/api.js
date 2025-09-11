import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER}/crud`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authorizationAPI = axios.create({
  baseURL: process.env.REACT_APP_SERVER,
  headers: {
    "Content-Type": "application/json",
    "x-access-token": Cookies.get("token"),
  },
});

authorizationAPI.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const formDataApi = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER}/crud`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

formDataApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
