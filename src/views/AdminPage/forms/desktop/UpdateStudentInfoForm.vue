<script setup>
/**
 * 修改学生个人信息表单
 * 功能描述: 通过特殊密码修改指定学生的所有信息
 * 自包含组件: 包含所有状态、逻辑和 API 调用
 */

import { ref, computed, watch } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElButton, ElMessage } from 'element-plus'
import SpecialPasswordApi from '../../../../api/ts/SpecialPasswordApi'
import { specialPassword } from '../../ts/AdminPage'
import { useLoadingMaskStore } from '../../../../stores/loading'
import { nextTick } from 'vue'

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
const emit = defineEmits(['update:modelValue', 'success'])

// 计算属性: 是否显示弹窗
const dialogVisible = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val)
})

// 使用全局加载蒙版 Store
const loadingMaskStore = useLoadingMaskStore()

// 表单数据
const formData = ref({
	name: '',
	studentId: '',
	gender: '',
	phoneNumber: '',
	college: '',
	major: '',
	grade: null,
	classNum: null,
	password: ''
})

// 表单引用
const formRef = ref()

// 性别选项
const genderOptions = [
	{ label: '男', value: '男' },
	{ label: '女', value: '女' }
]

// 表单验证规则
const rules = {
	name: [
		{ required: true, message: '姓名不能为空', trigger: 'blur' },
		{ min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
	],
	studentId: [
		{ required: true, message: '学号不能为空', trigger: 'blur' },
		{ pattern: /^(2[0-9]|30)\d{8}$/, message: '学号必须是10位数字且以20-30开头', trigger: 'blur' }
	],
	gender: [
		{ required: true, message: '性别不能为空', trigger: 'change' }
	],
	phoneNumber: [
		{ required: true, message: '手机号不能为空', trigger: 'blur' },
		{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
	],
	college: [
		{ required: true, message: '学院不能为空', trigger: 'blur' }
	],
	major: [
		{ required: true, message: '专业不能为空', trigger: 'blur' }
	],
	grade: [
		{ required: true, message: '年级不能为空', trigger: 'change' },
		{ type: 'number', message: '请输入有效的年级', trigger: 'change' }
	],
	classNum: [
		{ required: true, message: '班级不能为空', trigger: 'change' },
		{ type: 'number', message: '请输入有效的班级', trigger: 'change' }
	],
	password: [
		{
			validator: (rule, value, callback) => {
				// 如果有值，则验证长度
				if (value && (value.length < 6 || value.length > 20)) {
					callback(new Error('密码长度在 6 到 20 个字符'))
				} else {
					callback()
				}
			},
			trigger: 'blur'
		}
	]
}

/**
 * 初始化表单数据
 * 当弹窗打开时，将学生信息填充到表单
 */
const initFormData = () => {
	if (props.student) {
		formData.value = {
			name: props.student.name || '',
			studentId: props.student.studentId || '',
			gender: props.student.gender || '',
			phoneNumber: props.student.phoneNumber || '',
			college: props.student.college || '',
			major: props.student.major || '',
			grade: props.student.grade || null,
			classNum: props.student.classNum || null,
			password: '' // 密码不预填充，需要重新输入
		}
	}
}

// 监听弹窗打开，初始化表单数据
watch(() => props.modelValue, (newVal) => {
	if (newVal) {
		nextTick(() => {
			initFormData()
		})
	}
})

/**
 * 提交修改
 * 调用 API 修改学生信息
 */
const handleConfirm = async () => {
	// 表单验证
	if (!formRef.value) return

	await formRef.value.validate(async (valid) => {
		if (!valid) return

		try {
			// 显示全局加载蒙版
			loadingMaskStore.showLoadingMask('正在修改学生信息...')

			// 构建提交数据（仅当密码有值时才包含密码字段）
			const submitData = {
				name: formData.value.name,
				studentId: formData.value.studentId,
				gender: formData.value.gender,
				phoneNumber: formData.value.phoneNumber,
				college: formData.value.college,
				major: formData.value.major,
				grade: formData.value.grade,
				classNum: formData.value.classNum
			}

			// 仅当填写了新密码时才包含 password 字段
			if (formData.value.password) {
				submitData.password = formData.value.password
			}

			// 调用 API 修改学生信息
			const response = await SpecialPasswordApi.updateStudentWithSpecialPassword(
				specialPassword.value,
				props.student?.studentId,
				submitData
			)

			if (response.code === 200) {
				// 关闭弹窗
				dialogVisible.value = false
				// 重置表单
				formRef.value.resetFields()
				// 触发成功事件
				emit('success')
				ElMessage.success(response.message)
			} else {
				ElMessage.error(response.message)
			}

			// 延迟关闭加载蒙版
			nextTick().then(() => {
				setTimeout(() => {
					loadingMaskStore.hideLoadingMask()
				}, 512)
			})

		} catch (error) {
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
	})
}

/**
 * 关闭弹窗
 */
const handleClose = () => {
	formRef.value?.resetFields()
	dialogVisible.value = false
}
</script>

<template>
	<el-dialog
		v-model="dialogVisible"
		v-if="dialogVisible"
		:title="`修改 ${student?.name} 的个人信息`"
		width="600px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:teleported="true"
		@close="handleClose"
		@open="initFormData"
	>
		<el-form
			ref="formRef"
			:model="formData"
			:rules="rules"
			label-width="100px"
			label-position="left"
		>
			<el-form-item label="姓名" prop="name">
				<el-input
					v-model="formData.name"
					placeholder="请输入姓名"
					clearable
				/>
			</el-form-item>
			<el-form-item label="学号" prop="studentId">
				<el-input
					v-model="formData.studentId"
					placeholder="请输入学号（10位数字，以20-30开头）"
					clearable
				/>
			</el-form-item>
			<el-form-item label="性别" prop="gender">
				<el-select
					v-model="formData.gender"
					placeholder="请选择性别"
					style="width: 100%"
				>
					<el-option
						v-for="option in genderOptions"
						:key="option.value"
						:label="option.label"
						:value="option.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="手机号" prop="phoneNumber">
				<el-input
					v-model="formData.phoneNumber"
					placeholder="请输入手机号"
					clearable
				/>
			</el-form-item>
			<el-form-item label="学院" prop="college">
				<el-input
					v-model="formData.college"
					placeholder="请输入学院"
					clearable
				/>
			</el-form-item>
			<el-form-item label="专业" prop="major">
				<el-input
					v-model="formData.major"
					placeholder="请输入专业"
					clearable
				/>
			</el-form-item>
			<el-form-item label="年级" prop="grade">
				<el-input-number
					v-model="formData.grade"
					:precision="0"
					:step="1"
					:min="1"
					:max="10"
					placeholder="请输入年级"
					style="width: 100%"
				/>
			</el-form-item>
			<el-form-item label="班级" prop="classNum">
				<el-input-number
					v-model="formData.classNum"
					:precision="0"
					:step="1"
					:min="1"
					:max="50"
					placeholder="请输入班级"
					style="width: 100%"
				/>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input
					v-model="formData.password"
					type="password"
					placeholder="请输入新密码（6-20位），不填写则不修改密码"
					show-password
				/>
			</el-form-item>
		</el-form>

		<template #footer>
			<div>
				<el-button @click="handleClose">取消</el-button>
				<el-button
					type="primary"
					@click="handleConfirm"
				>
					确认修改
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
</style>
