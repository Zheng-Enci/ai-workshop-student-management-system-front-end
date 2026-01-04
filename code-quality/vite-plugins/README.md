# Vite 自定义插件

本文件夹包含项目自定义的 Vite 插件，用于代码质量检查和报告生成。

## 插件列表

### 1. `vite-plugin-comment-coverage.js` - 注释覆盖率检查插件
- **功能**: 检查代码注释覆盖率
- **作用**: 
  - 统计 `src` 目录下 `.js` 和 `.vue` 文件的注释行数和代码行数
  - 计算注释覆盖率（注释行数 / 代码行数）
  - 识别注释率较低的文件
- **生成报告**: `code-quality/code-quality-reports/comment-coverage-report.md`

### 2. `vite-plugin-depcheck.js` - 依赖检查插件
- **功能**: 检查未使用的依赖包
- **作用**:
  - 扫描 `package.json` 中的依赖
  - 识别未使用的依赖和缺失的依赖
  - 过滤已配置忽略的依赖（根据 `code-quality/code-quality-config/.depcheckrc.json`）
- **生成报告**: `code-quality/code-quality-reports/dependency-check-report.md`

### 3. `vite-plugin-audit.js` - 安全审计插件
- **功能**: 检查依赖包的安全漏洞
- **作用**:
  - 运行 `npm audit` 检查安全漏洞
  - 统计严重、高危、中等、低危漏洞数量
  - 列出漏洞详情和修复建议
- **生成报告**: `code-quality/code-quality-reports/security-audit-report.md`

### 4. `vite-plugin-css-analyzer.js` - CSS 分析插件
- **功能**: 检查未使用的 CSS 代码
- **作用**:
  - 使用 PurgeCSS 分析 CSS 文件
  - 识别未使用的 CSS 选择器
  - 统计 CSS 使用情况
  - 可配置是否在发现未使用 CSS 时阻止开发服务器启动
- **生成报告**: `code-quality/code-quality-reports/css-analysis-report.md`

## 共同特性

1. **自动运行**: 在 `npm run dev` 启动开发模式时自动执行
2. **异步执行**: 使用 `setImmediate` 异步执行，不阻塞开发服务器启动
3. **静默失败**: 出错时静默处理，不影响开发流程
4. **统一报告**: 所有报告都保存到 `code-quality/code-quality-reports` 文件夹
5. **报告格式**: 所有报告都是 Markdown 格式，便于阅读

## 使用说明

这些插件在 `vite.config.js` 中被引入和使用：

```javascript
import { cssAnalyzerPlugin } from './code-quality/vite-plugins/vite-plugin-css-analyzer.js'
import { depcheckPlugin } from './code-quality/vite-plugins/vite-plugin-depcheck.js'
import { auditPlugin } from './code-quality/vite-plugins/vite-plugin-audit.js'
import { commentCoveragePlugin } from './code-quality/vite-plugins/vite-plugin-comment-coverage.js'
```

每次运行 `npm run dev` 时，这些插件会自动检查代码质量并生成报告，无需手动运行。

## 配置

插件的配置在 `vite.config.js` 中进行，可以根据需要调整：

- **enabled**: 是否启用插件
- **skipOnError**: 出错时是否跳过
- **threshold**: 阈值设置
- **其他插件特定配置**: 详见各插件的代码注释

