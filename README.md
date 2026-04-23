# AI Workshop 学生管理系统 - 前端

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.2.13-4FC08D?style=flat-square\&logo=vue.js)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.11.2-409EFF?style=flat-square\&logo=element)
![ECharts](https://img.shields.io/badge/ECharts-5.5.0-AA344D?style=flat-square\&logo=apache)
![Vite](https://img.shields.io/badge/Vite-4.5.14-646CFF?style=flat-square\&logo=vite)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

**基于 Vue3 + Element Plus 构建的现代化学生管理系统前端**

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [项目结构](#-项目结构) • [开发指南](#-开发指南)

</div>

***

## 🌐 在线演示

**项目已部署运行：**

- 🚀 **生产环境**: <https://1231ye546ts77.vicp.fun/>
- 📱 **移动端访问**: 响应式设计，自动适配移动端
- 💻 **桌面端访问**: 完整桌面浏览器支持

> 💡 **提示**: 访问在线演示需要有效账号和 Token，请先注册或登录。

***

## 📖 项目概述

**厦工AI坊学生管理系统**是厦门工学院人工智能创作坊（AI坊）的专属管理平台，为AI坊成员提供完整的考勤管理、积分系统、成员管理等功能。系统采用 Vue3 + Vite 构建，使用 Element Plus UI 组件库和 ECharts 数据可视化，支持响应式设计，完美适配桌面端和移动端。

AI坊是学校根据智能学科发展特点，结合社会实际需求，依托人工智能学院雄厚师资力量而成立的实践创作基地，面向人工智能学院专业学生，构建了一个集学习、研发、展示推广于一体的创新平台。

### 核心特性

- 🎨 **现代化 UI 设计**: 简约设计风格，界面简洁美观，支持日间/夜间主题切换
- 📱 **响应式布局**: 自动识别设备类型，完美适配桌面端和移动端
- 📊 **数据可视化**: 使用 ECharts 展示积分排行、考勤统计、IP监控等数据
- 🔐 **安全认证**: 基于 JWT Token 的认证机制，保障系统安全
- ⚡ **高性能**: 基于 Vite 构建，支持按需加载、代码分割等优化策略

## ✨ 功能特性

### 核心功能模块

#### 1. 用户认证
- ✅ 学生注册和登录（必须使用邀请码）
- ✅ Token 验证和自动重定向
- ✅ 个人资料管理（头像上传、密码修改）

#### 2. 考勤管理
- ✅ 个人考勤记录查看（日历形式展示早/午/晚签到）
- ✅ 签到热力图（按周/时段统计签到次数）
- ✅ 签到趋势图（累计签到次数折线图）
- ✅ 实时检测签到时段和下次签到时间
- ✅ 补卡申请处理（管理员审核）

#### 3. 积分系统
- ✅ 积分看板（总积分/签到积分/活动积分三维度排行榜）
- ✅ 个人积分明细查询
- ✅ 积分变动记录（改分记录）
- ✅ 管理员积分调整（加分/减分）

#### 4. 数据看板
- ✅ 签到排行榜（多时间范围筛选）
- ✅ 成员等级分布统计
- ✅ 年级/专业分布图表
- ✅ 实时考勤数据统计
- ✅ 验证码生成（供签到使用）

#### 5. 成员管理
- ✅ 全部成员信息展示（支持搜索筛选）
- ✅ 学生信息查询和编辑
- ✅ 权限等级管理（普通成员/组长/管理员/超级管理员）
- ✅ 所属管理员分配

#### 6. 管理员后台
- ✅ 成员信息管理（修改等级、所属管理员）
- ✅ 考勤记录查看和补卡处理
- ✅ 积分记录创建和查看
- ✅ 改分记录查询
- ✅ 数据导出和下载
- ✅ 考勤热力图和趋势图表

#### 7. IP 监控
- ✅ AI坊内 IP 活跃程度监控
- ✅ IP 扫描次数统计
- ✅ IP 分布热力图
- ✅ IP 配置流程说明

#### 8. 邀请码系统
- ✅ 个人邀请码查询和复制
- ✅ 邀请码刷新功能
- ✅ 注册时邀请码验证
- ✅ 桌面端和移动端支持

## 🛠 技术栈

### 核心框架

- **Vue 3.2.13** - 渐进式 JavaScript 框架
- **Vue Router 4.5.1** - 官方路由管理器
- **Pinia 3.0.3** - 新一代状态管理库

### UI 组件库

- **Element Plus 2.11.2** - 基于 Vue 3 的组件库
- **@element-plus/icons-vue 2.3.2** - Element Plus 图标库

### 数据可视化

- **ECharts 5.5.0** - 强大的数据可视化库
- **echarts-wordcloud 2.1.0** - 词云插件

### 工具库

- **Axios 1.11.0** - HTTP 客户端
- **core-js 3.8.3** - JavaScript 标准库 polyfill

### 开发工具

- **Vite 4.5.14** - 下一代前端构建工具
- **ESLint** - 代码质量检查器
- **Stylelint** - CSS 代码检查器
- **Prettier** - 代码格式化工具
- **Husky** - Git 钩子管理

## 📁 项目结构

```
front-end/
├── public/                 # 静态资源目录
│   ├── favicon.ico        # 网站图标
│   ├── index.html         # HTML 模板
│   └── sitemap.xml        # 站点地图
├── src/                   # 源代码目录
│   ├── api/              # API 接口定义
│   │   ├── attendance.js # 考勤相关接口
│   │   ├── points.js     # 积分相关接口
│   │   ├── StatisticsApi.js  # 统计数据接口
│   │   └── student.js    # 学生相关接口
│   ├── assets/           # 静态资源
│   │   ├── styles/       # 全局样式
│   │   ├── ip-config-flowchart/  # IP配置流程图
│   │   └── *.png         # 图片资源
│   ├── components/       # 公共组件
│   │   ├── LoadingMask.vue
│   │   └── ThemeToggle.vue
│   ├── composables/      # 组合式函数
│   │   ├── admin/        # 管理员相关组合式函数
│   │   └── ts/           # TypeScript组合式函数
│   ├── config/           # 配置文件
│   │   ├── index.js      # 应用配置
│   │   └── Config.ts     # TypeScript配置
│   ├── router/           # 路由配置
│   │   └── index.js      # 路由定义
│   ├── stores/           # 状态管理
│   │   ├── admin.js     # 管理员状态
│   │   ├── theme.js     # 主题状态
│   │   └── user.js      # 用户状态
│   ├── views/            # 页面组件
│   │   ├── AdminPage/    # 管理员后台
│   │   ├── AllMembersPage/      # 全部成员页面
│   │   ├── AttendancePage/      # 考勤管理页面
│   │   ├── DashboardPage/       # 数据看板页面
│   │   ├── HomePage/            # 首页
│   │   ├── IPMonitorPage/       # IP监控页面
│   │   ├── LoginPage/           # 登录页面
│   │   ├── NavigationPage/      # 导航中心
│   │   ├── PointsDashboardPage/ # 积分看板页面
│   │   ├── ProfilePage/         # 个人中心
│   │   ├── RegisterPage/        # 注册页面
│   │   ├── ScoreChangeRecordsPage/  # 改分记录页面
│   │   └── StudentManagerPage/  # 学生管理页面
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── code-quality/         # 代码质量工具
│   ├── code-quality-config/  # 代码质量配置
│   ├── code-quality-reports/ # 代码质量报告
│   └── vite-plugins/     # Vite插件
├── Note/                  # 项目文档
│   └── 接口文档/         # API 接口文档
├── .trae/                # Trae IDE 配置
│   ├── project-members.md    # 项目成员信息
│   └── rules/                # 开发规范规则
│       ├── 01-code-style.md      # 代码风格规范
│       ├── 02-page-structure.md  # 页面结构规范
│       ├── 03-naming-conventions.md  # 命名规范
│       ├── 04-git-commit.md      # Git 提交规范
│       ├── 05-development-notes.md   # 开发注意事项
│       ├── 06-oop-classes.md     # 面向对象编程规范
│       ├── 07-element-plus-import.md # Element Plus 导入规范
│       ├── 08-color-scheme.md    # 项目配色方案
│       └── 09-page-entrance-animation.md # 页面入场动画规范
├── scripts/              # 脚本文件
├── .gitignore            # Git 忽略文件
├── .editorconfig         # 编辑器配置
├── .eslintrc.js          # ESLint 配置
├── .stylelintrc.js       # Stylelint 配置
├── commitlint.config.js  # Commitlint 配置
├── index.html            # Vite HTML 入口
├── package.json          # 项目依赖
├── README.md             # 项目文档
├── tsconfig.json         # TypeScript 配置
├── vite.config.js        # Vite 配置
└── vite.config.mjs       # Vite ESM 配置
```

## 🚀 快速开始

### 环境要求

- **Node.js**: v24.12.0
- **npm**: v10.9.0
- **现代浏览器**: Chrome、Firefox、Safari、Edge 最新版本

### 安装步骤

1. **克隆项目**

```bash
# Gitee（国内推荐）
git clone https://gitee.com/zheng-enci050704/ai-workshop-student-management-system-front-end.git

# GitHub
git clone https://github.com/Zheng-Enci/ai-workshop-student-management-system-front-end.git

# GitCode
git clone https://gitcode.com/ZhengEnCi/ai-workshop-student-management-system-front-end.git

cd ai-workshop-student-management-system-front-end
```

1. **安装依赖**

```bash
npm install
# 或
yarn install
```

1. **配置 API 地址**

编辑 `src/config/index.js` 或 `src/config/ts/Config.ts` 配置后端 API 地址：

```javascript
export const config = {
  // 主后端API服务地址
  API_BASE_URL: 'https://1231ye546ts77.vicp.fun/zheng_en_ci-main_backend',
  
  // 验证码服务地址
  VERIFICATION_CODE_URL: 'http://10.0.48.168:7001/api/v1/attendance/verification-code',
  
  // IP监控服务地址
  IP_MONITOR_BASE_URL: 'https://1231ye546ts77.vicp.fun/zheng_en_ci-ip_monitor',
  
  APP_TITLE: 'AI坊学生管理系统',
  APP_VERSION: '1.0.0'
}
```

1. **启动开发服务器**

```bash
npm run dev
# 或
yarn dev
```

1. **访问应用**

打开浏览器访问：`http://localhost:8084`

> 💡 **项目已迁移到 Vite 构建工具，显著提升开发和构建速度**

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建输出将在 `dist/` 目录中。

> ⚡ **使用 Vite 构建，比原 Vue CLI 快 2-10 倍**

### 预览生产构建

```bash
npm run preview
# 或
yarn preview
```

> 🚀 **Vite 提供本地预览服务器，用于预览生产构建产物**

### 代码检查

## ⚙️ 配置

### API 配置

项目配置文件位于 `src/config/index.js`：

```javascript
const isProduction = process.env.NODE_ENV === 'production'

export const config = {
  // 开发环境: http://10.0.48.168:7001
  // 生产环境: https://1231ye546ts77.vicp.fun/zheng_en_ci
  API_BASE_URL: isProduction 
    ? 'https://1231ye546ts77.vicp.fun/zheng_en_ci'
    : 'http://10.0.48.168:7001',
  
  // 验证码接口（统一使用开发环境地址）
  VERIFICATION_CODE_URL: 'http://10.0.48.168:7001/api/v1/attendance/verification-code',
  
  APP_TITLE: 'AI Workshop 学生管理系统',
  APP_VERSION: '1.0.0'
}
```

> 📌 **生产环境说明**: 项目部署在 <https://1231ye546ts77.vicp.fun/>，生产环境 API 基础地址为 `https://1231ye546ts77.vicp.fun/zheng_en_ci`

### 路由配置

路由配置文件位于 `src/router/index.js`，包含以下主要路由：

- `/` - 首页
- `/login` - 登录页面
- `/register` - 注册页面
- `/navigation` - 导航页面（需要登录）
- `/attendance` - 考勤页面（需要登录）
- `/dashboard` - 数据看板（需要登录）
- `/profile` - 个人资料页面（需要登录）
- `/attendance-analysis` - 考勤分析（需要登录）
- `/student-manager` - 学生管理（需要登录）
- `/admin` - 管理员页面

### 主题配置

项目支持日间/夜间主题切换。主题配置位于 `src/stores/theme.js` 和 `src/assets/styles/theme.css`。

## 📱 多平台适配

项目使用设备检测机制自动适配桌面端和移动端：

- **桌面端** (`*Desktop.vue`): 屏幕宽度 >= 768px
- **移动端** (`*Mobile.vue`): 屏幕宽度 < 768px
- **入口文件** (`*.vue`): 设备检测和路由

### 页面列表

| 页面   | 桌面端                                 | 移动端                                |
| ---- | ----------------------------------- | ---------------------------------- |
| 考勤页面 | `AttendancePageDesktop.vue`         | `AttendancePageMobile.vue`         |
| 数据看板 | `DashboardPageDesktop.vue`          | `DashboardPageMobile.vue`          |
| 个人资料 | `ProfilePageDesktop.vue`            | `ProfilePageMobile.vue`            |
| 考勤分析 | `AttendanceAnalysisPageDesktop.vue` | `AttendanceAnalysisPageMobile.vue` |

## 🎨 功能展示

### 主要页面

- **首页** - 项目介绍和功能导航
- **登录/注册** - 用户认证入口
- **导航页面** - 功能模块导航中心
- **考勤页面** - 分时段签到功能
- **数据看板** - 数据统计和可视化
- **个人资料** - 个人资料管理
- **考勤分析** - 考勤数据分析
- **学生管理** - 管理员学生管理
- **管理员控制台** - 系统管理功能

### 核心功能

#### 1. 主题切换

- 点击左上角 AI Workshop 图标切换主题
- 支持日间模式和夜间模式
- 主题状态持久化存储

#### 2. Token 验证

- 路由守卫自动验证 Token
- Token 验证结果缓存（5 秒）
- 自动重定向到登录页面（Token 无效时）

#### 3. 响应式设计

- 自动检测设备类型
- 桌面端和移动端独立页面
- 完美适配各种屏幕尺寸

#### 4. 数据可视化

- ECharts 图表展示
- 实时数据更新
- 交互式数据探索

## 🔧 开发指南

### 代码规范

- 遵循 ESLint 规范
- 使用 Vue3 Composition API
- 按需导入组件
- 样式使用 scoped 或全局 style 块

### 开发规范

详细开发规范请参考：`Note/你的身份.md`

#### 关键规范

1. **代码中不添加注释**
2. **所有库必须按需导入**
3. **Element Plus 组件必须同时导入样式文件**
4. **页面必须支持日间/夜间模式切换**
5. **所有页面必须有返回导航按钮**
6. **代码必须符合 ESLint 规范**

### 状态管理

使用 Pinia 进行状态管理，主要 Store：

- `useUserStore` - 用户信息管理
- `useThemeStore` - 主题状态管理
- `useAdminStore` - 管理员状态管理

### API 调用

API 接口定义在 `src/api/` 目录：

- `student.js` - 学生相关接口
- `attendance.js` - 考勤相关接口

所有接口使用统一的错误处理和响应格式。

## 📚 相关文档

- [API 文档](Note/接口文档/接口文档.md) - 完整的后端 API 接口文档
- [开发经验](./Note/YourExperience/) - 开发过程中积累的经验
- [开发规范](./Note/你的身份.md) - 项目开发规范和最佳实践

## 🐛 问题反馈

如果在使用过程中遇到任何问题，可以通过以下方式反馈：

1. 向 Gitee 仓库提交 Issue
2. 查看 `Note/YourExperience/` 目录下的经验文档
3. 参考 API 文档排查问题

## 🤝 贡献指南

欢迎贡献！提交 PR 前请确保：

1. 代码符合 ESLint 规范
2. 所有库都按需导入
3. 组件样式正确导入
4. 支持日间/夜间模式
5. 代码中无注释
6. 通过所有测试

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 👥 作者

**郑恩慈**

- Gitee: [@zheng-enci050704](https://gitee.com/zheng-enci050704)

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - 基于 Vue 3 的组件库
- [ECharts](https://echarts.apache.org/) - 强大的数据可视化库
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库

## 📞 联系方式

如有任何问题或建议，欢迎联系我们：

- 提交 Issue: [Gitee Issues](https://gitee.com/zheng-enci050704/ai-workshop-student-management-system-front-end/issues)

***

<div align="center">

**⭐ 如果这个项目对你有帮助，欢迎 Star！**

Made with ❤️ by 郑恩慈

</div>
