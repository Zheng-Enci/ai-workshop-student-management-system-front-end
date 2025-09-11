import {createRouter, createWebHistory} from "vue-router";
import { validateToken } from '@/api/user';

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginPage.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterPage.vue')
    },
    {
        path: '/navigation',
        name: 'Navigation',
        component: () => import('../views/NavigationPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/attendance',
        name: 'Attendance',
        component: () => import('../views/AttendancePage.vue'),
        meta: { requiresAuth: true }
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login');
      return;
    }
    
    try {
      const isValid = await validateToken(token);
      if (!isValid) {
        localStorage.removeItem('token');
        next('/login');
        return;
      }
    } catch (error) {
      localStorage.removeItem('token');
      next('/login');
      return;
    }
  }
  
  if ((to.path === '/login' || to.path === '/register') && token) {
    try {
      const isValid = await validateToken(token);
      if (isValid) {
        next('/navigation');
        return;
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      localStorage.removeItem('token');
    }
  }
  
  next();
});

export default router