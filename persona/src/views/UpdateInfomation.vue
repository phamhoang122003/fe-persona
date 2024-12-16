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

      <div class="mb-3">
        <label for="avatar" class="form-label">Ảnh đại diện</label>
        <input
          id="avatar"
          type="file"
          @change="handleFileChange"
          class="form-control"
        />
        <div class="mt-3">
          <img
            :src="previewImage || currentAvatar || defaultAvatar"
            alt="Avatar Preview"
            class="img-thumbnail"
            style="max-width: 200px;"
          />
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-100 mb-3">Cập nhật</button>
      <RouterLink class="btn btn-secondary w-100" :to="`/`">Quay lại</RouterLink>
    </form>
  </div>
</template>

<script setup>
import { getUserId } from '@/auth/authService';
import instanceAxios from '@/utils/configAxios';
import { onMounted, ref } from 'vue';

// Biến lưu thông tin người dùng
const user = ref({
  userName: '',
  email: '',
  password: '',
  avatar: null,
});

// Avatar hiện tại và preview
const currentAvatar = ref(null); // Ảnh đại diện cũ từ API
const previewImage = ref(null);  // Preview ảnh mới
const defaultAvatar = '/path/to/default-image.jpg'; // Ảnh mặc định nếu không có avatar

// Hàm gọi API lấy thông tin người dùng
const fetchUser = async () => {
  try {
    const userId = getUserId();
    const response = await instanceAxios.get(`api/users/${userId}`);
    user.value = response.data;

    // Gán URL của ảnh đại diện cũ nếu có
    if (response.data.avatarUrl) {
      currentAvatar.value = response.data.avatarUrl.startsWith('https')
        ? response.data.avatar
        : `https://localhost:7277${response.data.avatarUrl}`;
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
  }
};

// Hàm xử lý chọn ảnh mới
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    user.value.avatar = file; // Gán file vào object user

    // Tạo preview ảnh mới
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    // Reset preview và avatar nếu không chọn file
    user.value.avatar = null;
    previewImage.value = null;
  }
};

// Hàm gửi dữ liệu cập nhật lên server
const handleSubmit = async () => {
  try {
    const userId = getUserId();
    const formData = new FormData();

    formData.append('userName', user.value.userName);
    formData.append('email', user.value.email);
    formData.append('password', user.value.password);

    // Chỉ gửi ảnh nếu có ảnh mới
    if (user.value.avatar) {
      formData.append('avatar', user.value.avatar);
    }

    // Gửi request cập nhật
    await instanceAxios.put(`api/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Thông tin người dùng đã được cập nhật thành công');
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
  }
};

// Khi component được mount, lấy thông tin user
onMounted(() => {
  fetchUser();
});
</script>

<style scoped>
/* Tùy chỉnh giao diện */
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

/* Hiệu ứng hover cho nút */
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
