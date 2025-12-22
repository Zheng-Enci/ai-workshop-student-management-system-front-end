import {createRouter, createWebHistory} from "vue-router";
import { validateToken } from '@/api/student';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomePage/HomePage.vue'),
        meta: {
            title: '首页 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统首页，查看系统介绍、本项目作者、产品功能，快速了解平台特性和使用指南'
        }
    },
    {
        path: '/home-mobile',
        name: 'HomeMobile',
        component: () => import('../views/HomePage/HomePageMobile.vue'),
        meta: {
            title: '首页 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统首页，查看系统介绍、本项目作者、产品功能，快速了解平台特性和使用指南'
        }
    },
    {
        path: '/home-desktop',
        name: 'HomeDesktop',
        component: () => import('../views/HomePage/HomePageDesktop.vue'),
        meta: {
            title: '首页 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统首页，查看系统介绍、本项目作者、产品功能，快速了解平台特性和使用指南'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginPage/LoginPage.vue'),
        meta: {
            title: '登录 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统登录页面，输入账号密码登录系统，访问成员管理、积分查询、考勤统计等功能'
        }
    },

	{
		path: '/register',
		name: 'Register',
		component: () => import('../views/RegisterPage/RegisterPage.vue'),
		meta: {
			title: '注册 - 厦工AI坊学生管理系统',
			description: '厦门工学院人工智能创作坊学生管理系统注册页面，填写个人信息创建账户，加入厦门工学院人工智能创作坊'
		}
	},


	{
        path: '/navigation',
        name: 'Navigation',
        component: () => import('../views/NavigationPage/NavigationPage.vue'),
        meta: {
            requiresAuth: true,
            title: '导航中心 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统导航中心，快速访问数据看板、成员管理、考勤分析等功能，提供便捷入口导航'
        }
    },
    {
        path: '/navigation-mobile',
        name: 'NavigationMobile',
        component: () => import('../views/NavigationPage/NavigationPageMobile.vue'),
        meta: {
            requiresAuth: true,
            title: '导航中心 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统导航中心，快速访问数据看板、成员管理、考勤分析等功能，提供便捷入口导航'
        }
    },
    {
        path: '/navigation-desktop',
        name: 'NavigationDesktop',
        component: () => import('../views/NavigationPage/NavigationPageDesktop.vue'),
        meta: {
            requiresAuth: true,
            title: '导航中心 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统导航中心，快速访问数据看板、成员管理、考勤分析等功能，提供便捷入口导航'
        }
    },
    {
        path: '/attendance',
        name: 'Attendance',
        component: () => import('../views/AttendancePage/AttendancePage.vue'),
        meta: {
            requiresAuth: true,
            title: '考勤签到 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统考勤签到页面，支持手机端扫码签到、查看签到记录、按月查询考勤数据'
        }
    },
    {
        path: '/attendance-mobile',
        name: 'AttendanceMobile',
        component: () => import('../views/AttendancePage/AttendancePageMobile.vue'),
        meta: {
            requiresAuth: true,
            title: '考勤签到 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统考勤签到页面，支持手机端扫码签到、查看签到记录、按月查询考勤数据'
        }
    },
    {
        path: '/attendance-desktop',
        name: 'AttendanceDesktop',
        component: () => import('../views/AttendancePage/AttendancePageDesktop.vue'),
        meta: {
            requiresAuth: true,
            title: '考勤签到 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统考勤签到页面，支持手机端扫码签到、查看签到记录、按月查询考勤数据'
        }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardPage/DashboardPage.vue'),
        meta: {
            requiresAuth: false,
            title: '数据看板 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统数据看板页面，实时展示积分排行、考勤统计、成员数据，为管理决策提供参考'
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/ProfilePage/ProfilePage.vue'),
        meta: {
            requiresAuth: true,
            title: '个人中心 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统个人中心页面，管理个人资料、查看积分明细、修改账号设置，支持头像上传和密码修改'
        }
    },
    {
        path: '/profile/mobile',
        name: 'ProfileMobile',
        component: () => import('../views/ProfilePage/ProfilePageMobile.vue'),
        meta: {
            requiresAuth: true,
            title: '个人中心 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统个人中心页面，管理个人资料、查看积分明细、修改账号设置，支持头像上传和密码修改'
        }
    },
    {
        path: '/profile/desktop',
        name: 'ProfileDesktop',
        component: () => import('../views/ProfilePage/ProfilePageDesktop.vue'),
        meta: {
            requiresAuth: true,
            title: '个人中心 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统个人中心页面，管理个人资料、查看积分明细、修改账号设置，支持头像上传和密码修改'
        }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/AdminPage/AdminPage.vue'),
        meta: {
            requiresAuth: false,
            title: '管理员后台 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统管理员后台，管理成员信息、调整积分、处理补卡申请，查看考勤记录和改分记录'
        }
    },
    {
        path: '/admin/mobile',
        name: 'AdminMobile',
        component: () => import('../views/AdminPage/AdminPageMobile.vue'),
        meta: {
            requiresAuth: false,
            title: '管理员后台 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统管理员后台，管理成员信息、调整积分、处理补卡申请，查看考勤记录和改分记录'
        }
    },
    {
        path: '/admin/desktop',
        name: 'AdminDesktop',
        component: () => import('../views/AdminPage/AdminPageDesktop.vue'),
        meta: {
            requiresAuth: false,
            title: '管理员后台 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统管理员后台，管理成员信息、调整积分、处理补卡申请，查看考勤记录和改分记录'
        }
    },
    {
        path: '/student-manager',
        name: 'StudentManager',
        component: () => import('../views/StudentManagerPage/StudentManagerPage.vue'),
        meta: {
            requiresAuth: true,
            title: '学生管理 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统学生管理页面，查询和管理学生信息、编辑个人资料，支持批量操作和数据导出'
        }
    },
    {
        path: '/attendance-analysis',
        name: 'AttendanceAnalysis',
        component: () => import('../views/AttendanceAnalysisPage/AttendanceAnalysisPageDesktop.vue'),
        meta: {
            requiresAuth: false,
            title: '考勤分析 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统考勤分析页面，可视化展示签到趋势、出勤率统计、时间分布图表，帮助全面了解考勤情况'
        }
    },
    {
        path: '/attendance-analysis-mobile',
        name: 'AttendanceAnalysisMobile',
        component: () => import('../views/AttendanceAnalysisPage/AttendanceAnalysisPageMobile.vue'),
        meta: {
            requiresAuth: false,
            title: '考勤分析 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统考勤分析页面，可视化展示签到趋势、出勤率统计、时间分布图表，帮助全面了解考勤情况'
        }
    },
    {
        path: '/points-dashboard',
        name: 'PointsDashboard',
        component: () => import('../views/PointsDashboardPage/PointsDashboardPage.vue'),
        meta: {
            requiresAuth: false,
            title: '积分看板 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统积分看板页面，实时展示成员积分排行、签到活动数据分析，支持多维度统计查询'
        }
    },
    {
        path: '/points-dashboard-mobile',
        name: 'PointsDashboardMobile',
        component: () => import('../views/PointsDashboardPage/PointsDashboardPageMobile.vue'),
        meta: {
            requiresAuth: false,
            title: '积分看板 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统积分看板页面，实时展示成员积分排行、签到活动数据分析，支持多维度统计查询'
        }
    },
    {
        path: '/points-dashboard-desktop',
        name: 'PointsDashboardDesktop',
        component: () => import('../views/PointsDashboardPage/PointsDashboardPageDesktop.vue'),
        meta: {
            requiresAuth: false,
            title: '积分看板 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统积分看板页面，实时展示成员积分排行、签到活动数据分析，支持多维度统计查询'
        }
    },
    {
        path: '/score-change-records',
        name: 'ScoreChangeRecords',
        component: () => import('../views/ScoreChangeRecordsPage/ScoreChangeRecordsPage.vue'),
        meta: {
            requiresAuth: true,
            title: '改分记录 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统改分记录页面，查看积分调整历史、调整时间、调整原因，透明展示积分变动明细'
        }
    },
    {
        path: '/score-change-records-mobile',
        name: 'ScoreChangeRecordsMobile',
        component: () => import('../views/ScoreChangeRecordsPage/ScoreChangeRecordsPageMobile.vue'),
        meta: {
            requiresAuth: true,
            title: '改分记录 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统改分记录页面，查看积分调整历史、调整时间、调整原因，透明展示积分变动明细'
        }
    },
    {
        path: '/score-change-records-desktop',
        name: 'ScoreChangeRecordsDesktop',
        component: () => import('../views/ScoreChangeRecordsPage/ScoreChangeRecordsPageDesktop.vue'),
        meta: {
            requiresAuth: true,
            title: '改分记录 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统改分记录页面，查看积分调整历史、调整时间、调整原因，透明展示积分变动明细'
        }
    },
    {
        path: '/all-members',
        name: 'AllMembers',
        component: () => import('../views/AllMembersPage/AllMembersPage.vue'),
        meta: {
            requiresAuth: false,
            title: '全部成员 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统全部成员页面，查看所有成员信息、积分排名、学院专业等详细资料，支持快速搜索筛选'
        }
    },
    {
        path: '/all-members-mobile',
        name: 'AllMembersMobile',
        component: () => import('../views/AllMembersPage/AllMembersPageMobile.vue'),
        meta: {
            requiresAuth: false,
            title: '全部成员 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统全部成员页面，查看所有成员信息、积分排名、学院专业等详细资料，支持快速搜索筛选'
        }
    },
    {
        path: '/all-members-desktop',
        name: 'AllMembersDesktop',
        component: () => import('../views/AllMembersPage/AllMembersPageDesktop.vue'),
        meta: {
            requiresAuth: false,
            title: '全部成员 - 厦工AI坊学生管理系统',
            description: '厦工AI坊学生管理系统全部成员页面，查看所有成员信息、积分排名、学院专业等详细资料，支持快速搜索筛选'
        }
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
  
  if (to.path === '/login' && token) {
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

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  if (to.meta.description) {
    let descriptionMeta = document.querySelector('meta[name="description"]')
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta')
      descriptionMeta.name = 'description'
      document.head.appendChild(descriptionMeta)
    }
    descriptionMeta.content = to.meta.description
  }
})

export default router
