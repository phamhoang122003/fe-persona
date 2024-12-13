<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card shadow-lg">
          <div class="card-header text-center bg-primary text-white">
            <h3>Login</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">User Name</label>
                <input
                  type="text"
                  id="username"
                  v-model="username"
                  class="form-control"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  v-model="password"
                  class="form-control"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div class="d-flex justify-content-between mb-3">
                <RouterLink :to="`/register`" class="text-primary">Register</RouterLink>
                <RouterLink :to="`/forgot-password`" class="text-primary">Forgot Password?</RouterLink>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';
  import instanceAxios from '@/utils/configAxios';
  
  const username = ref('');
  const password = ref('');
  const router = useRouter();
  
  const handleLogin = async () => {
    try {
      const response = await instanceAxios.post('api/auth/login', {
        username: username.value,
        password: password.value,
      });
  
      if (response.status === 200) {
        alert('Login successful!');
        localStorage.setItem('authToken', response.data.token); // Lưu token
        router.push('/'); // Chuyển hướng đến Home
      } else {
        alert('Login failed!');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed! Please check your credentials.');
    }
  };
  </script>
  
  <style>
  /* Tuỳ chỉnh giao diện */
  </style>
  