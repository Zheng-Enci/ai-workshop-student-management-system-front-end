<script setup lang="ts">
/**
 * 查看学生考勤记录表单
 * 功能描述: 查看指定学生的所有考勤签到记录（日历视图）
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 * 样式来源: 复制 StudentManagerPage 的考勤记录表单，并添加表单名前缀
 */

import {computed, nextTick, ref, watch} from 'vue'
import {ElButton, ElCalendar, ElDialog, ElIcon, ElMessage} from 'element-plus'
import {Calendar} from '@element-plus/icons-vue'
import AttendanceApi from '../../../../api/ts/AttendanceApi.ts'
import {useLoadingMaskStore} from '@/stores/ts/loading'

/**
 * 考勤记录数据类型接口
 * 定义单个考勤记录的数据结构
 */
interface AttendanceRecord {
	attendanceDateTime: string
}


// Props
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	student: {
		type: Object,
		default: () => null
	}
})


// Emits
const emit = defineEmits(['update:modelValue'])


// 计算属性: 是否显示弹窗
const dialogVisible = computed({
	get: () => {
		return props.modelValue
	},
	set: (val) => {
		emit('update:modelValue', val)
	}
})

// 使用全局加载蒙版 Store
const loadingMaskStore = useLoadingMaskStore()

// 表单内部状态
const attendanceRecords = ref<AttendanceRecord[]>([])
const calendarValue = ref(new Date())
const isLoading = ref(false)

/**
 * 加载考勤记录
 * 调用 API 获取学生考勤记录
 */
const loadAttendanceRecords = async () => {

	if (!props.student?.studentId) {
		console.warn('[ViewAttendanceRecordsForm] 没有 studentId, 取消加载')
		return
	}

	isLoading.value = true
	loadingMaskStore.showLoadingMask('正在加载考勤记录...')

	try {
		const response = await AttendanceApi.getStudentAttendanceRecords(props.student.studentId)
		// 适配接口返回数据结构: response.data 直接包含数组
		attendanceRecords.value = response.data || []

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "未知错误"
		ElMessage.error(`加载考勤记录失败: ${errorMessage}`)
		attendanceRecords.value = []
	} finally {
		nextTick().then(() => {
			setTimeout(() => {
				loadingMaskStore.hideLoadingMask()
				isLoading.value = false
			}, 512)
		})
	}
}

/**
 * 获取指定日期的考勤时间段
 * @param dateStr - 日期字符串 (YYYY-MM-DD)
 * @param slot - 时间段 ('morning' | 'afternoon' | 'evening')
 * @returns string
 */
const getAttendanceTimeBySlot = (dateStr, slot) => {
	if (!attendanceRecords.value || attendanceRecords.value.length === 0) {
		return ''
	}

	// ✅ 使用 filter() 获取该日期所有记录，而不是 find()
	const dayRecords = attendanceRecords.value.filter(r => {
		if (!r.attendanceDateTime) return false
		const recordDate = new Date(r.attendanceDateTime).toISOString().split('T')[0]
		return recordDate === dateStr
	})

	// 遍历该日期的所有记录，找到匹配时间段的
	for (const record of dayRecords) {
		const checkInTime = new Date(record.attendanceDateTime)
		const hour = checkInTime.getHours()

		// 判断时间段
		if (slot === 'morning' && hour >= 8 && hour <= 11) {
			return checkInTime.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})
		} else if (slot === 'afternoon' && hour >= 14 && hour <= 17) {
			return checkInTime.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})
		} else if (slot === 'evening' && hour >= 19 && hour <= 22) {
			return checkInTime.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})
		}
	}

	return ''
}


/**
 * 监听 dialogVisible 变化，打开时加载数据
 */
watch(dialogVisible, (newVal) => {
	if (newVal) {
		loadAttendanceRecords()
	} else {
		attendanceRecords.value = []
		calendarValue.value = new Date()
	}
}, {immediate: false})

/**
 * 关闭弹窗
 */
const handleClose = () => {
	dialogVisible.value = false
	// 清空数据
	attendanceRecords.value = []
	calendarValue.value = new Date()
}

</script>

<template>
	<el-dialog
		v-model="dialogVisible"
		v-if="dialogVisible"
		:title="`${student?.name} 的考勤记录`"
		width="800px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		class="view-attendance-records-form-dialog"
		modal-class="view-attendance-records-form-dialog-overlay"
		@close="handleClose"
	>
		<div class="view-attendance-records-form-container">
			<!-- 无数据提示 -->
			<div v-if="!attendanceRecords || attendanceRecords.length === 0" style="text-align: center; padding: 40px;">
				<el-icon :size="48">
					<Calendar/>
				</el-icon>
				<p style="margin-top: 16px; color: #909399;">暂无考勤记录</p>
			</div>

			<!-- 日历视图 -->
			<div v-else>
				<el-calendar v-model="calendarValue">
					<template #header="{ date }">
						<div>{{ date }}</div>
						<div>
							<el-button size="small"
									   @click="calendarValue = new Date(calendarValue.getFullYear(), calendarValue.getMonth() - 1)">
								上个月
							</el-button>
							<el-button size="small" @click="calendarValue = new Date()">今天</el-button>
							<el-button size="small"
									   @click="calendarValue = new Date(calendarValue.getFullYear(), calendarValue.getMonth() + 1)">
								下个月
							</el-button>
						</div>
					</template>
					<template #date-cell="{ data }">
						<div class="view-attendance-records-form-list-item">
							<div class="view-attendance-records-form-list-item-div">
								<span
									:class="{ 'view-attendance-records-form-list-item-has-attendance': getAttendanceTimeBySlot(data.day, 'morning') }"
								>
									早:&nbsp;&nbsp;{{ getAttendanceTimeBySlot(data.day, 'morning') }}
								</span>

								<span
									:class="{ 'view-attendance-records-form-list-item-has-attendance': getAttendanceTimeBySlot(data.day, 'afternoon') }"
								>
									午:&nbsp;&nbsp;{{ getAttendanceTimeBySlot(data.day, 'afternoon') }}
								</span>

								<span
									:class="{ 'view-attendance-records-form-list-item-has-attendance': getAttendanceTimeBySlot(data.day, 'evening') }"
								>
									晚:&nbsp;&nbsp;{{ getAttendanceTimeBySlot(data.day, 'evening') }}
								</span>
							</div>

							<span class="view-attendance-records-form-list-item-span">
								{{ data.day.split('-')[2] }}
							</span>
						</div>
					</template>
				</el-calendar>
			</div>
		</div>

		<template #footer>
			<div>
				<el-button @click="handleClose">关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
/* ==================== 考勤记录列表项 ==================== */

/**
 * 考勤记录对话框里面的每一个"天"块
 * 使用flex布局，左右分布显示日期和时间段信息
 */
.view-attendance-records-form-list-item {
	display: flex; /* 弹性布局 */
	justify-content: space-between; /* 两端对齐 */
}

/**
 * 考勤记录列表项的内容容器
 * 垂直排列时间段信息
 */
.view-attendance-records-form-list-item-div {
	display: flex; /* 弹性布局 */
	flex-direction: column; /* 垂直方向排列 */
	gap: 4px; /* 子元素间距 */
	margin-top: 8px; /* 顶部外边距 */
}

/**
 * 时间段文本样式
 * 为每个时间段添加内边距
 */
.view-attendance-records-form-list-item-div span {
	padding: 0 4px; /* 左右内边距 */
	font-size: 12px; /* 字体大小 */
	color: #606266; /* 文字颜色 */
}

/**
 * 日期数字圆形标识
 * 显示日期数字的圆形背景，用于标识每一天
 * 使用项目主色冰川青
 */
.view-attendance-records-form-list-item-span {
	font-size: 14px; /* 字体大小 */
	font-weight: bold; /* 字体粗细 */
	background-color: #3CBDB1; /* 冰川青 - 项目主色 */
	height: 20px; /* 高度 */
	width: 20px; /* 宽度 */
	border-radius: 50%; /* 圆形 */
	align-items: center; /* 垂直居中 */
	justify-content: center; /* 水平居中 */
	display: flex; /* 弹性布局 */
	color: white !important; /* 白色文字 */
	margin-right: 0; /* 右边距为0 */
}

/* ==================== 有签到记录的样式 ==================== */

/**
 * 考勤记录对话框有签到记录的时间段样式
 * 当某个时间段有签到记录时，应用此样式，使用项目主色冰川青高亮显示
 */
.view-attendance-records-form-list-item-has-attendance {
	font-weight: bold; /* 加粗字体 */
	background-color: #3CBDB1; /* 冰川青 - 项目主色 */
	border-radius: 4px; /* 圆角 */
	color: white !important; /* 白色文字 */
}

/* ==================== 容器样式 ==================== */

.view-attendance-records-form-container {
	padding: 20px 0;
	min-height: 400px;
}

/* ==================== 夜间模式适配 ==================== */

/**
 * 考勤记录对话框夜间模式下的文字颜色
 * 在深色模式下，将文字颜色调整为较浅的灰色，提高可读性
 */
html.dark .view-attendance-records-form-list-item * {
	color: #5a6c7d !important; /* 浅灰色文字 */
}

html.dark .view-attendance-records-form-list-item-has-attendance {
	color: white !important; /* 白色文字 */
}
</style>
