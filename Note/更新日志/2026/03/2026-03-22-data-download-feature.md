# 2026-03-22 数据下载功能实现

## 功能实现
- 新增 `DataDownloadForm.vue` 组件，实现数据下载表单
- 在 `AdminPageDesktop.vue` 中添加数据下载按钮
- 在 `AdminPageUtils.ts` 中完善 CSV 导出功能

## 技术细节
- 实现了获取上周七天日期的逻辑
- 循环调用考勤 API 获取每日签到人次
- 按索引顺序存储数据，索引 0 代表周一
- 生成 CSV 文件，第一行为 "一" 到 "七"，第二行为对应签到次数
- 集成了 CSV 导出功能，支持文件下载

## 修改文件
- `src/views/AdminPage/AdminPageDesktop.vue`
- `src/views/AdminPage/ts/AdminPageUtils.ts`
- `src/views/AdminPage/forms/desktop/DataDownloadForm.vue`