# AI坊学生管理系统 - 前端项目

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.2.13-4FC08D?style=flat-square&logo=vue.js)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.11.2-409EFF?style=flat-square&logo=element)
![ECharts](https://img.shields.io/badge/ECharts-5.5.0-AA344D?style=flat-square&logo=apache)
![Vite](https://img.shields.io/badge/Vite-4.5.14-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

**基于 Vue3 + Element Plus 构建的现代化学生管理系统前端应用**

[功能特性](#功能特性) • [快速开始](#快速开始) • [项目结构](#项目结构) • [开发指南](#开发指南)

</div>

---

## 🌐 在线演示

**项目已部署并运行在以下地址：**

- 🚀 **生产环境**: [https://10257qh6684dd.vicp.fun/](https://10257qh6684dd.vicp.fun/)
- 📱 **移动端访问**: 支持响应式设计，自动适配移动设备
- 💻 **桌面端访问**: 完美支持桌面浏览器

> 💡 **提示**: 访问在线演示需要有效的账号和 Token，请先注册或登录。

---

## 📖 项目简介

AI坊学生管理系统是一个基于 Vue3 和 Spring Boot 构建的现代化学生管理系统，提供智能化的学生信息管理、考勤统计、数据分析等功能。本项目为前端部分，采用 Vue3 Composition API、Element Plus UI 组件库和 ECharts 数据可视化，支持响应式设计，完美适配桌面端和移动端。

### 核心特性

- 🎨 **现代化 UI 设计**：采用极简主义设计风格，界面简洁美观
- 🌓 **主题切换**：支持白天/夜间模式切换，保护用户视力
- 📱 **响应式布局**：完美适配桌面端和移动端设备
- 📊 **数据可视化**：使用 ECharts 提供丰富的数据图表展示
- 🔐 **安全认证**：基于 JWT Token 的身份认证机制
- ⚡ **性能优化**：按需加载、代码分割、请求缓存等优化策略

## ✨ 功能特性

### 核心功能模块

#### 1. 学生管理
- ✅ 学生注册和登录
- ✅ Token 验证和自动跳转
- ✅ 个人信息查看和编辑
- ✅ 密码修改功能

#### 2. 考勤管理
- ✅ 分时段签到（上午/下午/晚上）
- ✅ 验证码验证机制
- ✅ 签到记录查询
- ✅ 考勤统计分析

#### 3. 数据看板
- ✅ 实时数据统计
- ✅ 排行榜展示
- ✅ 多维度数据分析
- ✅ 可视化图表展示

#### 4. 签到分析
- ✅ 签到时段分布分析
- ✅ 签到时间线展示
- ✅ 今日签到排行榜
- ✅ 数据趋势分析

#### 5. 管理员功能
- ✅ 学生信息管理
- ✅ 权限等级设置
- ✅ 管理员分配
- ✅ 数据统计查看

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
- **echarts-wordcloud 2.1.0** - 词云图插件

### 工具库
- **Axios 1.11.0** - HTTP 客户端
- **core-js 3.8.3** - JavaScript 标准库 polyfill

### 开发工具
- **Vue CLI 5.0** - Vue.js 开发工具
- **ESLint** - 代码质量检查
- **Babel** - JavaScript 编译器

## 📁 项目结构

```
front-end/
├── public/                 # 静态资源目录
│   ├── favicon.ico        # 网站图标
│   └── index.html         # HTML 模板
├── src/                   # 源代码目录
│   ├── api/              # API 接口定义
│   │   ├── attendance.js # 考勤相关接口
│   │   └── student.js    # 学生相关接口
│   ├── assets/           # 静态资源
│   │   ├── styles/       # 全局样式
│   │   └── *.png         # 图片资源
│   ├── components/       # 公共组件
│   │   └── ThemeToggle.vue
│   ├── config/           # 配置文件
│   │   └── index.js      # 应用配置
│   ├── router/           # 路由配置
│   │   └── index.js      # 路由定义
│   ├── stores/           # 状态管理
│   │   ├── admin.js     # 管理员状态
│   │   ├── theme.js     # 主题状态
│   │   └── user.js      # 用户状态
│   ├── views/            # 页面组件
│   │   ├── AdminPage/    # 管理员页面
│   │   ├── AttendancePage/      # 签到页面
│   │   ├── AttendanceAnalysisPage/  # 签到分析页面
│   │   ├── DashboardPage/       # 数据看板页面
│   │   ├── HomePage.vue         # 首页
│   │   ├── LoginPage/           # 登录页面
│   │   ├── NavigationPage/      # 导航页面
│   │   ├── ProfilePage/         # 个人信息页面
│   │   ├── RegisterPage/         # 注册页面
│   │   └── StudentManagerPage/   # 学生管理页面
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── Note/                  # 项目文档和经验总结
│   ├── YourExperience/   # 开发经验文档
│   ├── 你的身份.md       # 开发规范
│   └── 接口文档/         # API 接口文档（@Note/接口文档）
├── .gitignore            # Git 忽略文件
├── babel.config.js       # Babel 配置
├── jsconfig.json         # JavaScript 配置
├── package.json          # 项目依赖
├── README.md             # 项目说明文档
├── tsconfig.json         # TypeScript 配置
└── vue.config.js         # Vue CLI 配置
```

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 14.0.0
- **npm**: >= 6.0.0 或 **yarn**: >= 1.22.0
- **现代浏览器**: Chrome、Firefox、Safari、Edge 最新版本

### 安装步骤

1. **克隆项目**
```bash
git clone https://gitee.com/zheng-enci050704/ai-workshop-student-management-system-front-end.git
cd ai-workshop-student-management-system-front-end
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **配置 API 地址**

编辑 `src/config/index.js`，配置后端 API 地址：

```javascript
export const config = {
  API_BASE_URL: 'http://your-api-server:7001',  // 修改为实际的后端地址
  VERIFICATION_CODE_URL: 'http://your-api-server:7001/api/v1/attendance/verification-code',
  APP_TITLE: 'AI坊学生管理系统',
  APP_VERSION: '1.0.0'
}
```

4. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

5. **访问应用**

打开浏览器访问：`http://localhost:8084`

> 💡 **项目现已迁移到 Vite 构建工具，显著提升开发和构建速度**

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建产物将输出到 `dist/` 目录。

> ⚡ **使用 Vite 构建，速度比原来的 Vue CLI 快 2-10 倍**

### 预览生产构建

```bash
npm run preview
# 或
yarn preview
```

> 🚀 **Vite 提供的本地预览服务器，用于预览生产构建产物**

### 代码检查

## ⚙️ 配置说明

### API 配置

项目配置文件位于 `src/config/index.js`：

```javascript
const isProduction = process.env.NODE_ENV === 'production'

export const config = {
  // 开发环境：http://10.0.48.168:7001
  // 生产环境：https://10257qh6684dd.vicp.fun/zheng_en_ci
  API_BASE_URL: isProduction 
    ? 'https://10257qh6684dd.vicp.fun/zheng_en_ci'
    : 'http://10.0.48.168:7001',
  
  // 验证码接口（统一使用开发环境地址）
  VERIFICATION_CODE_URL: 'http://10.0.48.168:7001/api/v1/attendance/verification-code',
  
  APP_TITLE: 'AI坊学生管理系统',
  APP_VERSION: '1.0.0'
}
```

> 📌 **生产环境说明**: 项目已部署在 [https://10257qh6684dd.vicp.fun/](https://10257qh6684dd.vicp.fun/)，生产环境的 API 基础地址为 `https://10257qh6684dd.vicp.fun/zheng_en_ci`

### 路由配置

路由配置文件位于 `src/router/index.js`，包含以下主要路由：

- `/` - 首页
- `/login` - 登录页
- `/register` - 注册页
- `/navigation` - 导航页（需登录）
- `/attendance` - 签到页（需登录）
- `/dashboard` - 数据看板（需登录）
- `/profile` - 个人信息（需登录）
- `/attendance-analysis` - 签到分析（需登录）
- `/student-manager` - 学生管理（需登录）
- `/admin` - 管理员页面

### 主题配置

项目支持白天/夜间主题切换，主题配置位于 `src/stores/theme.js` 和 `src/assets/styles/theme.css`。

## 📱 多端适配

项目采用设备检测机制，自动适配桌面端和移动端：

- **桌面端** (`*Desktop.vue`): 屏幕宽度 >= 768px
- **移动端** (`*Mobile.vue`): 屏幕宽度 < 768px
- **入口文件** (`*.vue`): 设备检测和路由跳转

### 页面列表

| 页面 | 桌面端 | 移动端 |
|------|--------|--------|
| 签到页面 | `AttendancePageDesktop.vue` | `AttendancePageMobile.vue` |
| 数据看板 | `DashboardPageDesktop.vue` | `DashboardPageMobile.vue` |
| 个人信息 | `ProfilePageDesktop.vue` | `ProfilePageMobile.vue` |
| 签到分析 | `AttendanceAnalysisPageDesktop.vue` | `AttendanceAnalysisPageMobile.vue` |

## 🎨 功能展示

### 主要页面

- **首页** - 项目介绍和功能导航
- **登录/注册** - 用户认证入口
- **导航页** - 功能模块导航中心
- **签到页** - 分时段签到功能
- **数据看板** - 数据统计和可视化
- **个人信息** - 个人资料管理
- **签到分析** - 考勤数据分析
- **学生管理** - 管理员学生管理
- **管理员控制台** - 系统管理功能

### 核心特性

#### 1. 主题切换
- 点击页面左上角的 AI坊 图标即可切换主题
- 支持白天模式和夜间模式
- 主题状态持久化存储

#### 2. Token 验证
- 路由守卫自动验证 Token
- Token 验证结果缓存（5秒）
- 自动跳转到登录页（Token 无效时）

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
- 组件按需导入
- 样式使用 scoped 或全局样式块

### 开发规范

详细开发规范请参考：`Note/你的身份.md`

#### 关键规范

1. **代码中不能有任何注释**
2. **所有库必须按需引入**
3. **Element Plus 组件必须同时导入样式文件**
4. **页面必须支持白天/夜间模式切换**
5. **所有页面必须有返回导航按钮**
6. **代码必须符合 ESLint 规范**

### 状态管理

使用 Pinia 进行状态管理，主要 Store：

- `useUserStore` - 用户信息管理
- `useThemeStore` - 主题状态管理
- `useAdminStore` - 管理员状态管理

### API 调用

API 接口定义在 `src/api/` 目录下：

- `student.js` - 学生相关接口
- `attendance.js` - 考勤相关接口

所有接口使用统一的错误处理和响应格式。

## 📚 相关文档

- [接口文档](Note/接口文档/接口文档.md) - 完整的后端 API 接口文档
- [开发经验](./Note/YourExperience/) - 开发过程中积累的经验总结
- [开发规范](./Note/你的身份.md) - 项目开发规范和最佳实践

## 🐛 问题反馈

如果您在使用过程中遇到问题，可以通过以下方式反馈：

1. 提交 Issue 到 Gitee 仓库
2. 查看 `Note/YourExperience/` 目录下的经验文档
3. 参考接口文档排查问题

## 📝 更新日志

### v1.1.3 (2025-12-18)

#### 新增功能
- ✅ 全部成员页面实现边加载边显示功能，提升用户感知性能
- ✅ 电脑端和手机端全部成员页面均支持加载进度显示
- ✅ 改分记录功能采用懒加载策略，仅在用户点击时加载

#### 优化改进
- ✅ 优化电脑端全部成员页面样式，调整 .side-card 内边距提升空间利用率
- ✅ 统一电脑端和手机端全部成员页面的数据加载策略
- ✅ 完善页面 title 和 description 元数据配置

### v1.1.2 (2025-12-12)

#### 新增功能
- ✅ 增加了积分看板页面，展示学生积分排行榜和优秀成员信息

### v1.1.1 (2025-12-11)

#### 新增功能
- ✅ 重新实现超级管理员页面补卡功能，采用分步骤流程（选择日期→选择时间）
- ✅ 日期选择器企业级优化，支持大屏显示标准（72px×72px 单元格，28px 字体）
- ✅ 日期选择器星期和月份中文化显示

#### 修复问题
- ✅ 修复日期选择器样式作用域问题（teleport 渲染元素样式失效）
- ✅ 修复日期选择器无法选择日期的问题
- ✅ 修复 ESLint 代码规范问题

#### 优化改进
- ✅ 优化补卡对话框样式，使用卡片式布局和渐变背景
- ✅ 完善暗色模式支持
- ✅ 优化日期选择器尺寸，符合企业级大屏显示标准

### v1.1.0 (2025-12-10)

#### 新增功能
- ✅ 超级管理员页面补卡功能完整实现（日期时间快捷选择、分步骤流程）
- ✅ 考勤记录表单使用 Element Plus Calendar 组件展示
- ✅ 补卡时间选择扩展为所有可签到时间段（早上 08:00-11:00、下午 14:00-17:00、晚上 19:00-22:00）
- ✅ 补卡日期时间快捷选择（今天早上、昨天下午等组合选项）

#### 修复问题
- ✅ 修复对话框关闭闪烁问题（重写关闭逻辑，直接操作 DOM 隐藏）
- ✅ 修复 StudentManagerPage 弹窗显示在页面背面的问题
- ✅ 修复日期时间选择器样式缺失问题
- ✅ 修复 ECharts 热力图组件导入缺失问题
- ✅ 修复 `filteredStudents` 计算属性类型安全问题

#### 优化改进
- ✅ 优化补卡表单布局，确保确认按钮始终可见
- ✅ 优化考勤记录表单布局，确保完整显示在首屏
- ✅ 优化补卡时间选择布局，所有时间按钮单行显示
- ✅ 优化对话框关闭逻辑，使用 requestAnimationFrame 优化渲染
- ✅ 完善开发经验文档和更新日志管理机制

### v1.0.0 (2024-12-08)

#### 新增功能
- ✅ 个人信息页面请求优化（Token 验证缓存）
- ✅ API 配置支持生产环境
- ✅ 时间段按钮样式优化
- ✅ 路由守卫性能优化

#### 修复问题
- ✅ 修复时间段按钮在白天模式下选中状态不显示的问题
- ✅ 优化个人信息页面重复请求问题
- ✅ 修复 Element Plus 组件样式覆盖问题

#### 优化改进
- ✅ 添加 Token 验证缓存机制
- ✅ 优化 API 配置管理
- ✅ 完善开发经验文档

## 🤝 贡献指南

欢迎贡献代码！在提交 PR 之前，请确保：

1. 代码符合 ESLint 规范
2. 所有库按需引入
3. 组件样式正确导入
4. 支持白天/夜间模式
5. 代码中无注释
6. 通过所有测试

## 📄 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 👥 作者

**郑恩赐**

- Gitee: [@zheng-enci050704](https://gitee.com/zheng-enci050704)

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - 基于 Vue 3 的组件库
- [ECharts](https://echarts.apache.org/) - 强大的数据可视化库
- [Pinia](https://pinia.vuejs.org/) - Vue 的状态管理库

## 📞 联系方式

如有任何问题或建议，欢迎通过以下方式联系：

- 提交 Issue: [Gitee Issues](https://gitee.com/zheng-enci050704/ai-workshop-student-management-system-front-end/issues)

---

<div align="center">

**⭐ 如果这个项目对您有帮助，欢迎 Star！**

Made with ❤️ by 郑恩赐

</div>
