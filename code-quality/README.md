# 代码质量工具

本文件夹统一管理项目所有代码质量相关的配置、插件和报告。

## 文件夹结构

```
code-quality/
├── code-quality-config/     # 代码质量配置文件
│   ├── .eslintrc.js         # ESLint 配置
│   ├── .eslintignore        # ESLint 忽略文件
│   ├── .prettierrc.js       # Prettier 配置
│   ├── prettier.config.js   # Prettier 配置（主配置）
│   ├── .stylelintrc.js      # Stylelint 配置
│   ├── .lintstagedrc.js     # lint-staged 配置
│   ├── commitlint.config.js # Commitlint 配置
│   └── .depcheckrc.json     # Depcheck 配置
│
├── code-quality-reports/    # 代码质量检查报告
│   ├── comment-coverage-report.md      # 注释覆盖率报告
│   ├── dependency-check-report.md       # 依赖检查报告
│   ├── security-audit-report.md         # 安全审计报告
│   ├── css-analysis-report.md          # CSS 分析报告
│   └── eslint-report.md                # ESLint 代码规范检查报告
│
└── vite-plugins/            # Vite 自定义插件
    ├── vite-plugin-comment-coverage.js  # 注释覆盖率检查插件
    ├── vite-plugin-depcheck.js          # 依赖检查插件
    ├── vite-plugin-audit.js             # 安全审计插件
    ├── vite-plugin-css-analyzer.js      # CSS 分析插件
    └── vite-plugin-eslint-report.js     # ESLint 报告生成插件
```

## 功能说明

### 1. code-quality-config/ - 配置文件
包含所有代码质量工具的配置文件：
- **ESLint**: JavaScript/Vue 代码检查
- **Prettier**: 代码格式化
- **Stylelint**: CSS 代码检查
- **Commitlint**: Git 提交信息规范
- **Depcheck**: 依赖检查配置
- **Lint-staged**: 暂存文件检查配置

### 2. code-quality-reports/ - 检查报告
自动生成的代码质量检查报告（Markdown 格式）：
- **注释覆盖率报告**: 统计代码注释情况
- **依赖检查报告**: 检查未使用的依赖
- **安全审计报告**: 检查依赖安全漏洞
- **CSS 分析报告**: 检查未使用的 CSS
- **ESLint 报告**: 检查 JavaScript/Vue 代码规范问题

### 3. vite-plugins/ - Vite 插件
自定义 Vite 插件，在开发模式启动时自动运行：
- 自动执行代码质量检查
- 生成检查报告
- 不阻塞开发服务器启动

## 使用方式

### 配置文件
配置文件在以下位置被引用：
- `package.json` - npm 脚本命令
- `vite.config.js` - Vite 构建配置
- `.husky/` - Git hooks

### 检查报告
报告在每次运行 `npm run dev` 时自动生成，覆盖旧报告。

### 插件
插件在 `vite.config.js` 中引入，开发模式启动时自动运行。

## 注意事项

1. **配置文件路径**: 所有配置文件路径已更新为 `code-quality/code-quality-config/...`
2. **报告路径**: 所有报告保存在 `code-quality/code-quality-reports/...`
3. **插件路径**: 所有插件路径已更新为 `code-quality/vite-plugins/...`
4. **修改配置**: 修改配置文件后需要重启开发服务器才能生效

## 相关文档

- [配置文件说明](./code-quality-config/README.md)
- [插件说明](./vite-plugins/README.md)

