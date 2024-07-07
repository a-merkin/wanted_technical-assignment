import { defineStore } from 'pinia';
import authService from '@/api/services/authService';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    token: null,
  }),
  actions: {
    async login(credentials: { username: string, password: string }) {
      try {
        const response = await authService.login(credentials);
        this.token = response?.data?.token;
        this.isAuthenticated = true;
        // Сохраните токен в локальное хранилище или куки, если необходимо
      } catch (error) {
        this.logout();
        throw new Error(error);
      }
    },
    logout() {
      this.token = null;
      this.isAuthenticated = false;
      // Удалите токен из локального хранилища или куки, если необходимо
    },
  },
});
