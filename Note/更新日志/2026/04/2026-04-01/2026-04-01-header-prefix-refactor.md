# 2026-04-01 - 重构：header.css 样式添加统一前缀

## 重构

- 为 `header.css` 中所有样式规则添加统一的 `header-` 前缀
- 更新 `NavigationPageDesktop.vue` 模板中的类名引用

### 类名前缀变更

- `.header` → `.header-container`
- `.home-btn` → `.header-home-btn`
- `.logo` → `.header-logo`
- `.title-section` → `.header-title-section`
- `.page-title-wrapper` → `.header-page-title-wrapper`
- `.page-title` → `.header-page-title`
- `.logout-btn` → `.header-logout-btn`
- 动画 `gradient-shift` → `header-gradient-shift`
