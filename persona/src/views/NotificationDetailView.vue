<template>
    <div class="container mt-5">
      <h3 class="text-center mb-4">Notification Detail</h3>
  
      <!-- Display Notification Details -->
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h5 class="card-title">Notification ID: {{ notification1.id }}</h5>
        </div>
        <div class="card-body">
          <!-- Display notification fields in a grid layout -->
          <div class="row mb-3">
            <div class="col-md-4"><strong>Message:</strong></div>
            <div class="col-md-8">{{ notification1.message }}</div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4"><strong>Notification Time:</strong></div>
            <div class="col-md-8">{{ notification1.notificationTime }}</div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4"><strong>Is Sent:</strong></div>
            <div class="col-md-8">{{ notification1.isSent ? 'Yes' : 'No' }}</div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4"><strong>Offset:</strong></div>
            <div class="col-md-8">{{ notification1.offset }} minutes</div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4"><strong>Status:</strong></div>
            <div class="col-md-8">{{ notification1.status }}</div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4"><strong>Color:</strong></div>
            <div class="col-md-8" :style="{ color: notification1.color }">{{ notification1.color }}</div>
          </div>
        </div>
        <div class="card-footer text-center">
          <RouterLink to="/notification" class="btn btn-secondary">Back to List</RouterLink>
        </div>
      </div>
    </div>
  </template>

<script setup>
    import instanceAxios from '@/utils/configAxios';
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';

    // Lấy tham số từ route
    const { params } = useRoute();
    const notification1 = ref({});  // Khai báo ref để lưu dữ liệu task

    // Định nghĩa hàm fetchTask
    const fetchNotification = async () => {
    try {
        const { data } = await instanceAxios.get(`api/notification/${params.id}`);  // Lấy task theo ID từ params
        console.log(data);  // In ra dữ liệu nhận được
        notification1.value = data;  // Lưu dữ liệu vào task1
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết task:', error);  // Xử lý lỗi
    }
    };

    // Gọi hàm fetchTask khi component được mounted
    onMounted(() => {
        fetchNotification();
    });
</script>

<style scoped>
  .container {
    max-width: 1200px;
    margin-top: 20px;
  }

  h3 {
    font-size: 2rem;
    font-weight: bold;
  }

  .card {
    margin-top: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    font-size: 1.25rem;
  }

  .row {
    font-size: 1.1rem;
  }

  .col-md-4 {
    font-weight: bold;
  }

  .col-md-8 {
    font-style: italic;
  }

  .btn {
    padding: 0.5rem 1.5rem;
  }
</style>