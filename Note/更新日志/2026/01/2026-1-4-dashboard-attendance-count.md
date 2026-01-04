# 更新日志 - 2026年1月4日（数据看板签到统计优化）

## 📋 概述

本次更新优化了数据看板页面的签到统计功能，将"今日签到总人数"改为"今日签到总人次"，并使用新的接口获取不去重的签到数据。

---

## 🔧 一、API 接口新增

### ✨ 新增获取今日签到次数接口方法

#### 1. AttendanceApi.js
- **文件**: `src/api/AttendanceApi.js`
- **新增方法**: `getTodayAttendanceCount(date)`
- **功能**: 获取指定日期所有学生的签到记录总数（不去重）
- **接口地址**: `GET /api/v1/attendance/today-attendance-count`
- **参数**: 
  - `date` (可选): 查询日期，格式：yyyy-MM-dd，不传则查询当天
- **返回值**: 响应数据，`data` 字段为签到记录总数（数字类型）

**代码示例**:
```javascript
/**
 * 获取今日签到次数（不去重）
 * @param date - 查询日期，格式：yyyy-MM-dd，不传则查询当天
 * @returns 响应数据，data 字段为签到记录总数（数字类型）
 */
static async getTodayAttendanceCount(date) {
	const params = date ? { date } : {}
	const response = await this.api.get('/api/v1/attendance/today-attendance-count', {
		params
	}).catch(error => {
		const msg = error.response?.data?.message
		throw new Error(error.response?.status >= 500 ? '服务器错误，请稍后重试' : msg)
	})
	return response.data
}
```

---

## 📊 二、数据看板页面优化

### ✨ 桌面版和移动版同步更新

#### 1. DashboardPageDesktop.vue（桌面版）

**修改内容**:
- **导入更新**: 新增 `AttendanceApi` 导入
- **接口调用**: 将 `getDailyAttendanceCount()` 改为 `AttendanceApi.getTodayAttendanceCount()`
- **数据赋值**: 从 `dailyData.data.count` 改为 `dailyData.data`（新接口返回数字类型）
- **显示文本**: 将"今日签到总人数"改为"今日签到总人次"
- **代码清理**: 移除未使用的 `getDailyAttendanceCount` 导入

**修改位置**:
- 第 33-44 行: 导入语句更新
- 第 642 行: 接口调用更新
- 第 666 行: 数据赋值逻辑更新（使用 `!= null` 替代 `!== undefined` 以符合 ESLint 规则）
- 第 819 行: 显示文本更新

#### 2. DashboardPageMobile.vue（移动版）

**修改内容**:
- **导入更新**: 新增 `AttendanceApi` 导入
- **接口调用**: 将 `getDailyAttendanceCount()` 改为 `AttendanceApi.getTodayAttendanceCount()`
- **数据赋值**: 从 `dailyData.data.count` 改为 `dailyData.data`
- **显示文本**: 将"今日签到"改为"今日签到总人次"
- **代码清理**: 移除未使用的 `getDailyAttendanceCount` 导入

**修改位置**:
- 第 33-43 行: 导入语句更新
- 第 387 行: 接口调用更新
- 第 413 行: 数据赋值逻辑更新（使用 `!= null` 替代 `!== undefined`）
- 第 623 行: 显示文本更新

---

## 🔄 三、接口区别说明

### 旧接口 vs 新接口

| 特性 | 旧接口 (`getDailyAttendanceCount`) | 新接口 (`getTodayAttendanceCount`) |
|------|-----------------------------------|-------------------------------------|
| **接口路径** | `/api/v1/attendance/daily-count` | `/api/v1/attendance/today-attendance-count` |
| **统计方式** | 去重（同一学生多次签到只计算一次） | 不去重（所有签到记录总数） |
| **返回格式** | `{ code: 200, data: { count: 数字 } }` | `{ code: 200, data: 数字 }` |
| **适用场景** | 统计有多少学生签到 | 统计总签到次数 |
| **示例** | 3个学生今天都签到了，返回 3 | 学生A签了3次，学生B签了2次，学生C签了1次，返回 6 |

### 业务意义

- **今日签到总人数**（旧）: 表示今天有多少个不同的学生进行了签到
- **今日签到总人次**（新）: 表示今天总共发生了多少次签到行为（包括同一学生的多次签到）

---

## 🐛 四、代码质量修复

### ESLint 错误修复

**修复内容**:
1. **未使用变量**: 移除 `getDailyAttendanceCount` 的导入（已替换为新接口）
2. **undefined 使用**: 将 `dailyData.data !== undefined` 改为 `dailyData.data != null`（符合 ESLint `no-undefined` 规则）

**修复文件**:
- `src/views/DashboardPage/DashboardPageDesktop.vue`
- `src/views/DashboardPage/DashboardPageMobile.vue`

---

## 📝 五、修改文件清单

### 新增文件
- `src/api/AttendanceApi.js` - 新增 `getTodayAttendanceCount` 方法

### 修改文件
- `src/views/DashboardPage/DashboardPageDesktop.vue` - 4 处修改
- `src/views/DashboardPage/DashboardPageMobile.vue` - 4 处修改

### 统计
- **新增代码**: 约 20 行
- **修改代码**: 约 8 行
- **删除代码**: 约 2 行（未使用的导入）

---

## ✅ 六、优化效果

### 功能改进
- ✅ **数据准确性**: 使用正确的接口获取签到总人次数据
- ✅ **语义清晰**: "总人次"比"总人数"更准确地描述数据含义
- ✅ **代码规范**: 符合 ESLint 代码规范要求

### 用户体验
- ✅ **信息准确**: 用户可以看到准确的签到总人次数据
- ✅ **界面统一**: 桌面版和移动版保持一致

---

## 🔄 七、后续建议

1. **数据展示**: 考虑在界面上同时显示"签到人数"和"签到人次"，提供更全面的统计信息
2. **接口优化**: 可以考虑将两个接口合并，通过参数控制返回去重或不去重的数据
3. **缓存优化**: 对于频繁访问的统计数据，可以考虑添加缓存机制

---

**更新日期**: 2026年1月4日  
**更新类型**: 功能优化、接口新增、代码质量修复  
**影响范围**: 数据看板页面（桌面版和移动版）、API 层

