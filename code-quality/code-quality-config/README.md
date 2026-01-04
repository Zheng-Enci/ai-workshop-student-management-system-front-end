# 代码质量配置文件

本文件夹包含项目所有代码质量检查工具的配置文件。

## 配置文件列表

### 1. ESLint 配置
- **`.eslintrc.js`** - ESLint 主配置文件
- **`.eslintignore`** - ESLint 忽略文件列表

### 2. Prettier 配置
- **`prettier.config.js`** - Prettier 主配置文件（推荐使用）
- **`.prettierrc.js`** - Prettier 备用配置文件

### 3. Stylelint 配置
- **`.stylelintrc.js`** - Stylelint CSS 代码检查配置

### 4. Commitlint 配置
- **`commitlint.config.js`** - Git 提交信息规范配置

### 5. Depcheck 配置
- **`.depcheckrc.json`** - 依赖检查配置

### 6. Lint-staged 配置
- **`.lintstagedrc.js`** - Git 暂存文件检查配置

## 使用说明

所有配置文件已统一移动到本文件夹，相关工具已更新配置路径：

- **ESLint**: 通过 `--config` 参数或 `configFile` 选项指定
- **Prettier**: 通过 `--config` 参数指定
- **Stylelint**: 通过 `--config` 参数或 `configFile` 选项指定
- **Commitlint**: 通过 `--config` 参数指定
- **Depcheck**: 通过 `--config` 参数指定
- **Lint-staged**: 通过 `--config` 参数指定

## 相关文件

- **`package.json`** - 包含所有脚本命令，已更新配置文件路径
- **`vite.config.js`** - Vite 配置，已更新插件配置文件路径
- **`.husky/`** - Git hooks，已更新配置文件路径

## 注意事项

1. 修改配置文件后，需要重启开发服务器才能生效
2. 某些工具可能需要在配置文件中使用相对路径时注意路径问题
3. 如果添加新的代码质量工具，建议将配置文件也放在此文件夹中

