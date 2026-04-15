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
│   └── css-analysis-report.md          # CSS 分析报告
│
└── vite-plugins/            # Vite 自定义插件
    ├── vite-plugin-comment-coverage.js  # 注释覆盖率检查插件
    ├── vite-plugin-depcheck.js          # 依赖检查插件
    ├── vite-plugin-audit.js             # 安全审计插件
    └── vite-plugin-css-analyzer.js      # CSS 分析插件
```

## 相关文档

- [配置文件说明](./code-quality-config/README.md)
- [插件说明](./vite-plugins/README.md)

## 手动运行代码质量检查

### Stylelint CSS 检查

生成 JSON 格式的 Stylelint 报告：

```bash
npx stylelint "src/**/*.css" --formatter json > code-quality/code-quality-reports/stylelint-report.json 2>&1
```

或使用 verbose 格式：

```bash
npx stylelint "src/**/*.css" --formatter verbose > code-quality/code-quality-reports/stylelint-report.txt 2>&1
```
