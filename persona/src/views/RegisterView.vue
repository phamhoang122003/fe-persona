<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-lg">
          <div class="card-header text-center bg-primary text-white">
            <h3>Register</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="userName" class="form-label">User Name</label>
                <input
                  type="text"
                  id="userName"
                  v-model="user.userName"
                  class="form-control"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="user.email"
                  class="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="passwordHash" class="form-label">Password</label>
                <input
                  type="password"
                  id="passwordHash"
                  v-model="user.passwordHash"
                  class="form-control"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  class="form-control"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  
  <script setup>
import { ref } from "vue";
import instanceAxios from "@/utils/configAxios"; // Import Axios instance

// Dữ liệu người dùng đăng ký
const user = ref({
  userName: "",
  email: "",
  passwordHash: "",
  role: "User",
});

// Biến để lưu giá trị confirm password
const confirmPassword = ref("");

// Hàm xử lý đăng ký
const handleRegister = async () => {
  // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
  if (user.value.passwordHash !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Gửi dữ liệu mà không có confirmPassword
    await instanceAxios.post("api/users", {
      userName: user.value.userName,
      email: user.value.email,
      passwordHash: user.value.passwordHash, 
      role: "User",// Chỉ gửi password
    });

    alert("Registration successful!");
    // Reset form
    user.value = {
      userName: "",
      email: "",
      passwordHash: "",
      role: "User",
    };
    confirmPassword.value = ""; // Reset confirmPassword
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An error occurred during registration. Please try again.");
  }
};
</script>

  
<style scoped>


.card {
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.form-control {
  border-radius: 10px;
  padding: 10px;
}

.btn {
  border-radius: 10px;
}

.d-grid {
  margin-top: 10px;
}
</style>
  