<template>
  <div class="login">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useWampStore } from "../store/wampStore";
import { useRouter } from "vue-router";

const router = useRouter();
const wampStore = useWampStore();

const username = ref("");
const password = ref("");
const error = ref("");

const handleSubmit = () => {
  wampStore
    .auth({ username: username.value, password: password.value })
    ?.then((response) => {
      localStorage.setItem("token", response.Token);
      router.push("/");
    })
    .catch(({ description }) => {
      error.value = description;
    });
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.login-container {
  max-width: 400px;
  max-height: 300px;
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
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.5rem;
  background-color: #4ba0fa;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2a84e6;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
