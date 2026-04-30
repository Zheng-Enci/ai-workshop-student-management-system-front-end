<template>
	<!-- 签到记录日历容器 -->
	<div class="attendance-page-calendar-desktop-component-container">
		<!-- Element Plus日历组件 -->
		<el-calendar
			v-model="calendarComponent.calendarValue.value"
			class="attendance-page-calendar-desktop-component-calendar"
			@click.stop
		>
			<!-- 日历头部自定义模板 -->
			<template #header="">
				<div class="attendance-page-calendar-desktop-component-header">
					<!-- 日历标题：显示当前年月 -->
					<div class="attendance-page-calendar-desktop-component-header-title">
						{{ calendarComponent.calendarTitle.value }}
					</div>
					<!-- 日历操作按钮组 -->
					<div class="attendance-page-calendar-desktop-component-header-actions">
						<el-button size="small" @click="calendarComponent.prevMonth()">上个月</el-button>
						<el-button size="small" @click="calendarComponent.goToday()">今天</el-button>
						<el-button size="small" @click="calendarComponent.nextMonth()">下个月</el-button>
					</div>
				</div>
			</template>

			<!-- 日历单元格自定义模板 -->
			<template #date-cell="{ data }">
				<div
					class="attendance-page-calendar-desktop-component-cell"
					:class="{
						'has-attendance': calendarComponent.attendanceRecords.value.length > 0 && calendarComponent.getDateAttendanceTimes(data.day).length > 0
					}"
				>
					<div class="attendance-page-calendar-desktop-component-cell-wrapper">
						<!-- 日期数字：显示日期号数 -->
						<div class="attendance-page-calendar-desktop-component-cell-date">
							{{ data.day.split('-')[2] }}
						</div>
						<!-- 时段签到状态：显示早/午/晚签到情况 -->
						<div class="attendance-page-calendar-desktop-component-cell-status">
							<div class="attendance-page-calendar-desktop-component-time-slot-status">
								<!-- 早上时段 -->
								<div
									class="attendance-page-calendar-desktop-component-time-slot morning"
									:class="{
										'signed': calendarComponent.isTimeSlotSigned(data.day, 'morning')
									}"
								>
									<span class="attendance-page-calendar-desktop-component-time-label">早</span>
									<el-icon
										v-if="calendarComponent.isTimeSlotSigned(data.day, 'morning')"
										class="attendance-page-calendar-desktop-component-slot-icon"
									>
										<Check />
									</el-icon>
								</div>
								<!-- 下午时段 -->
								<div
									class="attendance-page-calendar-desktop-component-time-slot afternoon"
									:class="{
										'signed': calendarComponent.isTimeSlotSigned(data.day, 'afternoon')
									}"
								>
									<span class="attendance-page-calendar-desktop-component-time-label">午</span>
									<el-icon
										v-if="calendarComponent.isTimeSlotSigned(data.day, 'afternoon')"
										class="attendance-page-calendar-desktop-component-slot-icon"
									>
										<Check />
									</el-icon>
								</div>
								<!-- 晚上时段 -->
								<div
									class="attendance-page-calendar-desktop-component-time-slot evening"
									:class="{
										'signed': calendarComponent.isTimeSlotSigned(data.day, 'evening')
									}"
								>
									<span class="attendance-page-calendar-desktop-component-time-label">晚</span>
									<el-icon
										v-if="calendarComponent.isTimeSlotSigned(data.day, 'evening')"
										class="attendance-page-calendar-desktop-component-slot-icon"
									>
										<Check />
									</el-icon>
								</div>
							</div>
						</div>
					</div>
					<!-- 签到时间提示框：有签到记录时显示详细时间 -->
					<div
						v-if="calendarComponent.attendanceRecords.value.length > 0 && calendarComponent.getDateAttendanceTimes(data.day).length > 0"
						class="attendance-page-calendar-desktop-component-tooltip"
						:data-date="data.day"
					>
						<div class="attendance-page-calendar-desktop-component-tooltip-content">
							<div class="attendance-page-calendar-desktop-component-tooltip-times">
								<div
									v-for="(time, index) in calendarComponent.attendanceRecords.value.length > 0 ? calendarComponent.getDateAttendanceTimes(data.day) : []"
									:key="index"
									class="attendance-page-calendar-desktop-component-tooltip-time-item"
								>
									<span class="attendance-page-calendar-desktop-component-tooltip-time-slot">
										{{ calendarComponent.getTimeSlotLabel(time) }}
									</span>
									<span class="attendance-page-calendar-desktop-component-tooltip-time-text">
										{{ calendarComponent.formatAttendanceTime(time) }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</el-calendar>
	</div>
</template>

<script setup lang="ts">
/**
 * 签到记录日历组件(桌面端)
 *
 * @description 签到记录日历组件，使用Element Plus的el-calendar展示签到记录
 * 按日期显示早/午/晚三个时段的签到状态，支持月份切换
 * 数据从AttendancePageDesktop单例获取，确保数据一致性
 * @component AttendancePageCalendarDesktopComponent
 * @author ZhengEnCi zheng_enci_work@foxmail.com
 * @date 2026-01
 * @version 1.0.0
 */

// ===================== Vue核心API导入 =====================
/**
 * onMounted: 组件挂载完成后的生命周期钩子
 */
import { onMounted } from 'vue'

// ===================== Element Plus组件导入 =====================
/**
 * ElCalendar: Element Plus日历组件
 * ElButton: Element Plus按钮组件
 * ElIcon: Element Plus图标组件
 * Check: Element Plus勾选图标
 */
import { ElCalendar, ElButton, ElIcon } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

// Element Plus 基础样式（按需引入）
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-calendar.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-popper.css'

// ===================== 日历组件类导入 =====================
/**
 * AttendancePageCalendarDesktopComponent: 日历组件的TypeScript逻辑类
 * 封装了日历数据加载、日期处理、签到状态判断等功能
 * 位于./ts/AttendancePageCalendarDesktopComponent.ts
 */
import AttendancePageCalendarDesktopComponent from './ts/AttendancePageCalendarDesktopComponent'

// ===================== 样式文件导入 =====================
/**
 * 导入组件样式文件
 * 样式定义在独立的CSS文件中，符合项目规范
 */
import './css/AttendancePageCalendarDesktopComponent.css'

// ===================== 组件实例创建 =====================
/**
 * 日历组件实例
 * @description AttendancePageCalendarDesktopComponent类的实例
 * 提供日历相关的所有功能方法
 */
const calendarComponent = new AttendancePageCalendarDesktopComponent()

// ===================== 生命周期钩子 =====================
/**
 * 组件挂载完成生命周期钩子
 * @description
 * 组件挂载到DOM后执行，调用loadData()方法加载签到记录数据
 */
onMounted(async () => {
	// 加载签到记录数据
	await calendarComponent.loadData()
})
</script>
