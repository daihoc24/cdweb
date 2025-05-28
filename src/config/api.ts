import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "../constants/api";
import { jwtDecode } from "jwt-decode";

// Hàm lấy token từ localStorage
const getToken = (): string => {
  const key = "USER_INFO";
  const value = localStorage.getItem(key);
  if (value !== null) {
    return value;  // Trả về trực tiếp token (JWT)
  }
  return ""; // Trả về chuỗi rỗng nếu không tìm thấy token
};

// Hàm giải mã token sử dụng jwt-decode
const getDecodedToken = () => {
  const token = getToken();
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token); // Giải mã token
      return decodedToken; // Trả về payload của token
    } catch (error) {
      console.error("Token không hợp lệ:", error);
      return null;
    }
  }
  return null;
};

const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Interceptor để thêm Bearer Token vào request headers
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const token = getToken(); // Lấy token từ localStorage
    if (token) {
      const cleanedToken = token.replace(/"/g, ''); // Loại bỏ tất cả dấu " trong token nếu có
      config.headers.Authorization = `Bearer ${cleanedToken}`; // Thêm Bearer Token vào header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Nếu có lỗi trong interceptor thì trả về lỗi
  }
);

export { request, getDecodedToken }; // Export thêm getDecodedToken nếu cần dùng
