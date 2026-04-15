<script setup>
/**
 * 修改学生所属管理员表单
 * 功能描述: 为指定学生修改所属管理员
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 */

import {ref, computed} from 'vue'
import {ElDialog, ElButton, ElMessage} from 'element-plus'
import SpecialPasswordApi from '../../../../api/ts/SpecialPasswordApi.ts'
import {specialPassword, updateStudentAdmin} from '../../ts/AdminPage.ts'
import {useLoadingMaskStore} from '../../../../stores/ts/loading'
import {nextTick} from 'vue'
import {allStudentInfos} from '../../ts/AdminPage.ts'

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
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val)
})

// 使用全局加载蒙版 Store
const loadingMaskStore = useLoadingMaskStore()

// 表单内部状态
const selectedAdminId = ref(null)

// 管理员选项（从现有学生数据中提取等级为3的管理员）
const adminOptions = computed(() => {
	const admins = allStudentInfos.value.filter(student => student.level === 3)
	return admins.map(admin => ({
		label: admin.name,
		value: admin.id,
		studentId: admin.studentId
	}))
})

/**
 * 提交修改
 * 调用 API 修改学生所属管理员
 */
const handleConfirm = async () => {
	const selected = adminOptions.value.find(opt => opt.value === selectedAdminId.value)

	try {
		// 显示全局加载蒙版
		loadingMaskStore.showLoadingMask('正在修改学生所属管理员...')

		// 调用 API 修改学生所属管理员
		const response = await SpecialPasswordApi.assignStudentToAdmin(
			specialPassword.value,
			props.student?.studentId,
			selected.studentId
		)

		if (response.code === 200) {
			// 关闭弹窗
			dialogVisible.value = false
			// 更新本地数据
			updateStudentAdmin(
				props.student?.id,
				selectedAdminId.value,
			)
			ElMessage.success(response.message)
		} else {
			ElMessage.error(response.message)
		}

		// 延迟关闭加载蒙版，确保页面渲染完成
		nextTick().then(() => {
			setTimeout(() => {
				loadingMaskStore.hideLoadingMask()
			}, 512)
		})

	} catch (error) {
		// 用户取消确认时不显示错误
		if (error === 'cancel') return

		// 显示错误提示
		const errorMessage = error instanceof Error ? error.message : "未知错误"
		ElMessage.error(`修改失败: ${errorMessage}`)

		// 关闭加载蒙版
		nextTick().then(() => {
			setTimeout(() => {
				loadingMaskStore.hideLoadingMask()
			}, 512)
		})
	}
}

/**
 * 关闭弹窗
 */
const handleClose = () => {
	selectedAdminId.value = null
	dialogVisible.value = false
}
</script>

<template>
	<el-dialog
		v-model="dialogVisible"
		v-if="dialogVisible"
		:title="`修改 ${student?.name} 的所属管理员`"
		width="500px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		@close="handleClose"
	>
		<div>
			<div style="
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
				gap: 8px;
			">
				<el-button
					v-for="option in adminOptions"
					:key="option.value"
					:type="selectedAdminId === option.value ? 'primary' : 'default'"
					size="large"
					@click="selectedAdminId = option.value"
				>
					{{ option.label }}
				</el-button>
			</div>
		</div>
		<template #footer>
			<div>
				<el-button @click="handleClose">取消</el-button>
				<el-button
					type="primary"
					:disabled="selectedAdminId === props.student?.adminId"
					@click="handleConfirm"
				>
					确认
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>

</style>
