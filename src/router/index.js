import {createRouter, createWebHistory} from "vue-router";
import { validateToken } from '@/api/user';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomePage.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginPage/LoginPage.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterPage/RegisterPage.vue')
    },
    {
        path: '/navigation',
        name: 'Navigation',
        component: () => import('../views/NavigationPage/NavigationPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/attendance',
        name: 'Attendance',
        component: () => import('../views/AttendancePage/AttendancePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/attendance-mobile',
        name: 'AttendanceMobile',
        component: () => import('../views/AttendancePage/AttendancePageMobile.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/attendance-desktop',
        name: 'AttendanceDesktop',
        component: () => import('../views/AttendancePage/AttendancePageDesktop.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/attendance-tablet',
        name: 'AttendanceTablet',
        component: () => import('../views/AttendancePage/AttendancePageTablet.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardPage/DashboardPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/ProfilePage/ProfilePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/mobile',
        name: 'ProfileMobile',
        component: () => import('../views/ProfilePage/ProfilePageMobile.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/desktop',
        name: 'ProfileDesktop',
        component: () => import('../views/ProfilePage/ProfilePageDesktop.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/tablet',
        name: 'ProfileTablet',
        component: () => import('../views/ProfilePage/ProfilePageTablet.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/AdminPage/AdminPage.vue'),
        meta: { requiresAuth: false },
        children: [
            {
                path: '',
                name: 'AdminDefault',
                redirect: '/admin/auth'
            },
            {
                path: 'auth',
                name: 'AdminAuth',
                component: () => import('../views/AdminPage/AdminAuthPage.vue'),
                meta: { requiresAuth: false }
            },
            {
                path: 'console',
                name: 'AdminConsole',
                component: () => import('../views/AdminPage/AdminConsolePage.vue'),
                meta: { requiresAuth: false }
            }
        ]
    },
    {
        path: '/student-manager',
        name: 'StudentManager',
        component: () => import('../views/StudentManagerPage/StudentManagerPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/attendance-analysis',
        name: 'AttendanceAnalysis',
        component: () => import('../views/AttendanceAnalysisPage/AttendanceAnalysisPageDesktop.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/attendance-analysis-mobile',
        name: 'AttendanceAnalysisMobile',
        component: () => import('../views/AttendanceAnalysisPage/AttendanceAnalysisPageMobile.vue'),
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