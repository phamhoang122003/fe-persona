<template>
    <div class="container mt-5">
      <form @submit.prevent="handleSubmit" class="card p-4 shadow-sm">
        <h2 class="text-center mb-4">Cập nhật thông tin</h2>
  
        <div class="mb-3">
          <label for="username" class="form-label">Tên người dùng</label>
          <input
            id="username"
            type="text"
            v-model="user.userName"
            class="form-control"
            placeholder="Nhập tên người dùng"
            required
          />
        </div>
  
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            type="email"
            v-model="user.email"
            class="form-control"
            placeholder="Nhập email"
            required
          />
        </div>
  
        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu</label>
          <input
            id="password"
            type="password"
            v-model="user.password"
            class="form-control"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>
  
        <button type="submit" class="btn btn-primary w-100 mb-3">Cập nhật</button>
        <RouterLink class="btn btn-secondary w-100" :to="`/`">Come Back</RouterLink>
      </form>
    </div>
  </template>
  
  <script setup>
  import { getUserId } from '@/auth/authService';
  import instanceAxios from '@/utils/configAxios';
  import { onMounted, ref } from 'vue';
  
  const user = ref({
    userName: '',
    email: '',
    password: ''
  });
  
  // Hàm lấy thông tin user từ API
  const fetchUser = async () => {
    try {
      const userId = getUserId();
      const response = await instanceAxios.get(`api/users/${userId}`);
      user.value = response.data; // Gán dữ liệu vào object `user`
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
  
  // Hàm xử lý khi submit form
  const handleSubmit = async () => {
    try {
      const userId = getUserId();
      await instanceAxios.put(`api/users/${userId}`, user.value); // Gửi dữ liệu cập nhật
      alert('Thông tin người dùng đã được cập nhật thành công');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  // Gọi API khi component được mount
  onMounted(() => {
    fetchUser();
  });
  </script>
  
  <style scoped>
  /* Tùy chỉnh CSS cho form */
  form {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    background-color: #f8f9fa;
  }
  
  label {
    font-weight: bold;
  }
  
  button {
    margin-top: 15px;
  }
  
  /* Tạo hiệu ứng khi hover vào các button */
  button:hover {
    opacity: 0.8;
  }
  
  .card {
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    font-family: 'Arial', sans-serif;
    color: #007bff;
  }
  </style>
  