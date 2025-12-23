/**
 * 学生积分管理模块
 * 提供学生积分查询、调整和变更记录功能
 */
import { ref, reactive } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { 
  getTotalPointsByStudentInfoId, 
  createPointsRecord, 
  getAllAdjustRecordsByStudentInfoId 
} from '@/api/points'

/**
 * 学生积分管理Composable
 */
export function useStudentPoints() {
  // 响应式状态
  const loading = ref(false)
  const studentPoints = ref({})
  const pointsDialogVisible = ref(false)
  const scoreChangeRecordsDialogVisible = ref(false)
  const scoreChangeRecords = ref([])
  const currentStudent = ref(null)
  
  // 积分调整表单
  const pointsForm = reactive({
    studentInfoId: null,
    changeAmount: 0,
    reason: '',
    operation: 'add', // add 或 subtract
    specialPassword: ''
  })
  
  // 积分表单验证规则
  const pointsFormRules = {
    changeAmount: [
      { required: true, message: '请输入积分变更数量', trigger: 'blur' },
      { type: 'number', message: '积分变更数量必须为数字', trigger: 'blur' },
      { min: 1, message: '积分变更数量必须大于0', trigger: 'blur' }
    ],
    reason: [
      { required: true, message: '请输入变更原因', trigger: 'blur' },
      { min: 5, max: 200, message: '变更原因长度在5到200个字符', trigger: 'blur' }
    ],
    specialPassword: [
      { required: true, message: '请输入特殊密码', trigger: 'blur' }
    ]
  }

  // 管理员状态
  const adminStore = useAdminStore()

  /**
   * 加载学生积分数据
   * @param {string|number} studentId 学生ID
   * @returns {Promise} 加载结果
   */
  const loadStudentPoints = async (studentId) => {
    if (!studentId) {
      return { success: false, message: '学生ID无效' }
    }
    
    loading.value = true
    try {
      const response = await getTotalPointsByStudentInfoId(studentId)
      
      if (response.code === 200 && response.data !== undefined) {
        studentPoints.value = {
          ...studentPoints.value,
          [studentId]: response.data
        }
        return { success: true, points: response.data }
      } else {
        return { success: false, message: response.message || '获取学生积分失败' }
      }
    } catch (error) {
      console.error('获取学生积分失败:', error)
      return { success: false, message: '获取学生积分失败，请检查网络连接' }
    } finally {
      loading.value = false
    }
  }

  /**
   * 批量加载多个学生积分
   * @param {Array} studentIds 学生ID列表
   * @returns {Promise} 加载结果
   */
  const loadMultipleStudentPoints = async (studentIds) => {
    if (!studentIds || !Array.isArray(studentIds)) {
      return { success: false, message: '学生ID列表无效' }
    }
    
    loading.value = true
    const results = []
    
    try {
      for (const studentId of studentIds) {
        const result = await loadStudentPoints(studentId)
        results.push({
          studentId,
          points: result.success ? result.points : 0,
          success: result.success,
          message: result.message
        })
      }
      
      return { success: true, results }
    } catch (error) {
      console.error('批量获取学生积分失败:', error)
      return { success: false, message: '批量获取学生积分失败' }
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取学生积分
   * @param {string|number} studentId 学生ID
   * @returns {number} 积分数量
   */
  const getStudentPoints = (studentId) => {
    return studentPoints.value[studentId] || 0
  }

  /**
   * 打开积分调整对话框
   * @param {Object} student 学生信息
   */
  const openPointsDialog = (student) => {
    if (!student) return
    
    // 设置当前学生
    currentStudent.value = student
    
    // 填充表单数据
    pointsForm.studentInfoId = student.studentInfoId
    pointsForm.changeAmount = 0
    pointsForm.reason = ''
    pointsForm.operation = 'add'
    pointsForm.specialPassword = ''
    
    // 显示对话框
    pointsDialogVisible.value = true
  }

  /**
   * 关闭积分调整对话框
   */
  const closePointsDialog = () => {
    pointsDialogVisible.value = false
    currentStudent.value = null
    resetPointsForm()
  }

  /**
   * 确认积分调整
   * @param {Object} formRef 表单引用
   * @returns {Promise} 操作结果
   */
  const confirmPoints = async (formRef) => {
    if (!formRef) {
      return { success: false, message: '表单引用无效' }
    }
    
    try {
      // 验证表单
      await formRef.validate()
      
      loading.value = true
      
      // 计算变更后的积分
      const currentPoints = getStudentPoints(pointsForm.studentInfoId)
      const changeAmount = pointsForm.operation === 'add' 
        ? pointsForm.changeAmount 
        : -pointsForm.changeAmount
      const newPoints = currentPoints + changeAmount
      
      // 检查积分是否会变为负数
      if (newPoints < 0) {
        return { success: false, message: '积分不能为负数，请调整变更数量' }
      }
      
      // 提交积分变更
      const response = await createPointsRecord(
        pointsForm.specialPassword,
        pointsForm.reason,
        changeAmount,
        pointsForm.studentInfoId
      )
      
      if (response.code === 200) {
        // 更新本地积分状态
        studentPoints.value = {
          ...studentPoints.value,
          [pointsForm.studentInfoId]: newPoints
        }
        
        // 关闭对话框
        closePointsDialog()
        
        return { 
          success: true, 
          message: `积分调整成功，${pointsForm.operation === 'add' ? '增加' : '扣除'} ${Math.abs(changeAmount)} 积分`,
          newPoints
        }
      } else {
        return { success: false, message: response.message || '积分调整失败' }
      }
    } catch (error) {
      console.error('积分调整失败:', error)
      
      if (error && error.message) {
        // 表单验证错误
        return { success: false, message: '表单验证失败，请检查输入信息' }
      } else {
        // API调用错误
        return { success: false, message: '积分调整失败，请检查网络连接' }
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * 取消积分调整
   * @param {Object} formRef 表单引用
   */
  const cancelPoints = (formRef) => {
    if (formRef) {
      formRef.resetFields()
    }
    closePointsDialog()
  }

  /**
   * 打开积分变更记录对话框
   * @param {Object} student 学生信息
   * @returns {Promise} 操作结果
   */
  const openScoreChangeRecordsDialog = async (student) => {
    if (!student) {
      return { success: false, message: '学生信息无效' }
    }
    
    loading.value = true
    try {
      // 获取积分变更记录
      const response = await getAllAdjustRecordsByStudentInfoId(student.studentInfoId)
      
      if (response.code === 200 && response.data) {
        scoreChangeRecords.value = response.data
        currentStudent.value = student
        scoreChangeRecordsDialogVisible.value = true
        return { success: true }
      } else {
        return { success: false, message: response.message || '获取积分变更记录失败' }
      }
    } catch (error) {
      console.error('获取积分变更记录失败:', error)
      return { success: false, message: '获取积分变更记录失败，请检查网络连接' }
    } finally {
      loading.value = false
    }
  }

  /**
   * 关闭积分变更记录对话框
   */
  const closeScoreChangeRecordsDialog = () => {
    scoreChangeRecordsDialogVisible.value = false
    scoreChangeRecords.value = []
    currentStudent.value = null
  }

  /**
   * 重置积分表单
   */
  const resetPointsForm = () => {
    Object.keys(pointsForm).forEach(key => {
      if (key === 'studentInfoId') {
        pointsForm[key] = null
      } else if (key === 'changeAmount') {
        pointsForm[key] = 0
      } else if (key === 'operation') {
        pointsForm[key] = 'add'
      } else {
        pointsForm[key] = ''
      }
    })
  }

  /**
   * 格式化积分变更记录
   * @param {Array} records 积分变更记录
   * @returns {Array} 格式化后的记录
   */
  const formatScoreChangeRecords = (records) => {
    if (!records || !Array.isArray(records)) {
      return []
    }
    
    return records.map(record => ({
      ...record,
      displayAmount: record.points > 0 ? `+${record.points}` : record.points.toString(),
      displayType: record.points > 0 ? '增加' : '扣除',
      displayTime: formatTime(record.createTime)
    }))
  }

  /**
   * 格式化时间
   * @param {string} time 时间字符串
   * @returns {string} 格式化后的时间
   */
  const formatTime = (time) => {
    if (!time) return ''
    
    const date = new Date(time)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  /**
   * 获取积分排名
   * @returns {Array} 学生积分排名列表
   */
  const getStudentPointsRanking = () => {
    const studentsWithPoints = adminStore.students.map(student => ({
      ...student,
      points: getStudentPoints(student.studentInfoId)
    }))
    
    // 按积分降序排序
    return studentsWithPoints.sort((a, b) => b.points - a.points)
  }

  /**
   * 初始化模块
   * @returns {Promise} 初始化结果
   */
  const init = async () => {
    resetPointsForm()
    return { success: true }
  }

  return {
    // 状态
    loading,
    studentPoints,
    pointsDialogVisible,
    scoreChangeRecordsDialogVisible,
    scoreChangeRecords,
    currentStudent,
    pointsForm,
    pointsFormRules,
    
    // 方法
    loadStudentPoints,
    loadMultipleStudentPoints,
    getStudentPoints,
    openPointsDialog,
    closePointsDialog,
    confirmPoints,
    cancelPoints,
    openScoreChangeRecordsDialog,
    closeScoreChangeRecordsDialog,
    resetPointsForm,
    formatScoreChangeRecords,
    formatTime,
    getStudentPointsRanking,
    init
  }
}