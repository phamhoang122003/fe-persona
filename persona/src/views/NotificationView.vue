<template>
    <div class="container mt-5">
      <h2 class="text-center mb-4">List of Notifications</h2>
  
      <!-- Create Notification Button (Hiển thị khi có ID) -->
      <RouterLink 
        v-if="isId" 
        class="btn btn-primary mb-4" 
        :to="`/notification-create/${router.currentRoute.value.params.id}`">
        Create Notification
      </RouterLink>
      <RouterLink class="btn btn-secondary" :to="`/`">Come back</RouterLink>
      <!-- Notification Table -->
      <table class="table table-striped table-bordered">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Message</th>
            <th>Notification Time</th>
            <th>Is Sent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(notification,index) in notifications" :key="notification.id">
            <td>{{ index + 1}}</td>
            <td>{{ notification.message }}</td>
            <td>{{ notification.notificationTime }}</td>
            <td>{{ notification.isSent ? 'Yes' : 'No' }}</td>
            <td>
              <div class="d-flex gap-2">
                <!-- Detail Button -->
                <RouterLink class="btn btn-info btn-sm" :to="`/notification-detail/${notification.id}`">Detail</RouterLink>
                <!-- Update Button -->
                <button class="btn btn-warning btn-sm" @click="goToUpdate(notification.id)">Update</button>
                <!-- Delete Button -->
                <button class="btn btn-danger btn-sm" @click="deleteNotification(notification.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

<script setup>
import instanceAxios from '@/utils/configAxios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const notifications = ref([]);
const isId = ref(false); // Khai báo biến isId để kiểm tra route params.id

// Điều hướng đến trang cập nhật notification
const goToUpdate = async (id) => {
    router.push(`/notification-update/${id}`);
};

// Xóa notification
const deleteNotification = async (id) => {
    const confirmDelete = confirm('Are you sure?');
    
    if (!confirmDelete) {
        return; // Nếu người dùng không xác nhận, thoát khỏi hàm
    }
    
    try {
        await instanceAxios.delete(`api/notification/${id}`);
        notifications.value = notifications.value.filter(notification => notification.id !== id);
        console.log('Notification deleted successfully');
    } catch (error) {
        console.error('Error deleting notification:', error);
    }
};

// Hàm lấy danh sách notifications
const freshNotification = async (id) => {
    try {
        const apiEndpoint = id ? `task/${id}` : `api/notification`; // Cập nhật URL API
        const response = await instanceAxios.get(apiEndpoint); // Token tự động được thêm vào
        if (response && response.data) {
            notifications.value = response.data; // Lưu dữ liệu vào `notifications`
        } else {
            console.error('Dữ liệu không hợp lệ:', response);
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách notifications:', error);
    }
};

// Gọi hàm khi component được mounted
onMounted(() => {
    const id = router.currentRoute.value.params.id; // Lấy id từ route params
    if (id) {
        isId.value = true;
        freshNotification(id); // Lấy dữ liệu notification để điền vào form
    } else {
        freshNotification(); // Nếu không có id, lấy tất cả notifications
    }
});
</script>

<style scoped>
  .container {
    max-width: 1200px;
    margin-top: 20px;
  }

  h2 {
    font-size: 2rem;
    font-weight: bold;
  }

  .table {
    font-size: 1rem;
  }

  .table th, .table td {
    text-align: center;
    vertical-align: middle;
  }

  .table th {
    background-color: #343a40;
    color: white;
  }

  .table tbody tr:hover {
    background-color: #f8f9fa;
  }

  .btn {
    padding: 0.5rem 1rem;
  }

  .btn-sm {
    padding: 0.3rem 0.6rem;
  }

  .mb-4 {
    margin-bottom: 1.5rem;
  }

  .d-flex {
    display: flex;
    gap: 10px;
  }

  .gap-2 {
    gap: 10px;
  }
</style>
