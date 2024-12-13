<script setup>
import { decodeToken, getUserId, getUserRole } from '@/auth/authService'; // Import các hàm lấy thông tin từ token
import instanceAxios from '@/utils/configAxios';
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router'; // Import useRouter

const router = useRouter(); // Dùng để điều hướng trang
const tasks = ref([]); // Danh sách tasks
const userRole = ref(null); 
const userId = ref(null);


// Hàm logout
const handleLogout = () => {
  localStorage.removeItem("jwt_token"); // Xóa token trong localStorage
  router.push("/login"); // Chuyển hướng đến trang login
};

// Hàm chuyển hướng đến trang update task
const goToUpdate = async (id) => {
  router.push(`/task-update/${id}`); // Điều hướng đến trang cập nhật task
};

// Hàm xóa task
const deleteTask = async (id) => {
  const confirmDelete = confirm('Are you sure?');
  if (!confirmDelete) {
    return; // Nếu người dùng không xác nhận, thoát khỏi hàm
  }

  try {
    await instanceAxios.delete(`api/tasks/${id}`); // Gọi API xóa task
    tasks.value = tasks.value.filter(task => task.id !== id); // Cập nhật lại danh sách tasks
    console.log('Task deleted successfully');
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

// Hàm lấy danh sách tasks, phân biệt theo vai trò người dùng
const freshTasks = async () => {
  try {
    userRole.value = getUserRole(); // Lấy vai trò của người dùng
    userId.value = getUserId(); // Lấy ID người dùng
    // Kiểm tra vai trò và quyết định API endpoint
    const apiEndpoint = userRole.value === 'Admin' ? 'api/tasks' : `customer/${userId.value}`;

    const response = await instanceAxios.get(apiEndpoint); // Gọi API phù hợp với vai trò
    if (response && response.data) {
      tasks.value = response.data; // Lưu dữ liệu vào `tasks`
    } else {
      console.error('Dữ liệu không hợp lệ:', response);
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách task:', error);
  }
};

// Gọi hàm khi component được mounted
onMounted(() => {
  freshTasks(); // Lấy danh sách tasks khi component được mount
});
</script>


<template>
  <main>
    <div class="container mt-5">
      <h2 class="text-center mb-4">List of Tasks</h2>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-between mb-4">
        <RouterLink class="btn btn-primary" :to="`/task-create`">Create New Task</RouterLink>
        <div>
          <RouterLink class="btn btn-secondary me-2" :to="`/notification`" v-if="userRole === 'Admin'">Notifications</RouterLink>
          <RouterLink class="btn btn-secondary me-2" :to="`/list-user`" v-if="userRole === 'Admin'">Users</RouterLink>
          <RouterLink class="btn btn-secondary me-2" :to="`/detail-user`" v-if="userRole === 'Admin'">Your infomation</RouterLink>
          <button class="btn btn-danger" @click="handleLogout">Log Out</button>
        </div>
      </div>

      <!-- Task Table -->
      <table class="table table-striped table-bordered">
        <thead class="table-dark">
          <tr>
            <th>STT</th>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Color</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(task,index) in tasks" :key="task.id">
            <td>{{ index + 1}}</td>
            <td>{{ task.title }}</td>
            <td>{{ task.description }}</td>
            <td>{{ task.dueDate }}</td>
            <td>{{ task.priority }}</td>
            <td>{{ task.status }}</td>
            <!-- Thay đổi màu nền cột Color dựa trên giá trị của task.color -->
            <td :style="{ backgroundColor: task.color }">{{ task.color }}</td>
            <td>
              <div class="d-flex gap-2">
                <RouterLink class="btn btn-info btn-sm" :to="`/task-detail/${task.id}`">Detail</RouterLink>
                <button class="btn btn-warning btn-sm" @click="goToUpdate(task.id)">Update</button>
                <button class="btn btn-danger btn-sm" @click="deleteTask(task.id)">Delete</button>
                <RouterLink class="btn btn-primary btn-sm" :to="`/notification-task/${task.id}`">Notification</RouterLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>


<style scoped>
/* Custom styling */
.container {
  max-width: 1200px;
}
table {
  font-size: 0.9rem;
}
button {
  font-size: 0.85rem;
}
</style>

