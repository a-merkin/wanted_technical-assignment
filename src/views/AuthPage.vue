<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit">
      <h2>Вход</h2>
      <div class="form-group">
        <label for="username">Имя пользователя</label>
        <input v-model="username" id="username" type="text" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input v-model="password" id="password" type="password" required />
      </div>
      <button type="submit">Войти</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore';

const username = ref('');
const password = ref('');
const error = ref('');

const authStore = useAuthStore();

const handleSubmit = async () => {
  error.value = '';
  try {
    await authStore.login({ username: username.value, password: password.value });
  } catch (err) {
    error.value = err;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
