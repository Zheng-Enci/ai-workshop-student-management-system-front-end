# CSS 分析工具 - 企业级版本

## 功能特性

### 核心功能
- ✅ **智能检测**: 自动扫描项目中的所有CSS文件，检测未使用的样式
- ✅ **多格式报告**: 支持JSON、Markdown、HTML三种报告格式
- ✅ **性能优化**: 并发处理、智能缓存，大幅提升分析速度
- ✅ **详细统计**: 提供文件级、项目级的详细统计数据
- ✅ **错误处理**: 完善的错误处理和日志系统
- ✅ **CI/CD集成**: 支持在CI/CD流程中自动运行

### 企业级特性
- 🏢 **企业级标准**: 遵循大厂企业级开发规范
- 📊 **详细报告**: 生成专业的分析报告，支持多种格式
- 🔍 **智能缓存**: 24小时缓存机制，避免重复分析
- ⚡ **高性能**: 并发处理，支持自定义并发数
- 🛡️ **安全可靠**: 完善的错误处理和异常捕获
- 📝 **完整日志**: 多级别日志系统，便于问题排查

## 安装依赖

```bash
npm install --save-dev purgecss
```

## 自动检查机制

### 🚀 构建时严格检查（已启用 - 零容忍模式）

**每次执行 `npm run build` 时会自动运行严格检查**，**不允许存在任何未使用的CSS**。如果发现任何未使用的CSS，构建将被阻止。

```bash
npm run build  # 自动包含CSS严格检查，发现任何未使用CSS都会阻止构建
```

**严格模式特性：**
- ✅ 检查所有CSS文件（不限制数量）
- ✅ 阈值设置为0%（不允许任何未使用CSS）
- ✅ 发现未使用CSS时立即阻止构建
- ✅ 提供详细的错误信息和建议

### ⚙️ 开发时可选检查

开发服务器运行时，可以通过环境变量启用CSS分析：

```bash
# 启用开发时CSS分析（可选）
CSS_ANALYZER_ENABLED=true npm run dev

# 然后在浏览器访问 http://localhost:3000/__css_analyzer_check 查看分析结果
```

**注意**: 开发时检查默认关闭，因为会影响开发性能。仅在需要时启用。

### 📋 提交时检查（可选）

如需在提交代码时自动检查，可以添加到 `lint-staged` 配置中（当前未启用，避免影响提交速度）。

## 使用方法

### 基础用法

```bash
# 分析所有CSS文件
npm run analyze:css

# 快速检查（用于构建时）
npm run analyze:css:quick

# 分析所有CSS文件并生成HTML报告
npm run analyze:css:html

# 调试模式（显示详细日志）
npm run analyze:css:debug
```

### 高级用法

```bash
# 分析指定文件
node scripts/css-analyzer.js --file src/views/HomePage/HomePageDesktop.css

# 自定义报告格式
node scripts/css-analyzer.js --formats json,markdown,html

# 设置并发数（默认5）
node scripts/css-analyzer.js --concurrency 10

# 禁用缓存
node scripts/css-analyzer.js --no-cache

# 设置阈值（只显示未使用比例超过阈值的文件）
node scripts/css-analyzer.js --threshold 10
```

## 命令行参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `--file <path>` | 分析指定CSS文件 | `--file src/styles/main.css` |
| `--all` | 分析所有CSS文件（默认行为） | `--all` |
| `--formats <formats>` | 指定报告格式，逗号分隔 | `--formats json,markdown,html` |
| `--html` | 生成HTML报告 | `--html` |
| `--debug` | 启用调试模式 | `--debug` |
| `--concurrency <num>` | 设置并发数（默认5） | `--concurrency 10` |
| `--threshold <num>` | 设置阈值百分比 | `--threshold 10` |
| `--no-cache` | 禁用缓存 | `--no-cache` |

## 报告格式

### JSON报告
- 位置: `.css-analysis/css-analysis-report.json`
- 包含完整的分析数据、统计信息、日志等
- 适合程序化处理和CI/CD集成

### Markdown报告
- 位置: `.css-analysis/css-analysis-report.md`
- 人类可读的格式，包含详细的统计和优化建议
- 适合代码审查和文档记录

### HTML报告
- 位置: `.css-analysis/css-analysis-report.html`
- 美观的可视化报告，包含图表和表格
- 适合在浏览器中查看和分享

## 配置说明

### 安全列表（Safelist）

工具会自动保留以下类型的CSS，不会被标记为未使用：

- Element Plus组件类名（`el-*`）
- 主题相关类名（`dark`, `light`, `theme-toggle-*`）
- Vue相关（`data-v-*`, `v-*`）
- 状态类名（`is-*`, `has-*`）
- ECharts相关（`echarts-*`）
- FullCalendar相关（`fullcalendar-*`）

### 缓存机制

- 默认启用24小时缓存
- 缓存基于文件内容和内容文件列表的哈希值
- 缓存文件存储在 `.css-analysis/cache/` 目录
- 使用 `--no-cache` 可禁用缓存

## CI/CD集成

### GitHub Actions示例

```yaml
name: CSS Analysis

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run analyze:css
      - uses: actions/upload-artifact@v3
        with:
          name: css-analysis-report
          path: .css-analysis/
```

### GitLab CI示例

```yaml
css-analysis:
  stage: test
  script:
    - npm ci
    - npm run analyze:css
  artifacts:
    paths:
      - .css-analysis/
    expire_in: 7 days
```

## 性能优化建议

1. **使用缓存**: 默认启用缓存，可大幅提升重复分析速度
2. **调整并发数**: 根据机器性能调整 `--concurrency` 参数
3. **增量分析**: 使用 `--file` 参数只分析特定文件
4. **定期清理**: 定期清理 `.css-analysis/cache/` 目录

## 最佳实践

1. **定期运行**: 建议在每次发布前运行分析
2. **代码审查**: 将报告纳入代码审查流程
3. **阈值设置**: 设置合理的阈值，避免过度优化
4. **确认后再删除**: 对于未使用的CSS，确认不是动态生成或第三方库所需后再删除

## 故障排查

### 问题：分析速度慢
- 解决方案：增加 `--concurrency` 参数值
- 检查：确保启用了缓存

### 问题：误报未使用的CSS
- 解决方案：检查安全列表配置
- 检查：确认是否为动态生成的类名

### 问题：报告未生成
- 解决方案：检查 `.css-analysis/` 目录权限
- 检查：查看错误日志

## 技术栈

- **PurgeCSS**: CSS清理核心引擎
- **Node.js**: 运行环境
- **ES Modules**: 模块系统

## 版本信息

- **版本**: 1.0.0
- **更新日期**: 2026-01-02
- **维护者**: AI坊学生管理系统开发团队

## 许可证

本项目遵循项目主许可证。

