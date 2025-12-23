/**
 * 学生考勤管理模块
 * 提供学生考勤记录查看、考勤补卡和考勤统计功能
 */
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { 
  getTodayAttendanceRecords, 
  getStudentAttendanceRecords, 
  makeupAttendanceWithSpecialPassword 
} from '@/api/attendance'

/**
 * 学生考勤管理Composable
 */
export function useStudentAttendance() {
  // 响应式状态
  const todayAttendanceRecords = ref([])
  const allStudentAttendanceRecords = ref([])
  const loading = ref(false)
  const makeupForm = ref({
    studentInfoId: null,
    attendanceId: null,
    specialPassword: '',
    date: '',
    period: 'morning'
  })
  const makeupDialogVisible = ref(false)
  const attendanceRecordsDialogVisible = ref(false)
  
  // 管理员状态
  const adminStore = useAdminStore()

  /**
   * 获取今日考勤记录
   * @returns {Promise} 请求结果
   */
  const fetchTodayAttendance = async () => {
    loading.value = true
    try {
      const response = await getTodayAttendanceRecords()
      if (response.code === 200 && response.data) {
        todayAttendanceRecords.value = response.data
        return { success: true }
      } else {
        return { success: false, message: response.message || '获取今日考勤记录失败' }
      }
    } catch (error) {
      console.error('获取今日考勤记录失败:', error)
      return { success: false, message: '获取今日考勤记录失败，请检查网络连接' }
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取学生考勤记录
   * @param {string|number} studentId 学生ID
   * @param {Object} params 查询参数
   * @returns {Promise} 请求结果
   */
  const fetchStudentAttendance = async (studentId, params = {}) => {
    loading.value = true
    try {
      const response = await getStudentAttendanceRecords(studentId)
      
      if (response.code === 200 && response.data) {
        allStudentAttendanceRecords.value = response.data
        return { success: true }
      } else {
        return { success: false, message: response.message || '获取学生考勤记录失败' }
      }
    } catch (error) {
      console.error('获取学生考勤记录失败:', error)
      return { success: false, message: '获取学生考勤记录失败，请检查网络连接' }
    } finally {
      loading.value = false
    }
  }

  /**
   * 显示今日考勤
   * @returns {Promise} 请求结果
   */
  const showTodayAttendance = async () => {
    const result = await fetchTodayAttendance()
    return result
  }

  /**
   * 打开学生考勤记录对话框
   * @param {string|number} studentId 学生ID
   * @returns {Promise} 请求结果
   */
  const openAttendanceRecordsDialog = async (studentId) => {
    const result = await fetchStudentAttendance(studentId)
    if (result.success) {
      attendanceRecordsDialogVisible.value = true
    }
    return result
  }

  /**
   * 关闭考勤记录对话框
   */
  const closeAttendanceRecordsDialog = () => {
    attendanceRecordsDialogVisible.value = false
    allStudentAttendanceRecords.value = []
  }

  /**
   * 打开补卡对话框
   * @param {Object} attendanceInfo 考勤信息
   */
  const openMakeupDialog = (attendanceInfo) => {
    makeupForm.value = {
      studentInfoId: attendanceInfo.studentInfoId,
      attendanceId: attendanceInfo.id,
      specialPassword: '',
      date: attendanceInfo.date || '',
      period: attendanceInfo.period || 'morning'
    }
    makeupDialogVisible.value = true
  }

  /**
   * 关闭补卡对话框
   */
  const closeMakeupDialog = () => {
    makeupDialogVisible.value = false
    makeupForm.value = {
      studentInfoId: null,
      attendanceId: null,
      specialPassword: '',
      date: '',
      period: 'morning'
    }
  }

  /**
   * 提交补卡申请
   * @returns {Promise} 请求结果
   */
  const submitMakeup = async () => {
    // 验证表单
    if (!makeupForm.value.specialPassword) {
      return { success: false, message: '请输入特殊密码' }
    }

    loading.value = true
    try {
      const response = await makeupAttendanceWithSpecialPassword(
        makeupForm.value.specialPassword,
        makeupForm.value.studentInfoId,
        makeupForm.value.attendanceTime
      )
      
      if (response.code === 200) {
        closeMakeupDialog()
        // 刷新考勤记录
        if (makeupForm.value.studentInfoId) {
          await fetchStudentAttendance(makeupForm.value.studentInfoId)
        }
        return { success: true, message: '补卡成功' }
      } else {
        return { success: false, message: response.message || '补卡失败' }
      }
    } catch (error) {
      console.error('补卡失败:', error)
      return { success: false, message: '补卡失败，请检查网络连接' }
    } finally {
      loading.value = false
    }
  }

  /**
   * 格式化考勤时间
   * @param {string} time 时间字符串
   * @returns {string} 格式化后的时间
   */
  const formatAttendanceTime = (time) => {
    if (!time) return ''
    
    const date = new Date(time)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    
    return `${hours}:${minutes}`
  }

  /**
   * 根据时间获取时间段样式类
   * @param {string} time 时间字符串
   * @returns {string} 样式类名
   */
  const getTimePeriodClass = (time) => {
    if (!time) return ''
    
    const hour = new Date(time).getHours()
    
    if (hour >= 6 && hour < 12) {
      return 'morning'
    } else if (hour >= 12 && hour < 18) {
      return 'afternoon'
    } else if (hour >= 18 && hour < 22) {
      return 'evening'
    } else {
      return 'night'
    }
  }

  /**
   * 根据时间获取时间段名称
   * @param {string} time 时间字符串
   * @returns {string} 时间段名称
   */
  const getTimePeriodName = (time) => {
    if (!time) return ''
    
    const hour = new Date(time).getHours()
    
    if (hour >= 6 && hour < 12) {
      return '上午'
    } else if (hour >= 12 && hour < 18) {
      return '下午'
    } else if (hour >= 18 && hour < 22) {
      return '晚上'
    } else {
      return '深夜'
    }
  }

  /**
   * 计算考勤统计
   * @param {Array} attendanceRecords 考勤记录
   * @returns {Object} 统计结果
   */
  const getAttendanceStats = (attendanceRecords) => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      total: attendanceRecords.length
    }
    
    attendanceRecords.forEach(record => {
      switch (record.status) {
        case 'present':
          stats.present++
          break
        case 'absent':
          stats.absent++
          break
        case 'late':
          stats.late++
          break
        case 'leave':
          stats.leave++
          break
      }
    })
    
    return stats
  }

  /**
   * 获取考勤状态文本
   * @param {string} status 状态代码
   * @returns {string} 状态文本
   */
  const getAttendanceStatusText = (status) => {
    const statusMap = {
      'present': '出勤',
      'absent': '缺勤',
      'late': '迟到',
      'leave': '请假'
    }
    
    return statusMap[status] || '未知'
  }

  /**
   * 获取考勤状态类型
   * @param {string} status 状态代码
   * @returns {string} 状态类型
   */
  const getAttendanceStatusType = (status) => {
    const typeMap = {
      'present': 'success',
      'absent': 'danger',
      'late': 'warning',
      'leave': 'info'
    }
    
    return typeMap[status] || 'info'
  }

  /**
   * 获取今日考勤统计
   * @returns {Object} 今日考勤统计
   */
  const todayAttendanceStats = computed(() => {
    return getAttendanceStats(todayAttendanceRecords.value)
  })

  /**
   * 初始化模块
   * @returns {Promise} 初始化结果
   */
  const init = async () => {
    const result = await fetchTodayAttendance()
    return result
  }

  return {
    // 状态
    todayAttendanceRecords,
    allStudentAttendanceRecords,
    loading,
    makeupForm,
    makeupDialogVisible,
    attendanceRecordsDialogVisible,
    
    // 计算属性
    todayAttendanceStats,
    
    // 方法
    fetchTodayAttendance,
    fetchStudentAttendance,
    showTodayAttendance,
    openAttendanceRecordsDialog,
    closeAttendanceRecordsDialog,
    openMakeupDialog,
    closeMakeupDialog,
    submitMakeup,
    formatAttendanceTime,
    getTimePeriodClass,
    getTimePeriodName,
    getAttendanceStats,
    getAttendanceStatusText,
    getAttendanceStatusType,
    init
  }
}