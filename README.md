# AI Workshop Student Management System - Frontend

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.2.13-4FC08D?style=flat-square&logo=vue.js)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.11.2-409EFF?style=flat-square&logo=element)
![ECharts](https://img.shields.io/badge/ECharts-5.5.0-AA344D?style=flat-square&logo=apache)
![Vite](https://img.shields.io/badge/Vite-4.5.14-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

**Modern Student Management System Frontend Built with Vue3 + Element Plus**

[Features](#-features) • [Quick Start](#-quick-start) • [Project Structure](#-project-structure) • [Development Guide](#-development-guide)

</div>

---

## 🌐 Online Demo

**The project is deployed and running at:**

- 🚀 **Production**: [https://10257qh6684dd.vicp.fun/](https://10257qh6684dd.vicp.fun/)
- 📱 **Mobile Access**: Responsive design, automatic mobile adaptation
- 💻 **Desktop Access**: Full desktop browser support

> 💡 **Note**: Access to the online demo requires a valid account and Token. Please register or login first.

---

## 📖 Project Overview

AI Workshop Student Management System is a modern student management system built with Vue3 and Spring Boot, providing intelligent student information management, attendance statistics, data analysis, and other features. This is the frontend part, using Vue3 Composition API, Element Plus UI component library, and ECharts data visualization, supporting responsive design and perfectly adapting to desktop and mobile devices.

### Core Features

- 🎨 **Modern UI Design**: Minimalist design style, clean and beautiful interface
- 🌓 **Theme Switching**: Support for day/night mode switching to protect user vision
- 📱 **Responsive Layout**: Perfect adaptation to desktop and mobile devices
- 📊 **Data Visualization**: Rich data chart displays using ECharts
- 🔐 **Secure Authentication**: JWT Token-based authentication mechanism
- ⚡ **Performance Optimization**: On-demand loading, code splitting, request caching, and other optimization strategies

## ✨ Features

### Core Function Modules

#### 1. Student Management
- ✅ Student registration and login
- ✅ Token verification and automatic redirection
- ✅ Personal information viewing and editing
- ✅ Password modification

#### 2. Attendance Management
- ✅ Time-based check-in (morning/afternoon/evening)
- ✅ Verification code mechanism
- ✅ Attendance record query
- ✅ Attendance statistics and analysis

#### 3. Data Dashboard
- ✅ Real-time data statistics
- ✅ Leaderboard display
- ✅ Multi-dimensional data analysis
- ✅ Visual chart display

#### 4. Attendance Analysis
- ✅ Attendance time distribution analysis
- ✅ Attendance timeline display
- ✅ Today's attendance leaderboard
- ✅ Data trend analysis

#### 5. Admin Functions
- ✅ Student information management
- ✅ Permission level settings
- ✅ Admin assignment
- ✅ Data statistics viewing

#### 6. Invitation Code Management
- ✅ Query personal invitation code
- ✅ Copy invitation code to clipboard
- ✅ Refresh invitation code
- ✅ Verify invitation code during registration
- ✅ Desktop and mobile support

## 🛠 Tech Stack

### Core Framework
- **Vue 3.2.13** - Progressive JavaScript framework
- **Vue Router 4.5.1** - Official routing manager
- **Pinia 3.0.3** - Next-generation state management library

### UI Component Library
- **Element Plus 2.11.2** - Vue 3 based component library
- **@element-plus/icons-vue 2.3.2** - Element Plus icon library

### Data Visualization
- **ECharts 5.5.0** - Powerful data visualization library
- **echarts-wordcloud 2.1.0** - Word cloud plugin

### Utility Libraries
- **Axios 1.11.0** - HTTP client
- **core-js 3.8.3** - JavaScript standard library polyfill

### Development Tools
- **Vue CLI 5.0** - Vue.js development tool
- **ESLint** - Code quality checker
- **Babel** - JavaScript compiler

## 📁 Project Structure

```
front-end/
├── public/                 # Static assets directory
│   ├── favicon.ico        # Website icon
│   └── index.html         # HTML template
├── src/                   # Source code directory
│   ├── api/              # API interface definitions
│   │   ├── attendance.js # Attendance related interfaces
│   │   └── student.js    # Student related interfaces
│   ├── assets/           # Static assets
│   │   ├── styles/       # Global styles
│   │   └── *.png         # Image resources
│   ├── components/       # Common components
│   │   └── ThemeToggle.vue
│   ├── config/           # Configuration files
│   │   └── index.js      # Application configuration
│   ├── router/           # Router configuration
│   │   └── index.js      # Route definitions
│   ├── stores/           # State management
│   │   ├── admin.js     # Admin state
│   │   ├── theme.js     # Theme state
│   │   └── user.js      # User state
│   ├── views/            # Page components
│   │   ├── AdminPage/    # Admin page
│   │   ├── AttendancePage/      # Attendance page
│   │   ├── AttendanceAnalysisPage/  # Attendance analysis page
│   │   ├── DashboardPage/       # Data dashboard page
│   │   ├── HomePage.vue         # Home page
│   │   ├── LoginPage/           # Login page
│   │   ├── NavigationPage/      # Navigation page
│   │   ├── ProfilePage/         # Profile page
│   │   ├── RegisterPage/         # Registration page
│   │   └── StudentManagerPage/   # Student management page
│   ├── App.vue           # Root component
│   └── main.js           # Entry file
├── Note/                  # Project documentation and experience summary
│   ├── YourExperience/   # Development experience documents
│   ├── 你的身份.md       # Development specifications
│   └── 接口文档/         # API interface documentation
├── .gitignore            # Git ignore file
├── babel.config.js       # Babel configuration
├── jsconfig.json         # JavaScript configuration
├── package.json          # Project dependencies
├── README.md             # Project documentation
├── tsconfig.json         # TypeScript configuration
└── vue.config.js         # Vue CLI configuration
```

## 🚀 Quick Start

### Environment Requirements

- **Node.js**: >= 14.0.0
- **npm**: >= 6.0.0 or **yarn**: >= 1.22.0
- **Modern Browser**: Chrome, Firefox, Safari, Edge latest versions

### Installation Steps

1. **Clone the project**
```bash
git clone https://gitee.com/zheng-enci050704/ai-workshop-student-management-system-front-end.git
cd ai-workshop-student-management-system-front-end
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure API address**

Edit `src/config/index.js` to configure the backend API address:

```javascript
export const config = {
  API_BASE_URL: 'http://your-api-server:7001',  // Change to actual backend address
  VERIFICATION_CODE_URL: 'http://your-api-server:7001/api/v1/attendance/verification-code',
  APP_TITLE: 'AI Workshop Student Management System',
  APP_VERSION: '1.0.0'
}
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

5. **Access the application**

Open your browser and visit: `http://localhost:8084`

> 💡 **The project has now migrated to Vite build tool, significantly improving development and build speed**

### Build Production Version

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist/` directory.

> ⚡ **Using Vite for building, 2-10x faster than the original Vue CLI**

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

> 🚀 **Local preview server provided by Vite for previewing production build artifacts**

### Code Check

## ⚙️ Configuration

### API Configuration

The project configuration file is located at `src/config/index.js`:

```javascript
const isProduction = process.env.NODE_ENV === 'production'

export const config = {
  // Development: http://10.0.48.168:7001
  // Production: https://10257qh6684dd.vicp.fun/zheng_en_ci
  API_BASE_URL: isProduction 
    ? 'https://10257qh6684dd.vicp.fun/zheng_en_ci'
    : 'http://10.0.48.168:7001',
  
  // Verification code interface (unified use of development environment address)
  VERIFICATION_CODE_URL: 'http://10.0.48.168:7001/api/v1/attendance/verification-code',
  
  APP_TITLE: 'AI Workshop Student Management System',
  APP_VERSION: '1.0.0'
}
```

> 📌 **Production Environment Note**: The project is deployed at [https://10257qh6684dd.vicp.fun/](https://10257qh6684dd.vicp.fun/), and the production environment API base address is `https://10257qh6684dd.vicp.fun/zheng_en_ci`

### Router Configuration

The router configuration file is located at `src/router/index.js`, including the following main routes:

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/navigation` - Navigation page (requires login)
- `/attendance` - Attendance page (requires login)
- `/dashboard` - Data dashboard (requires login)
- `/profile` - Profile page (requires login)
- `/attendance-analysis` - Attendance analysis (requires login)
- `/student-manager` - Student management (requires login)
- `/admin` - Admin page

### Theme Configuration

The project supports day/night theme switching. Theme configuration is located at `src/stores/theme.js` and `src/assets/styles/theme.css`.

## 📱 Multi-Platform Adaptation

The project uses device detection mechanism to automatically adapt to desktop and mobile:

- **Desktop** (`*Desktop.vue`): Screen width >= 768px
- **Mobile** (`*Mobile.vue`): Screen width < 768px
- **Entry file** (`*.vue`): Device detection and routing

### Page List

| Page | Desktop | Mobile |
|------|---------|--------|
| Attendance Page | `AttendancePageDesktop.vue` | `AttendancePageMobile.vue` |
| Data Dashboard | `DashboardPageDesktop.vue` | `DashboardPageMobile.vue` |
| Profile | `ProfilePageDesktop.vue` | `ProfilePageMobile.vue` |
| Attendance Analysis | `AttendanceAnalysisPageDesktop.vue` | `AttendanceAnalysisPageMobile.vue` |

## 🎨 Feature Showcase

### Main Pages

- **Home Page** - Project introduction and feature navigation
- **Login/Register** - User authentication entry
- **Navigation Page** - Feature module navigation center
- **Attendance Page** - Time-based check-in functionality
- **Data Dashboard** - Data statistics and visualization
- **Profile** - Personal profile management
- **Attendance Analysis** - Attendance data analysis
- **Student Management** - Admin student management
- **Admin Console** - System management functions

### Core Features

#### 1. Theme Switching
- Click the AI Workshop icon in the top left corner to switch themes
- Supports day mode and night mode
- Theme state persistent storage

#### 2. Token Verification
- Route guard automatically verifies Token
- Token verification result caching (5 seconds)
- Automatic redirect to login page (when Token is invalid)

#### 3. Responsive Design
- Automatic device type detection
- Desktop and mobile independent pages
- Perfect adaptation to various screen sizes

#### 4. Data Visualization
- ECharts chart display
- Real-time data updates
- Interactive data exploration

## 🔧 Development Guide

### Code Standards

- Follow ESLint standards
- Use Vue3 Composition API
- Import components on demand
- Use scoped or global style blocks for styles

### Development Specifications

For detailed development specifications, please refer to: `Note/你的身份.md`

#### Key Specifications

1. **No comments in code**
2. **All libraries must be imported on demand**
3. **Element Plus components must import style files simultaneously**
4. **Pages must support day/night mode switching**
5. **All pages must have back navigation buttons**
6. **Code must comply with ESLint standards**

### State Management

Use Pinia for state management, main Stores:

- `useUserStore` - User information management
- `useThemeStore` - Theme state management
- `useAdminStore` - Admin state management

### API Calls

API interfaces are defined in the `src/api/` directory:

- `student.js` - Student related interfaces
- `attendance.js` - Attendance related interfaces

All interfaces use unified error handling and response format.

## 📚 Related Documentation

- [API Documentation](Note/接口文档/接口文档.md) - Complete backend API interface documentation
- [Development Experience](./Note/YourExperience/) - Experience accumulated during development
- [Development Specifications](./Note/你的身份.md) - Project development specifications and best practices

## 🐛 Bug Report

If you encounter any issues during use, you can provide feedback through the following ways:

1. Submit an Issue to the Gitee repository
2. Check the experience documents in the `Note/YourExperience/` directory
3. Refer to the API documentation to troubleshoot problems

## 🤝 Contributing

Contributions are welcome! Before submitting a PR, please ensure:

1. Code complies with ESLint standards
2. All libraries are imported on demand
3. Component styles are imported correctly
4. Supports day/night mode
5. No comments in code
6. Pass all tests

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👥 Author

**Zheng EnCi**

- Gitee: [@zheng-enci050704](https://gitee.com/zheng-enci050704)

## 🙏 Acknowledgments

Thanks to the following open source projects for their support:

- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Element Plus](https://element-plus.org/) - Vue 3 based component library
- [ECharts](https://echarts.apache.org/) - Powerful data visualization library
- [Pinia](https://pinia.vuejs.org/) - Vue state management library

## 📞 Contact

If you have any questions or suggestions, please feel free to contact us:

- Submit Issue: [Gitee Issues](https://gitee.com/zheng-enci050704/ai-workshop-student-management-system-front-end/issues)

---

<div align="center">

**⭐ If this project helps you, welcome to Star!**

Made with ❤️ by Zheng EnCi

</div>
