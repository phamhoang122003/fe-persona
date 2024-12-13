<template>
    <div>
        <div class="container mt-5">
            <h2>{{ isEdit ? 'Edit Notification' : 'Create New Notification' }}</h2>
            <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label for="message" class="form-label">Message</label>
                    <textarea id="message" v-model="notification.message" class="form-control" rows="3" placeholder="Enter notification message" required></textarea>
                </div>

                <div class="mb-3">
                    <label for="notificationTime" class="form-label">Notification Time</label>
                    <input type="datetime-local" id="notificationTime" v-model="notification.notificationTime" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="offset" class="form-label">Offset (in minutes)</label>
                    <input type="number" id="offset" v-model.number="offsetMinutes" class="form-control" placeholder="Enter offset time in minutes before due date" required />
                </div>

                <!-- Trường ẩn TaskId -->
                <input type="hidden" v-model="notification.taskId" />

                <button type="submit" class="btn btn-primary">
                    {{ isEdit ? 'Update Notification' : 'Create Notification' }}
                </button>
                <RouterLink class="btn btn-secondary" :to="`/notification`">Come back</RouterLink>
            </form>
        </div>
    </div>
</template>

<script setup>
    import instanceAxios from '@/utils/configAxios';
    import { ref, onMounted, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    const route = useRoute(); // Lấy thông tin từ URL
    const router = useRouter();
    const isEdit = ref(false); // Xác định chế độ (tạo mới hay chỉnh sửa)

    // Đối tượng Notification
    const notification = ref({
        message: '',
        notificationTime: '',
        offset: 0, // Offset tính theo giây (được xử lý nội bộ)
        isSent: false,
        taskId: route.params.taskId || null, // Lấy TaskId từ URL (nếu có)
    });

    // Kiểm tra chế độ (create hoặc update)
    const checkMode = () => {
        if (route.params.taskId && !route.params.id) {
            // Nếu có taskId mà không có id, là chế độ tạo mới
            isEdit.value = false;
        } else if (route.params.id) {
            // Nếu có id, là chế độ chỉnh sửa
            isEdit.value = true;
            fetchNotification(route.params.id); // Lấy dữ liệu notification để điền vào form
        }
    };

    // Offset hiển thị ở giao diện (tính theo phút)
    const offsetMinutes = computed({
        get: () => Math.floor(notification.value.offset / 60), // Chuyển giây -> phút
        set: (minutes) => {
            notification.value.offset = minutes * 60; // Chuyển phút -> giây
        }
    });

    // Hàm chuyển đổi ngày từ API sang định dạng phù hợp cho <input type="datetime-local">
    const formatDateTimeForInput = (isoString) => {
        if (!isoString) return '';
        return isoString.slice(0, 16); // Lấy 'YYYY-MM-DDTHH:mm'
    };

    // Hàm chuyển đổi ngày từ giao diện về định dạng ISO cho API
    const prepareDateTimeForAPI = (dateTime) => {
        if (!dateTime) return null;
        return new Date(dateTime).toISOString(); // Định dạng đầy đủ 'YYYY-MM-DDTHH:mm:ss.sssZ'
    };

    // Khi ở chế độ chỉnh sửa, lấy dữ liệu notification từ server
    const fetchNotification = async (id) => {
        try {
            const response = await instanceAxios.get(`api/notification/${id}`);
            notification.value = {
                ...response.data,
                notificationTime: formatDateTimeForInput(response.data.notificationTime) // Định dạng lại ngày
            };
        } catch (error) {
            console.error('Error fetching notification:', error);
        }
    };

    // Xử lý khi submit form
    const handleSubmit = async () => {
        try {
            const notificationToSubmit = { ...notification.value };
            notificationToSubmit.notificationTime = prepareDateTimeForAPI(notificationToSubmit.notificationTime); // Định dạng lại trước khi gửi

            if (isEdit.value) {
                // Cập nhật notification
                await instanceAxios.put(`api/notification/${notification.value.id}`, notificationToSubmit);
                alert('Notification updated successfully!');
            } else {
                // Tạo mới notification
                await instanceAxios.post('api/notification', notificationToSubmit);
                alert('Notification created successfully!');
                // Reset form
                notification.value = {
                    message: '',
                    notificationTime: '',
                    offset: 0, // Reset về giây
                    isSent: false,
                    taskId: route.params.taskId || null
                };
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the notification.');
        }
    };

    // Kiểm tra khi component được mount
    onMounted(() => {
        checkMode();
    });
</script>

<style scoped>
/* Các style cần thiết cho component */
</style>
