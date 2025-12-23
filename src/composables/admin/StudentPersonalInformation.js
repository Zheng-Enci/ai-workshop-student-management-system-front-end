/**
 * 学生个人信息管理模块
 * 提供学生个人信息编辑和验证功能
 */
import { ref, reactive } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { updateStudentWithSpecialPassword } from '@/api/student'

/**
 * 学生个人信息管理Composable
 */
export function useStudentPersonalInformation() {
  // 响应式状态
  const loading = ref(false)
  const editDialogVisible = ref(false)
  const currentStudent = ref(null)
  
  // 编辑表单
  const editForm = reactive({
    studentInfoId: null,
    name: '',
    studentNumber: '',
    class: '',
    grade: '',
    email: '',
    phone: '',
    address: ''
  })
  
  // 表单验证规则
  const editFormRules = {
    name: [
      { required: true, message: '请输入学生姓名', trigger: 'blur' },
      { min: 2, max: 20, message: '姓名长度在2到20个字符', trigger: 'blur' }
    ],
    studentNumber: [
      { required: true, message: '请输入学号', trigger: 'blur' },
      { pattern: /^[0-9a-zA-Z]+$/, message: '学号只能包含字母和数字', trigger: 'blur' }
    ],
    class: [
      { required: true, message: '请输入班级', trigger: 'blur' }
    ],
    grade: [
      { required: true, message: '请输入年级', trigger: 'blur' },
      { pattern: /^[0-9]+$/, message: '年级只能包含数字', trigger: 'blur' }
    ],
    email: [
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    phone: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ]
  }

  // 管理员状态
  const adminStore = useAdminStore()

  /**
   * 打开编辑学生信息对话框
   * @param {Object} student 学生信息
   */
  const openEditDialog = (student) => {
    if (!student) return
    
    // 设置当前学生
    currentStudent.value = student
    
    // 填充表单数据
    editForm.studentInfoId = student.studentInfoId
    editForm.name = student.name || ''
    editForm.studentNumber = student.studentNumber || ''
    editForm.class = student.class || ''
    editForm.grade = student.grade || ''
    editForm.email = student.email || ''
    editForm.phone = student.phone || ''
    editForm.address = student.address || ''
    
    // 显示对话框
    editDialogVisible.value = true
  }

  /**
   * 关闭编辑对话框
   */
  const closeEditDialog = () => {
    editDialogVisible.value = false
    currentStudent.value = null
    
    // 重置表单
    Object.keys(editForm).forEach(key => {
      if (key !== 'studentInfoId') {
        editForm[key] = ''
      } else {
        editForm[key] = null
      }
    })
  }

  /**
   * 确认编辑学生信息
   * @param {Object} formRef 表单引用
   * @param {string} specialPassword 特殊密码
   * @returns {Promise} 操作结果
   */
  const confirmEdit = async (formRef, specialPassword) => {
    if (!formRef || !specialPassword) {
      return { success: false, message: '表单引用或特殊密码无效' }
    }
    
    try {
      // 验证表单
      await formRef.validate()
      
      loading.value = true
      
      // 提交数据
      const { studentInfoId, ...studentData } = editForm
      const response = await updateStudentWithSpecialPassword(
        specialPassword,
        studentInfoId,
        studentData
      )
      
      if (response.code === 200) {
        // 更新本地状态
        const student = adminStore.students.find(s => s.studentInfoId === editForm.studentInfoId)
        if (student) {
          Object.keys(student).forEach(key => {
            if (editForm[key] !== undefined && key !== 'studentInfoId') {
              student[key] = editForm[key]
            }
          })
        }
        
        // 关闭对话框
        closeEditDialog()
        
        return { success: true, message: '学生信息更新成功' }
      } else {
        return { success: false, message: response.message || '更新学生信息失败' }
      }
    } catch (error) {
      console.error('更新学生信息失败:', error)
      
      if (error && error.message) {
        // 表单验证错误
        return { success: false, message: '表单验证失败，请检查输入信息' }
      } else {
        // API调用错误
        return { success: false, message: '更新学生信息失败，请检查网络连接' }
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * 取消编辑
   * @param {Object} formRef 表单引用
   */
  const cancelEdit = (formRef) => {
    if (formRef) {
      formRef.resetFields()
    }
    closeEditDialog()
  }

  /**
   * 验证手机号
   * @param {string} phone 手机号
   * @returns {boolean} 是否有效
   */
  const validatePhone = (phone) => {
    if (!phone) return true // 可选字段
    return /^1[3-9]\d{9}$/.test(phone)
  }

  /**
   * 验证邮箱
   * @param {string} email 邮箱
   * @returns {boolean} 是否有效
   */
  const validateEmail = (email) => {
    if (!email) return true // 可选字段
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  /**
   * 验证学号
   * @param {string} studentNumber 学号
   * @returns {boolean} 是否有效
   */
  const validateStudentNumber = (studentNumber) => {
    if (!studentNumber) return false
    return /^[0-9a-zA-Z]+$/.test(studentNumber)
  }

  /**
   * 检查学号是否重复
   * @param {string} studentNumber 学号
   * @param {number} excludeStudentId 排除的学生ID
   * @returns {boolean} 是否重复
   */
  const isStudentNumberDuplicate = (studentNumber, excludeStudentId) => {
    if (!studentNumber) return false
    
    return adminStore.students.some(student => 
      student.studentNumber === studentNumber && 
      student.studentInfoId !== excludeStudentId
    )
  }

  /**
   * 格式化表单数据用于显示
   * @param {Object} student 学生信息
   * @returns {Object} 格式化后的数据
   */
  const formatStudentForDisplay = (student) => {
    return {
      ...student,
      grade: student.grade ? `${student.grade}级` : '',
      class: student.class || '',
      phone: student.phone || '未设置',
      email: student.email || '未设置',
      address: student.address || '未设置'
    }
  }

  /**
   * 重置表单
   */
  const resetForm = () => {
    Object.keys(editForm).forEach(key => {
      if (key !== 'studentInfoId') {
        editForm[key] = ''
      } else {
        editForm[key] = null
      }
    })
  }

  /**
   * 初始化模块
   * @returns {Promise} 初始化结果
   */
  const init = async () => {
    resetForm()
    return { success: true }
  }

  return {
    // 状态
    loading,
    editDialogVisible,
    currentStudent,
    editForm,
    editFormRules,
    
    // 方法
    openEditDialog,
    closeEditDialog,
    confirmEdit,
    cancelEdit,
    validatePhone,
    validateEmail,
    validateStudentNumber,
    isStudentNumberDuplicate,
    formatStudentForDisplay,
    resetForm,
    init
  }
}