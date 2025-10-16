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
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/ProfilePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/AdminPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/student-manager',
        name: 'StudentManager',
        component: () => import('../views/StudentManagerPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/attendance-analysis',
        name: 'AttendanceAnalysis',
        component: () => import('../views/AttendanceAnalysisPage.vue'),
        meta: { requiresAuth: true }
    },
]

const router = createRouter({
    history: createWebHistory('/'),
    routes,
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  
  // 如果需要认证的页面
  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login');
      return;
    }
    
    try {
      const isValid = await validateToken(token);
      if (!isValid) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        next('/login');
        return;
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      next('/login');
      return;
    }
  }
  
  // 如果已登录且访问登录/注册页面，跳转到导航页
  if ((to.path === '/login' || to.path === '/register') && token) {
    try {
      const isValid = await validateToken(token);
      if (isValid) {
        next('/navigation');
        return;
      } else {
        // token无效，清除并继续访问登录页
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
  }
  
  next();
});

export default router