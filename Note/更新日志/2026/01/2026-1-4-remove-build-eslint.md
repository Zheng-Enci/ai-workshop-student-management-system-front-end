# 更新日志 - 2026年1月4日（移除构建时的 ESLint 检查）

## 📋 概述

我移除了构建时的 ESLint 检查，让构建过程更快，代码规范检查可在开发时或单独命令中执行。

---

## 🔧 修改内容

### ✨ 移除构建时的 ESLint 检查

**文件**: `package.json`

**修改内容**:
- 移除 `build` 脚本中的 `npm run lint &&`
- 移除 `prebuild` 钩子脚本
- 修改后：`build` 命令直接执行 `ANALYZE=true vite build`

**影响**:
- `npm run build` 不再自动检查 ESLint
- 构建速度更快
- 代码规范检查可通过 `npm run lint` 单独执行

---

*更新时间: 2026年1月4日*

