<template>
    <div class="container mt-5">
      <h2 class="text-center mb-4">Đặt lại mật khẩu</h2>
      <form @submit.prevent="submitNewPassword" class="card p-4 shadow-sm">
        <div class="mb-3">
          <label for="newPassword" class="form-label">Nhập mật khẩu mới:</label>
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            class="form-control"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Xác nhận</button>
      </form>
  
      <!-- Thông báo lỗi -->
      <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
      <!-- Thông báo thành công -->
      <p v-if="successMessage" class="text-success mt-3">{{ successMessage }}</p>
      <!-- Hiển thị link quay lại trang login nếu thành công -->
      <RouterLink v-if="successMessage" :to="`/login`" class="text-primary">
          Quay lại trang đăng nhập
      </RouterLink>       
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { RouterLink, useRoute } from 'vue-router'; // Hook để lấy route params
  import instanceAxios from '@/utils/configAxios'; // Axios instance đã cấu hình
  
  const route = useRoute();
  const userId = route.params.userId;
  const token = route.params.token;
  
  const newPassword = ref('');
  const errorMessage = ref('');
  const successMessage = ref('');
  
  const submitNewPassword = async () => {
    try {
      const response = await instanceAxios.put(`/api/users/reset-password/${userId}/${token}`, {
        newPassword: newPassword.value,
      });
  
      if (response.status === 200) {
        successMessage.value = 'Mật khẩu đã được đặt lại thành công.';
      }
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Đã xảy ra lỗi.';
    }
  };
  </script>
  
  <style scoped>
  /* Thêm một số tùy chỉnh CSS nếu cần */
  .error {
    font-size: 14px;
  }
  
  .success {
    font-size: 14px;
  }
  </style>
  