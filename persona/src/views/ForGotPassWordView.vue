<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <!-- Giao diện nhập email -->
      <div v-if="!resetRequested" class="card p-4">
        <h2 class="text-center mb-4">Quên Mật Khẩu</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="email" class="form-label">Nhập email của bạn:</label>
            <input type="email" id="email" class="form-control" v-model="email" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Gửi mã xác thực</button>
        </form>
        <p v-if="errorMessage" class="text-danger mt-3 text-center">{{ errorMessage }}</p>
      </div>
  
      <!-- Giao diện thông báo -->
      <div v-if="resetRequested" class="card p-4">
        <h2 class="text-center mb-4">Kiểm tra email của bạn</h2>
        <p class="text-center">{{ message }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import instanceAxios from "@/utils/configAxios";
import { ref } from "vue";
  
  // Reactive state
  const email = ref("");
  const errorMessage = ref("");
  const message = ref("");
  const resetRequested = ref(false);
  
  // Hàm kiểm tra email hợp lệ
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Hàm gửi request APIs
const sendResetEmail = async (email) => {
  try {
    const response = await instanceAxios.get(`api/users/forgot_password/${email}`);
    return response; // Trả về phản hồi để xử lý ở `handleSubmit`
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi kết nối API.");
  }
};
  
  // Hàm xử lý logic gửi email
  const handleSubmit = async () => {
    // Reset thông báo lỗi
    errorMessage.value = "";
  
    // Kiểm tra email hợp lệ
    if (!isValidEmail(email.value)) {
      errorMessage.value = "Email không hợp lệ.";
      return;
    }
  
    try {
      // Gửi request đến API
      const response = await sendResetEmail(email.value);
      if (response.status === 200) {
        message.value =
          "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi mã xác thực đăng nhập.";
        resetRequested.value = true;
      } else {
        errorMessage.value = "Đã có lỗi xảy ra khi gửi email. Vui lòng thử lại.";
      }
    } catch (error) {
      errorMessage.value = "Không thể gửi email. Vui lòng thử lại.";
    }
  };
  </script>
  
  <style>
  .card {
    width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    }
  /* body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  } */
/*   
  .password-reset-container,
  .reset-message-container {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 400px;
  }
  
  h2 {
    text-align: center;
  }
  
  label {
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  .error {
    color: red;
    font-size: 14px;
    text-align: center;
  }
  
  .reset-message-container {
    text-align: center;
  }
  
  .reset-message-container p {
    font-size: 16px;
    color: #333;
  } */
  </style>
  