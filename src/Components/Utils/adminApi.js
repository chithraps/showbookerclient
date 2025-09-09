import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        
        const res = await api.post("admin/auth/refresh");
        const newToken = res.data.token;

        

        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired/invalid:", refreshError);
        
        window.location.href = "/admin";
      }
    }

    return Promise.reject(error);
  }
);

export const apiRequest = async (
  method,
  endpoint,
  data = {},
  headers = {},
  params = {}
) => {
  try {
    const response = await api({
      method,
      url: endpoint,
      data,
      params,
      headers,
    });
    return { success: true, data: response.data };
  } catch (error) {
    let message = "Something went wrong";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    return { success: false, message, status: error.response?.status };
  }
};
