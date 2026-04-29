# AI Workshop Student Management System - Frontend

<div align="center">

<img src="https://gitee.com/zheng-enci050704/ai-workshop-student-management-system-front-end/raw/master/public/favicon.ico" alt="AI Workshop Logo" width="80" height="80">

![Vue](https://img.shields.io/badge/Vue-3.2.13-4FC08D?style=flat-square\&logo=vue.js)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.11.2-409EFF?style=flat-square\&logo=element)
![ECharts](https://img.shields.io/badge/ECharts-5.5.0-AA344D?style=flat-square\&logo=apache)
![Vite](https://img.shields.io/badge/Vite-4.5.14-646CFF?style=flat-square\&logo=vite)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

**A modern student management system frontend built with Vue3 + Element Plus**

[Features](#-features) • [Quick Start](#-quick-start) • [Project Structure](#-project-structure) • [Development Guide](#-development-guide) • [中文版](https://gitcode.com/ZhengEnCi/ai-workshop-student-management-system-front-end/blob/master/README.md)

</div>

***

## 🌐 Online Demo

**The project is deployed and running:**

- 🚀 **Production Environment**: <https://1231ye546ts77.vicp.fun/>
- 📱 **Mobile Access**: Responsive design, automatically adapts to mobile devices
- 💻 **Desktop Access**: Full desktop browser support

> 💡 **Note**: Accessing the online demo requires a valid account and Token. Please register or log in first.

***

## 📖 Project Overview

**Xiamen University of Technology AI Workshop Student Management System** is the exclusive management platform for the AI Workshop (Artificial Intelligence Creation Workshop) at Xiamen University of Technology. It provides AI Workshop members with complete attendance management, points system, member management, and other functions. The system is built with Vue3 + Vite, uses the Element Plus UI component library and ECharts data visualization, supports responsive design, and perfectly adapts to both desktop and mobile devices.

The AI Workshop is a practical creation base established by the school based on the development characteristics of intelligent disciplines, combined with actual social needs, and relying on the strong faculty of the School of Artificial Intelligence. It is oriented towards students majoring in artificial intelligence and builds an innovative platform integrating learning, research, and display promotion.

### Core Features

- 🎨 **Modern UI Design**: Simple design style, clean and beautiful interface, supports day/night theme switching
- 📱 **Responsive Layout**: Automatically identifies device types, perfectly adapts to desktop and mobile devices
- 📊 **Data Visualization**: Uses ECharts to display points ranking, attendance statistics, IP monitoring, and other data
- 🔐 **Secure Authentication**: JWT Token-based authentication mechanism to ensure system security
- ⚡ **High Performance**: Built with Vite, supports on-demand loading, code splitting, and other optimization strategies

## ✨ Features

### Core Function Modules

#### 1. User Authentication
- ✅ Student registration and login (invitation code required)
- ✅ Token verification and automatic redirection
- ✅ Personal profile management (avatar upload, password change)

#### 2. Attendance Management
- ✅ Personal attendance record viewing (calendar display of morning/afternoon/evening check-ins)
- ✅ Check-in heatmap (statistics of check-in times by week/time slot)
- ✅ Check-in trend chart (line chart of cumulative check-in times)
- ✅ Real-time detection of check-in time slots and next check-in time
- ✅ Makeup attendance application processing (administrator review)

#### 3. Points System
- ✅ Points dashboard (three-dimensional ranking of total points/check-in points/activity points)
- ✅ Personal points detail query
- ✅ Points change records (score change records)
- ✅ Administrator points adjustment (add/subtract points)

#### 4. Data Dashboard
- ✅ Check-in ranking list (multi-time range filtering)
- ✅ Member level distribution statistics
- ✅ Grade/major distribution charts
- ✅ Real-time attendance data statistics
- ✅ Verification code generation (for check-in use)

#### 5. Member Management
- ✅ All member information display (supports search and filtering)
- ✅ Student information query and editing
- ✅ Permission level management (regular member/team leader/administrator/super administrator)
- ✅ Assigned administrator allocation

#### 6. Administrator Backend
- ✅ Member information management (modify level, assigned administrator)
- ✅ Attendance record viewing and makeup attendance processing
- ✅ Points record creation and viewing
- ✅ Score change record query
- ✅ Data export and download
- ✅ Attendance heatmap and trend charts

#### 7. IP Monitoring
- ✅ AI Workshop internal IP activity monitoring
- ✅ IP scan count statistics
- ✅ IP distribution heatmap
- ✅ IP configuration process description

#### 8. Invitation Code System
- ✅ Personal invitation code query and copy
- ✅ Invitation code refresh function
- ✅ Invitation code verification during registration
- ✅ Desktop and mobile support

## 🛠 Tech Stack

### Core Framework

- **Vue 3.2.13** - Progressive JavaScript framework
- **Vue Router 4.5.1** - Official routing manager
- **Pinia 3.0.3** - Next-generation state management library

### UI Component Library

- **Element Plus 2.11.2** - Vue 3-based component library
- **@element-plus/icons-vue 2.3.2** - Element Plus icon library

### Data Visualization

- **ECharts 5.5.0** - Powerful data visualization library
- **echarts-wordcloud 2.1.0** - Word cloud plugin

### Tool Libraries

- **Axios 1.11.0** - HTTP client
- **core-js 3.8.3** - JavaScript standard library polyfill

### Development Tools

- **Vite 4.5.14** - Next-generation frontend build tool
- **ESLint** - Code quality checker
- **Stylelint** - CSS code checker
- **Prettier** - Code formatting tool
- **Husky** - Git hooks manager

## 📁 Project Structure

```
front-end/
├── public/                 # Static resources directory
│   ├── favicon.ico        # Website icon
│   ├── index.html         # HTML template
│   └── sitemap.xml        # Sitemap
├── src/                   # Source code directory
│   ├── api/              # API interface definitions
│   │   ├── attendance.js # Attendance-related interfaces
│   │   ├── points.js     # Points-related interfaces
│   │   ├── StatisticsApi.js  # Statistics data interfaces
│   │   └── student.js    # Student-related interfaces
│   ├── assets/           # Static resources
│   │   ├── styles/       # Global styles
│   │   ├── ip-config-flowchart/  # IP configuration flowchart
│   │   └── *.png         # Image resources
│   ├── components/       # Common components
│   │   ├── LoadingMask.vue
│   │   └── ThemeToggle.vue
│   ├── composables/      # Composable functions
│   │   ├── admin/        # Administrator-related composables
│   │   └── ts/           # TypeScript composables
│   ├── config/           # Configuration files
│   │   ├── index.js      # Application configuration
│   │   └── Config.ts     # TypeScript configuration
│   ├── router/           # Routing configuration
│   │   └── index.js      # Route definitions
│   ├── stores/           # State management
│   │   ├── admin.js     # Administrator state
│   │   ├── theme.js     # Theme state
│   │   └── user.js      # User state
│   ├── views/            # Page components
│   │   ├── AdminPage/    # Administrator backend
│   │   ├── AllMembersPage/      # All members page
│   │   ├── AttendancePage/      # Attendance management page
│   │   ├── DashboardPage/       # Data dashboard page
│   │   ├── HomePage/            # Home page
│   │   ├── IPMonitorPage/       # IP monitoring page
│   │   ├── LoginPage/           # Login page
│   │   ├── NavigationPage/      # Navigation center
│   │   ├── PointsDashboardPage/ # Points dashboard page
│   │   ├── ProfilePage/         # Personal center
│   │   ├── RegisterPage/        # Registration page
│   │   ├── ScoreChangeRecordsPage/  # Score change records page
│   │   └── StudentManagerPage/  # Student management page
│   ├── App.vue           # Root component
│   └── main.js           # Entry file
├── code-quality/         # Code quality tools
│   ├── code-quality-config/  # Code quality configuration
│   ├── code-quality-reports/ # Code quality reports
│   └── vite-plugins/     # Vite plugins
├── Note/                  # Project documentation
│   └── 接口文档/         # API interface documentation
├── .trae/                # Trae IDE configuration
│   ├── project-members.md    # Project member information
│   └── rules/                # Development specification rules
│       ├── 01-code-style.md      # Code style specifications
│       ├── 02-page-structure.md  # Page structure specifications
│       ├── 03-naming-conventions.md  # Naming conventions
│       ├── 04-git-commit.md      # Git commit specifications
│       ├── 05-development-notes.md   # Development notes
│       ├── 06-oop-classes.md     # Object-oriented programming specifications
│       ├── 07-element-plus-import.md # Element Plus import specifications
│       ├── 08-color-scheme.md    # Project color scheme
│       └── 09-page-entrance-animation.md # Page entrance animation specifications
├── scripts/              # Script files
├── .gitignore            # Git ignore file
├── .editorconfig         # Editor configuration
├── .eslintrc.js          # ESLint configuration
├── .stylelintrc.js       # Stylelint configuration
├── commitlint.config.js  # Commitlint configuration
├── index.html            # Vite HTML entry
├── package.json          # Project dependencies
├── README.md             # Project documentation
├── tsconfig.json         # TypeScript configuration
├── vite.config.js        # Vite configuration
└── vite.config.mjs       # Vite ESM configuration
```

## 🚀 Quick Start

### Environment Requirements

- **Node.js**: v24.12.0
- **npm**: v10.9.0
- **Modern Browsers**: Chrome, Firefox, Safari, Edge latest versions

### Installation Steps

1. **Clone the project**

```bash
# Gitee (recommended for China)
git clone https://gitee.com/zheng-enci050704/ai-workshop-student-management-system-front-end.git

# GitHub
git clone https://github.com/Zheng-Enci/ai-workshop-student-management-system-front-end.git

# GitCode
git clone https://gitcode.com/ZhengEnCi/ai-workshop-student-management-system-front-end.git

cd ai-workshop-student-management-system-front-end
```

1. **Install dependencies**

```bash
npm install
# or
yarn install
```

1. **Configure API address**

Edit `src/config/index.js` or `src/config/ts/Config.ts` to configure the backend API address:

```javascript
export const config = {
  // Main backend API service address
  API_BASE_URL: 'https://1231ye546ts77.vicp.fun/zheng_en_ci-main_backend',
  
  // Verification code service address
  VERIFICATION_CODE_URL: 'http://10.0.48.168:7001/api/v1/attendance/verification-code',
  
  // IP monitoring service address
  IP_MONITOR_BASE_URL: 'https://1231ye546ts77.vicp.fun/zheng_en_ci-ip_monitor',
  
  APP_TITLE: 'AI Workshop Student Management System',
  APP_VERSION: '1.0.0'
}
```

1. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

1. **Access the application**

Open your browser and visit: `http://localhost:3000`

> 💡 **The project has been migrated to the Vite build tool, significantly improving development and build speed**

### Build Production Version

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist/` directory.

> ⚡ **Using Vite for building is 2-10x faster than the original Vue CLI**

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

> 🚀 **Vite provides a local preview server for previewing production build artifacts**

### Code Checking

## ⚙️ Configuration

### API Configuration

The project configuration file is located at `src/config/index.js` or `src/config/ts/Config.ts`:

```javascript
export const config = {
  // Main backend API service address
  API_BASE_URL: 'https://1231ye546ts77.vicp.fun/zheng_en_ci-main_backend',
  
  // Verification code service address
  VERIFICATION_CODE_URL: 'http://10.0.48.168:7001/api/v1/attendance/verification-code',
  
  // IP monitoring service address
  IP_MONITOR_BASE_URL: 'https://1231ye546ts77.vicp.fun/zheng_en_ci-ip_monitor',
  
  APP_TITLE: 'AI Workshop Student Management System',
  APP_VERSION: '1.0.0'
}
```

> 📌 **Production Environment Note**: The project is deployed at <https://1231ye546ts77.vicp.fun/>, and the API base address is `https://1231ye546ts77.vicp.fun/zheng_en_ci-main_backend`

### Routing Configuration

The routing configuration file is located at `src/router/index.js` and includes the following main routes:

**Public pages (no login required):**
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Data dashboard (no login required)
- `/points-dashboard` - Points dashboard (no login required)

**Pages requiring login:**
- `/navigation` - Navigation center
- `/attendance` - Attendance management
- `/profile` - Personal center
- `/all-members` - All members
- `/student-manager` - Student management
- `/score-change-records` - Score change records
- `/ip-monitor` - IP monitoring

**Administrator pages (no routing authentication, password verification within the page):**
- `/admin` - Administrator backend

### Theme Configuration

The project supports day/night theme switching. Theme configuration is located at `src/stores/theme.js` and `src/assets/styles/theme.css`.

## 📱 Multi-platform Adaptation

The project uses a device detection mechanism to automatically adapt to desktop and mobile devices:

- **Desktop** (`*Desktop.vue`): Screen width >= 768px
- **Mobile** (`*Mobile.vue`): Screen width < 768px
- **Entry file** (`*.vue`): Device detection and routing

### Page List

| Page | Desktop | Mobile |
| -------- | --------------------------------- | -------------------------------- |
| Home | `HomePageDesktop.vue` | `HomePageMobile.vue` |
| Login | `LoginPageDesktop.vue` | `LoginPageMobile.vue` |
| Register | `RegisterPageDesktop.vue` | `RegisterPageMobile.vue` |
| Navigation Center | `NavigationPageDesktop.vue` | `NavigationPageMobile.vue` |
| Attendance Management | `AttendancePageDesktop.vue` | `AttendancePageMobile.vue` |
| Data Dashboard | `DashboardPageDesktop.vue` | `DashboardPageMobile.vue` |
| Points Dashboard | `PointsDashboardPageDesktop.vue` | `PointsDashboardPageMobile.vue` |
| Personal Center | `ProfilePageDesktop.vue` | `ProfilePageMobile.vue` |
| All Members | `AllMembersPageDesktop.vue` | `AllMembersPageMobile.vue` |
| Student Management | `StudentManagerPageDesktop.vue` | `StudentManagerPageMobile.vue` |
| Score Change Records | `ScoreChangeRecordsPageDesktop.vue` | `ScoreChangeRecordsPageMobile.vue` |
| IP Monitoring | `IPMonitorPageDesktop.vue` | `IPMonitorPageMobile.vue` |
| Administrator | `AdminPageDesktop.vue` | `AdminPageMobile.vue` |

## 🎨 Feature Showcase

### Main Pages

- **Home** - Project introduction and feature navigation
- **Login/Register** - User authentication entry (invitation code required)
- **Navigation Center** - Feature module navigation entry
- **Attendance Management** - Personal attendance record viewing and statistics
- **Data Dashboard** - Check-in ranking and member data statistics
- **Points Dashboard** - Points ranking (total points/check-in points/activity points)
- **Personal Center** - Personal profile management and password change
- **All Members** - Member information display and search
- **Student Management** - Student information query and management
- **Score Change Records** - Points change record query
- **IP Monitoring** - AI Workshop internal IP activity monitoring
- **Administrator Backend** - Member management, points adjustment, makeup attendance processing

### Core Features

#### 1. Theme Switching

- Click the theme toggle button in the upper right corner (ThemeToggle component)
- Supports automatic switching between day mode and night mode
- Theme state persistent storage

#### 2. Token Verification

- Route guard automatically verifies Token
- Token verification result caching (5 seconds)
- Automatic redirection to the login page (when Token is invalid)

#### 3. Responsive Design

- Automatically detects device type
- Independent pages for desktop and mobile
- Perfectly adapts to various screen sizes

#### 4. Data Visualization

- ECharts chart display
- Real-time data updates
- Interactive data exploration

## 🔧 Development Guide

> **⚠️ About JavaScript and TypeScript Mixing**
>
> This project has undergone technical iteration, gradually evolving from the initial JavaScript to TypeScript. I always follow the design philosophy of <strong>"would rather write one more line of new code than modify one line of old code"</strong>: maintaining respect for existing stable code, implementing new requirements by writing new code, thus forming the current situation where JavaScript and TypeScript coexist.
>
> This design philosophy reflects respect for existing functions—if the old code works normally, don't touch it, but implement new functions by writing new code. This ensures system stability while also providing a path for gradual migration for the project.
>
> **I hope subsequent developers can also adhere to this principle**: prioritize writing new code rather than modifying old code, keeping the project stable as it continues to evolve.

### Code Standards

- Follow ESLint specifications
- Use Vue3 Composition API
- Import components on demand
- Use scoped or global style blocks for styles

### Development Standards

For detailed development standards, please refer to the specification files in the `.trae/rules/` directory:

| Specification File | Description |
|---------|------|
| `01-code-style.md` | Code style specifications (indentation, naming, directory structure) |
| `02-page-structure.md` | Page structure specifications |
| `03-naming-conventions.md` | Naming conventions |
| `04-git-commit.md` | Git commit specifications |
| `05-development-notes.md` | Development notes |
| `06-oop-classes.md` | Object-oriented programming specifications |
| `07-element-plus-import.md` | Element Plus import specifications |
| `08-color-scheme.md` | Project color scheme |
| `09-page-entrance-animation.md` | Page entrance animation specifications |

#### Key Standards

1. **Code must include high-quality comments** - the more the better, form components must include complete functional comments, API files must include function descriptions and parameter types
2. **All libraries must be imported on demand**
3. **Element Plus components must import style files simultaneously**
4. **Pages must support day/night mode switching**
5. **All pages must have a back navigation button**
6. **Code must comply with ESLint specifications**

### State Management

Use Pinia for state management, main Stores:

- `useUserStore` - User information management
- `useThemeStore` - Theme state management
- `useAdminStore` - Administrator state management

### API Calls

API interfaces are defined in the `src/api/` directory:

**JavaScript functional interfaces:**
- `student.js` - Student-related interfaces (login, registration, personal information management, data statistics)
- `attendance.js` - Attendance-related interfaces (check-in, makeup attendance, attendance statistics)
- `points.js` - Points-related interfaces (points adjustment, points query, points ranking)
- `super_admin.js` - Super administrator interfaces

**TypeScript object-oriented API classes:**
- `StudentApi.js` - Student API class (encapsulated using Class)
- `AttendanceApi.js` - Attendance API class (encapsulated using Class)
- `PointsApi.js` - Points API class (encapsulated using Class)
- `StatisticsApi.js` - Statistics data interface class
- `StudentManagementApi.js` - Student management API class

All interfaces use unified error handling and response formats, including response interceptors for handling network errors and timeout errors.

## 📚 Related Documentation

- [API Documentation](https://gitcode.com/ZhengEnCi/ai-workshop-student-management-system-front-end/tree/master/Note/接口文档/接口文档.md) - Complete backend API interface documentation
- [Development Standards](https://gitcode.com/ZhengEnCi/ai-workshop-student-management-system-front-end/tree/master/.trae/rules) - Project development standards and best practices

## 🐛 Issue Feedback

If you encounter any problems during use, you can provide feedback through the following methods:

1. Submit an Issue to the Gitee repository
2. Refer to the API documentation to troubleshoot issues

## 🤝 Contribution Guide

Contributions are welcome! Before submitting a PR, please ensure:

1. Code complies with ESLint specifications
2. All libraries are imported on demand
3. Component styles are correctly imported
4. Supports day/night mode
5. No comments in code
6. Passes all tests

## 📄 License

This project uses the MIT License.

## 👥 Author

**Zheng Enci**

- Gitee: [@zheng-enci050704](https://gitee.com/zheng-enci050704)
- GitHub: [@Zheng-Enci](https://github.com/Zheng-Enci)
- GitCode: [@ZhengEnCi](https://gitcode.com/ZhengEnCi)

## 🙏 Acknowledgments

Thanks to the following open source projects for their support:

- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Element Plus](https://element-plus.org/) - Vue 3-based component library
- [ECharts](https://echarts.apache.org/) - Powerful data visualization library
- [Pinia](https://pinia.vuejs.org/) - Vue state management library

## 📞 Contact

If you have any questions or suggestions, welcome to provide feedback through the following methods:

- Gitee Issues: [Submit Issue](https://gitee.com/zheng-enci050704/ai-workshop-student-management-system-front-end/issues)
- GitHub Issues: [Submit Issue](https://github.com/Zheng-Enci/ai-workshop-student-management-system-front-end/issues)
- GitCode Issues: [Submit Issue](https://gitcode.com/ZhengEnCi/ai-workshop-student-management-system-front-end/issues)

***

<div align="center">

**⭐ If this project is helpful to you, please Star!**

Made with ❤️ by Zheng Enci

</div>
