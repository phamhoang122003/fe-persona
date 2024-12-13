import axios from 'axios';

const instanceAxios = axios.create({
  baseURL: 'https://localhost:7277/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Thêm token vào header của mỗi request thông qua interceptor
instanceAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header
    }
    return config; // Trả về config đã được thay đổi
  },
  (error) => {
    return Promise.reject(error); // Xử lý lỗi
  }
);

export default instanceAxios;
