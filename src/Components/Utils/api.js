import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;



export const apiRequest = async (method, endpoint, data = {}, headers = {},params = {}) => {
  try {
    const response = await axios({
      method,
      url: `${baseUrl}${endpoint}`,
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
