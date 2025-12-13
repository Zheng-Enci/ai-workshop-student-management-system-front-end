import {createRouter, createWebHistory} from "vue-router";
import { validateToken } from '@/api/student';

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
        path: '/navigation-mobile',
        name: 'NavigationMobile',
        component: () => import('../views/NavigationPage/NavigationPageMobile.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/navigation-desktop',
        name: 'NavigationDesktop',
        component: () => import('../views/NavigationPage/NavigationPageDesktop.vue'),
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
    {
        path: '/points-dashboard',
        name: 'PointsDashboard',
        component: () => import('../views/PointsDashboardPage/PointsDashboardPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/points-dashboard-mobile',
        name: 'PointsDashboardMobile',
        component: () => import('../views/PointsDashboardPage/PointsDashboardPageMobile.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/points-dashboard-desktop',
        name: 'PointsDashboardDesktop',
        component: () => import('../views/PointsDashboardPage/PointsDashboardPageDesktop.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/score-change-records-desktop',
        name: 'ScoreChangeRecordsDesktop',
        component: () => import('../views/ScoreChangeRecordsPage/ScoreChangeRecordsPageDesktop.vue'),
        meta: { requiresAuth: true }
    },
]

const router = createRouter({
    history: createWebHistory('/'),
    routes,
})

let tokenValidationCache = {
  token: null,
  isValid: false,
  timestamp: 0
}

const CACHE_DURATION = 5000

const getCachedValidation = (token) => {
  const now = Date.now()
  if (tokenValidationCache.token === token && 
      (now - tokenValidationCache.timestamp) < CACHE_DURATION) {
    return tokenValidationCache.isValid
  }
  return null
}

const setCachedValidation = (token, isValid) => {
  tokenValidationCache = {
    token,
    isValid,
    timestamp: Date.now()
  }
}

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login');
      return;
    }
    
    const cachedResult = getCachedValidation(token)
    if (cachedResult !== null) {
      if (!cachedResult) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        tokenValidationCache = { token: null, isValid: false, timestamp: 0 }
        next('/login');
        return;
      }
      next();
      return;
    }
    
    try {
      const isValid = await validateToken(token);
      setCachedValidation(token, isValid)
      if (!isValid) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        next('/login');
        return;
      }
    } catch (error) {
      setCachedValidation(token, false)
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      next('/login');
      return;
    }
  }
  
  if ((to.path === '/login' || to.path === '/register') && token) {
    const cachedResult = getCachedValidation(token)
    if (cachedResult !== null) {
      if (cachedResult) {
        next('/navigation');
        return;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        tokenValidationCache = { token: null, isValid: false, timestamp: 0 }
      }
    } else {
      try {
        const isValid = await validateToken(token);
        setCachedValidation(token, isValid)
        if (isValid) {
          next('/navigation');
          return;
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
        }
      } catch (error) {
        setCachedValidation(token, false)
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
      }
    }
  }
  
  next();
});

export default router