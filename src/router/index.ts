import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import AuthPage from '@/views/AuthPage.vue';
import BasePage from '@/views/BasePage.vue'; 

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'BasePage',
    component: BasePage,
    // meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'AuthPage',
    component: AuthPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
