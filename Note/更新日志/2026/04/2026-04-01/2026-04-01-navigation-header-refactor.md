# 2026-04-01 - 重构：提取 NavigationPage 顶栏样式

## 重构

- 将顶栏相关样式提取到 `src/views/NavigationPage/css/desktop/header.css`
- 更新 `NavigationPageDesktop.vue` 引入独立 CSS 文件

### 提取的样式

- `.header` / `.header-top` / `.header-left` / `.header-center` / `.header-right`
- `.home-btn` - 首页按钮
- `.logo` / `.logo:hover` - Logo 图片
- `.title-section h1` / `.title-section p` - 标题区域
- `.page-title-wrapper` / `.page-title` - 页面标题
- `.logout-btn` - 退出登录按钮
- 暗色模式样式
- 响应式样式（768px 以下）
