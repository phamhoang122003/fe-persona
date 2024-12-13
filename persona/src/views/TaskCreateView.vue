<template>
    <div>
        <div class="container mt-5">
            <h2>{{ isEdit ? 'Edit Task' : 'Create New Task' }}</h2>
            <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" id="title" v-model="task.title" class="form-control" placeholder="Enter task title" required />
                </div>

                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea id="description" v-model="task.description" class="form-control" rows="3" placeholder="Enter task description" required></textarea>
                </div>

                <div class="mb-3">
                    <label for="dueDateTime" class="form-label">Due Date & Time</label>
                    <input type="datetime-local" id="dueDateTime" v-model="task.dueDate" class="form-control" required />
                </div>


                <div class="mb-3">
                    <label for="priority" class="form-label">Priority</label>
                    <select v-model="task.priority" id="priority" class="form-select" required>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="status" class="form-label">Status</label>
                    <select v-model="task.status" id="status" class="form-select" required>
                        <option value="Pending">Pending</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="color" class="form-label">Label Color</label>
                    <select v-model="task.color" id="color" class="form-select" required>
                        <option value="Green">Green</option>
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Yellow">Yellow</option>
                    </select>
                </div>

                <button type="submit" class="btn btn-primary">
                    {{ isEdit ? 'Update Task' : 'Create Task' }}
                </button>
                <RouterLink class="btn btn-secondary" :to="`/`">Come back</RouterLink>
            </form>
        </div>
    </div>
</template>

<script setup>
import { getUserId } from '@/auth/authService';
import instanceAxios from '@/utils/configAxios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute(); // Lấy thông tin từ URL
const isEdit = ref(false); // Xác định chế độ (tạo mới hay chỉnh sửa)

const task = ref({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending',
    color: 'Green',
    userId: getUserId(),
});
console.log(task.value);
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

// Khi ở chế độ chỉnh sửa, lấy dữ liệu task từ server
const fetchTask = async (id) => {
    try {
        const response = await instanceAxios.get(`api/tasks/${id}`);
        task.value = {
            ...response.data,
            dueDate: formatDateTimeForInput(response.data.dueDate) // Định dạng lại ngày
        };
    } catch (error) {
        console.error('Error fetching task:', error);
    }
};

// Xử lý khi submit form
const handleSubmit = async () => {
    try {
        const taskToSubmit = { ...task.value };
        taskToSubmit.dueDate = prepareDateTimeForAPI(taskToSubmit.dueDate); // Định dạng lại trước khi gửi
        
        if (isEdit.value) {
            // Cập nhật task
            await instanceAxios.put(`api/tasks/${task.value.id}`, taskToSubmit);
            alert('Task updated successfully!');
        } else {
            // Tạo mới task
            await instanceAxios.post('api/tasks', taskToSubmit);
            alert('Task created successfully!');
            // Reset form
            task.value = {
                title: '',
                description: '',
                dueDate: '',
                priority: 'Medium',
                status: 'Pending',
                color: 'Green',
                userId: getUserId(),
            };
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the task.');
    }
};

// Kiểm tra xem đang ở chế độ chỉnh sửa hay tạo mới
onMounted(() => {
    if (route.params.id) {
        isEdit.value = true;
        fetchTask(route.params.id); // Lấy dữ liệu task để điền vào form
    }
});
</script>



<style lang="scss" scoped>

</style>