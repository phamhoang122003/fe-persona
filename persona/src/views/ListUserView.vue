<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">List of Users</h2>
    <RouterLink class="btn btn-secondary" :to="`/`">Come back</RouterLink>
    <table class="table table-striped table-hover">
      <thead class="table-primary">
        <tr>
          <th>STT</th>
          <th>User Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Avatar</th> <!-- Cột hiển thị ảnh -->
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td>{{ index + 1 }}</td>
          <td>{{ user.userName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <!-- Hiển thị avatar -->
            <img v-if="user.avatarUrl" :src="getAvatarUrl(user.avatarUrl)" alt="Avatar" class="avatar-img"/>
          </td>
          <td>
            <button 
              class="btn btn-danger btn-sm" 
              v-if=" user.role === 'User' "
              @click="deleteUser(user.id)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import instanceAxios from '@/utils/configAxios'; // Cấu hình axios instance
import { getUserRole } from '@/auth/authService';

const users = ref([]); // Danh sách người dùng
const userRole = ref(null); // Vai trò người dùng hiện tại

// Hàm xóa người dùng
const deleteUser = async (id) => {
  const confirmDelete = confirm('Bạn có chắc chắn muốn xóa người dùng này không?');
  if (!confirmDelete) return;

  try {
    await instanceAxios.delete(`api/users/${id}`);
    // Cập nhật lại danh sách người dùng sau khi xóa
    users.value = users.value.filter((user) => user.id !== id);
    alert('Người dùng đã được xóa thành công!');
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    alert('Đã có lỗi xảy ra khi xóa người dùng.');
  }
};

// Hàm lấy danh sách người dùng và kiểm tra vai trò
const freshUsers = async () => {
  try {
    // Lấy vai trò người dùng
    userRole.value = getUserRole(); // Hàm getUserRole cần được định nghĩa trong project của bạn

    // Kiểm tra quyền của người dùng
    if (userRole.value === 'Admin') {
      const response = await instanceAxios.get('api/users');
      users.value = response.data;
    } else {
      alert('Bạn không có quyền truy cập trang này!');
      // Điều hướng đến trang khác (ví dụ: trang login)
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    alert('Đã có lỗi xảy ra khi lấy danh sách người dùng.');
  }
};

// Hàm lấy URL ảnh avatar
const getAvatarUrl = (avatarFileName) => {
  // Đảm bảo URL chính xác, ví dụ có thể là đường dẫn đầy đủ tới ảnh trên server
  return `https://localhost:7277${avatarFileName}`;
};

// Gọi hàm khi component được mount
onMounted(() => {
  freshUsers();
});
</script>

<style scoped>
.container {
  max-width: 900px;
}

h2 {
  font-weight: bold;
  color: #007bff;
}

.table {
  margin-top: 20px;
}

.alert {
  margin-top: 20px;
}

/* Thêm style cho ảnh avatar */
.avatar-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
