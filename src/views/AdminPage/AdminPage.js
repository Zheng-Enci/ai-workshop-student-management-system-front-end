import {ref, computed, onMounted, nextTick, watch} from 'vue'
import { useRouter } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {
  getAllStudentsWithSpecialPassword,
  setStudentLevel,
  getStudentLevel,
  updateStudentWithSpecialPassword,
  getAdminInfo,
  assignStudentToAdmin,
  getAvatarUrl
} from '@/api/student'
import {
  getStudentAttendanceCount,
  getDailyAttendanceCount,
  getMonthlyAttendanceCount,
  getTodayAttendanceRecords,
  getStudentAttendanceRecords,
  makeupAttendanceWithSpecialPassword
} from '@/api/attendance'
import {createPointsRecord, getAllAdjustRecordsByStudentInfoId, getTotalPointsByStudentInfoId} from '@/api/points'
import * as echarts from 'echarts/core'
import {BarChart, LineChart, HeatmapChart} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent
} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'
import {useAdminStore} from '@/stores/admin'
import {useThemeStore} from '@/stores/theme'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  BarChart,
  LineChart,
  HeatmapChart,
  CanvasRenderer
])

export const useAdminPage = () => {
  const adminStore = useAdminStore()
  const themeStore = useThemeStore()
  const {toggleTheme} = themeStore
  const router = useRouter()

  const isAuthenticated = ref(false)
  const specialPassword = ref('')
  const authError = ref('')
  const authLoading = ref(false)
  const isLoading = ref(false)
  const isDataLoaded = ref(false)
  const loadingProgress = ref(0)
  const loadingStatus = ref('正在验证身份...')
  const students = ref([])
  const searchKeyword = ref('')
  const currentPage = ref(1)
  const pageSize = ref(20)
  const totalStudents = ref(0)
  const todayCount = ref(0)
  const monthlyCount = ref(0)
  const studentLevels = ref({})
  const studentAttendanceCounts = ref({})
  const studentAdmins = ref({})
  const studentPoints = ref({})
  const activeLevelTab = ref('0')
  const editDialogVisible = ref(false)
  const editFormRef = ref()
  const editForm = ref({
    name: '',
    studentId: '',
    gender: '',
    phoneNumber: '',
    college: '',
    major: '',
    grade: 1,
    classNum: 1,
    password: ''
  })
  const currentEditStudentId = ref('')
  const todayAttendanceDialogVisible = ref(false)
  const todayAttendanceRecords = ref([])
  const attendanceRecordsDialogVisible = ref(false)
  const currentStudentInfo = ref({})
  const calendarValue = ref(new Date())
  const scrollPosition = ref(0)
  const allStudentAttendanceRecords = ref([])
  const calendarSlots = [
    {key: 'morning', label: '早'},
    {key: 'afternoon', label: '午'},
    {key: 'evening', label: '晚'}
  ]

  const filteredStudentAttendanceRecords = computed(() => {
    if (!allStudentAttendanceRecords.value || allStudentAttendanceRecords.value.length === 0) {
      return []
    }

    const currentDate = calendarValue.value
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    return allStudentAttendanceRecords.value.filter(record => {
      if (!record || !record.attendanceDateTime) {
        return false
      }

      const recordDate = new Date(record.attendanceDateTime)
      return recordDate.getFullYear() === currentYear && recordDate.getMonth() === currentMonth
    })
  })

  const heatmapDialogVisible = ref(false)
  const trendDialogVisible = ref(false)
  const heatmapChart = ref(null)
  const lineChart = ref(null)
  const heatmapInstance = ref(null)
  const lineInstance = ref(null)
  const showDateDetailsDialog = ref(false)
  const selectedDate = ref('')
  const makeupDialogVisible = ref(false)
  const makeupLoading = ref(false)
  const makeupSelectedStudent = ref(null)
  const makeupStep = ref('date')
  const makeupFormRef = ref()
  const datePickerRef = ref()
  const makeupForm = ref({
    attendanceTime: '',
    selectedDate: '',
    selectedHour: null
  })
  const pointsDialogVisible = ref(false)
  const pointsLoading = ref(false)
  const pointsSelectedStudent = ref(null)
  const pointsFormRef = ref()
  const pointsForm = ref({
    changePoints: null,
    adjustReason: ''
  })

  
  const scoreChangeRecordsDialogVisible = ref(false)
  const scoreChangeRecordsLoading = ref(false)
  const scoreChangeRecords = ref([])
  const currentScoreChangeRecordsStudent = ref(null)
  
  
  const datetimeShortcuts = [
    {
      key: 'today-morning',
      label: '今天早上',
      dateOffset: 0,
      timeSlot: 'morning',
      defaultHour: 8
    },
    {
      key: 'today-afternoon',
      label: '今天下午',
      dateOffset: 0,
      timeSlot: 'afternoon',
      defaultHour: 14
    },
    {
      key: 'today-evening',
      label: '今天晚上',
      dateOffset: 0,
      timeSlot: 'evening',
      defaultHour: 19
    },
    {
      key: 'yesterday-morning',
      label: '昨天早上',
      dateOffset: -1,
      timeSlot: 'morning',
      defaultHour: 8
    },
    {
      key: 'yesterday-afternoon',
      label: '昨天下午',
      dateOffset: -1,
      timeSlot: 'afternoon',
      defaultHour: 14
    },
    {
      key: 'yesterday-evening',
      label: '昨天晚上',
      dateOffset: -1,
      timeSlot: 'evening',
      defaultHour: 19
    }
  ]

  
  const getShortcutDate = (shortcut) => {
    const date = new Date()
    date.setDate(date.getDate() + shortcut.dateOffset)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  
  const timeSlots = [
    {
      label: '早上',
      key: 'morning',
      hours: [8, 9, 10, 11]
    },
    {
      label: '下午',
      key: 'afternoon',
      hours: [14, 15, 16, 17]
    },
    {
      label: '晚上',
      key: 'evening',
      hours: [19, 20, 21, 22]
    }
  ]

  
  const validHours = timeSlots.flatMap(slot => slot.hours)
  const makeupDateFormRules = {
    selectedDate: [
      {required: true, message: '请选择日期', trigger: 'change'}
    ]
  }

  const levelOptions = [
    {value: 0, label: '社团成员', color: 'info'},
    {value: 1, label: '普通成员', color: 'success'},
    {value: 2, label: '核心成员', color: 'warning'},
    {value: 3, label: '管理员', color: 'danger'}
  ]

  const adminOptions = computed(() => {
    if (!students.value.length) return []

    const adminStudents = students.value.filter(student => {
      const level = studentLevels.value[student.studentId] || 0
      return level === 3
    })

    return adminStudents.map(student => ({
      value: student.studentId,
      label: `${student.name} (${student.studentId})`,
      student: student
    }))
  })

  const editFormRules = {
    name: [
      {required: true, message: '请输入学生姓名', trigger: 'blur'}
    ],
    studentId: [
      {required: true, message: '请输入学号', trigger: 'blur'},
      {pattern: /^[2-3][0-9]\d{8}$/, message: '学号格式不正确（以20-30开头的10位数字）', trigger: 'blur'}
    ],
    gender: [
      {required: true, message: '请选择性别', trigger: 'change'}
    ],
    phoneNumber: [
      {required: true, message: '请输入手机号', trigger: 'blur'},
      {pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'}
    ],
    college: [
      {required: true, message: '请输入学院', trigger: 'blur'}
    ],
    major: [
      {required: true, message: '请输入专业', trigger: 'blur'}
    ],
    grade: [
      {required: true, message: '请选择年级', trigger: 'change'}
    ],
    classNum: [
      {required: true, message: '请输入班级', trigger: 'blur'}
    ],
    password: [
      {min: 6, max: 16, message: '密码长度必须在6到16位之间', trigger: 'blur'}
    ]
  }

  const pointsFormRules = {
    changePoints: [
      {required: true, message: '请输入积分变动值', trigger: 'blur'},
      {type: 'number', message: '积分变动值必须为数字', trigger: 'blur'}
    ],
    adjustReason: [
      {required: true, message: '请输入改分理由', trigger: 'blur'},
      {max: 500, message: '改分理由不能超过500个字符', trigger: 'blur'}
    ]
  }

  const filteredStudents = computed(() => {
    if (!searchKeyword.value) {
      return students.value
    }
    const keyword = searchKeyword.value.toLowerCase()
    return students.value.filter(student => {
      try {
        return (
          (student.name && student.name.toLowerCase().includes(keyword)) ||
          (student.studentId && String(student.studentId).toLowerCase().includes(keyword)) ||
          (student.phoneNumber && String(student.phoneNumber).includes(keyword)) ||
          (student.college && student.college.toLowerCase().includes(keyword)) ||
          (student.major && student.major.toLowerCase().includes(keyword))
        )
      } catch (error) {
        console.error('Filter student error:', error, student)
        return false
      }
    })
  })

  const getLevelStudents = (levelCode) => {
    return filteredStudents.value.filter(student => {
      const studentLevel = studentLevels.value[student.studentId] || 0
      return studentLevel === levelCode
    })
  }

  const currentLevelStudents = computed(() => {
    const currentLevel = parseInt(activeLevelTab.value)
    return getLevelStudents(currentLevel)
  })

  const changeLevel = async (studentId, newLevel) => {
    if (studentLevels.value[studentId] === newLevel) {
      return
    }

    const adminPassword = adminStore.getAdminPassword()
    if (!adminPassword) {
      ElMessage.error('身份验证已过期，请重新登录')
      isAuthenticated.value = false
      adminStore.clearAdminPassword()
      return
    }

    isLoading.value = true
    try {
      const response = await setStudentLevel(adminPassword, studentId, newLevel)
      if (response.code === 200) {
        const oldLevel = studentLevels.value[studentId] || 0
        studentLevels.value[studentId] = newLevel

        if (oldLevel === 3 && newLevel !== 3) {
          Object.keys(studentAdmins.value).forEach(key => {
            if (studentAdmins.value[key]?.adminStudentId === studentId) {
              studentAdmins.value[key] = null
            }
          })
        }

        if (newLevel === 3) {
          studentAdmins.value[studentId] = null
        }

        ElMessage.success('学生等级设置成功')
      } else {
        ElMessage.error(response.message || '设置失败')
        studentLevels.value[studentId] = studentLevels.value[studentId] || 0
      }
    } catch (error) {
      ElMessage.error(error.message)
      studentLevels.value[studentId] = studentLevels.value[studentId] || 0
    } finally {
      isLoading.value = false
    }
  }

  const changeAdmin = async (studentId, newAdminId) => {
    const currentAdminId = studentAdmins.value[studentId]?.adminStudentId
    if (currentAdminId === newAdminId) {
      return
    }

    const studentLevel = studentLevels.value[studentId] || 0
    if (studentLevel === 3) {
      ElMessage.warning('管理员不能分配所属管理员')
      return
    }

    const adminPassword = adminStore.getAdminPassword()
    if (!adminPassword) {
      ElMessage.error('身份验证已过期，请重新登录')
      isAuthenticated.value = false
      adminStore.clearAdminPassword()
      return
    }

    isLoading.value = true
    try {
      const response = await assignStudentToAdmin(adminPassword, studentId, newAdminId)
      if (response.code === 200) {
        if (newAdminId) {
          const selectedAdmin = adminOptions.value.find(admin => admin.value === newAdminId)
          if (selectedAdmin) {
            studentAdmins.value[studentId] = {
              adminStudentId: newAdminId,
              adminName: selectedAdmin.student.name
            }
          }
        } else {
          studentAdmins.value[studentId] = null
        }
        ElMessage.success('管理员分配成功')
      } else {
        ElMessage.error(response.message || '分配失败')
      }
    } catch (error) {
      ElMessage.error(error.message)
    } finally {
      isLoading.value = false
    }
  }

  const loadStudentLevels = async () => {
    if (!students.value.length) return

    try {
      const levelPromises = students.value.map(async (student) => {
        try {
          const response = await getStudentLevel(student.studentId)
          if (response.code === 200) {
            studentLevels.value[student.studentId] = response.data.levelCode
          }
        } catch (error) {
          studentLevels.value[student.studentId] = 0
        }
      })
      await Promise.all(levelPromises)
    } catch (error) {
      ElMessage.error('加载学生等级失败：' + error.message)
    }
  }

  const loadStudentAttendanceCounts = async () => {
    if (!students.value.length) return

    try {
      const attendancePromises = students.value.map(async (student) => {
        try {
          const response = await getStudentAttendanceCount(student.studentId)
          if (response.code === 200) {
            studentAttendanceCounts.value[student.studentId] = response.data.count
          } else {
            studentAttendanceCounts.value[student.studentId] = 0
          }
        } catch (error) {
          studentAttendanceCounts.value[student.studentId] = 0
        }
      })
      await Promise.all(attendancePromises)
    } catch (error) {
      ElMessage.error('加载学生签到次数失败：' + error.message)
    }
  }

  const loadStudentPoints = async () => {
    if (!students.value.length) return

    try {
      const pointsPromises = students.value.map(async (student) => {
        try {
          const response = await getTotalPointsByStudentInfoId(student.studentId)
          if (response.code === 200) {
            studentPoints.value[student.studentId] = response.data
          } else {
            studentPoints.value[student.studentId] = {totalPoints: 0, attendancePoints: 0, activityPoints: 0}
          }
        } catch (error) {
          studentPoints.value[student.studentId] = {totalPoints: 0, attendancePoints: 0, activityPoints: 0}
        }
      })
      await Promise.all(pointsPromises)
    } catch (error) {
      ElMessage.error('加载学生积分信息失败：' + error.message)
    }
  }

  const loadStudentAdmins = async () => {
    if (!students.value.length) return

    try {
      const adminPromises = students.value.map(async (student) => {
        try {
          const response = await getAdminInfo(student.studentId)
          if (response.code === 200 && response.data) {
            studentAdmins.value[student.studentId] = response.data
          } else {
            studentAdmins.value[student.studentId] = null
          }
        } catch (error) {
          studentAdmins.value[student.studentId] = null
        }
      })
      await Promise.all(adminPromises)
    } catch (error) {
      ElMessage.warning('部分学生管理员信息加载失败，请刷新重试')
    }
  }

  /**
   * 加载学生头像
   */
  const loadStudentAvatars = async () => {
    if (!students.value.length) return

    try {
      const avatarPromises = students.value.map(async (student) => {
        
        const studentInfoId = student.id
        if (!studentInfoId) {
          student.hasAvatar = false
          student.avatarUrl = null
          return
        }

        const avatarUrlString = getAvatarUrl(studentInfoId)
        if (avatarUrlString) {
          
          const avatarUrlWithTimestamp = avatarUrlString + '?t=' + Date.now()
          
          student.avatarUrl = avatarUrlWithTimestamp
          student.hasAvatar = true
          
          const img = new Image()
          img.onload = () => {
            student.hasAvatar = true
          }
          img.onerror = () => {
            student.hasAvatar = false
            student.avatarUrl = null
          }
          img.src = avatarUrlWithTimestamp
        } else {
          student.hasAvatar = false
          student.avatarUrl = null
        }
      })
      await Promise.all(avatarPromises)
    } catch (error) {
      console.error('加载学生头像失败:', error)
    }
  }

  /**
   * 处理头像加载错误
   */
  const handleAvatarError = (student) => {
    student.hasAvatar = false
    student.avatarUrl = null
  }

  const loadStatistics = async () => {
    try {
      const [dailyData, monthlyData] = await Promise.all([
        getDailyAttendanceCount(),
        getMonthlyAttendanceCount()
      ])

      if (dailyData.code === 200) {
        todayCount.value = dailyData.data.count
      }

      if (monthlyData.code === 200) {
        monthlyCount.value = monthlyData.data.count
      }
    } catch (error) {
      ElMessage.error('统计数据加载失败：' + error.message)
    }
  }

  const refreshData = async () => {
    const adminPassword = adminStore.getAdminPassword()
    if (!adminPassword) {
      ElMessage.error('身份验证已过期，请重新登录')
      isAuthenticated.value = false
      adminStore.clearAdminPassword()
      return
    }

    isLoading.value = true
    try {
      const response = await getAllStudentsWithSpecialPassword(adminPassword)
      if (response.code === 200) {
        students.value = response.data
        totalStudents.value = response.data.length
        await loadStatistics()
        await loadStudentLevels()
        await loadStudentAttendanceCounts()
        await loadStudentPoints()
        await loadStudentAdmins()
        await loadStudentAvatars()
        ElMessage.success('数据刷新成功')
      }
    } catch (error) {
      ElMessage.error('数据刷新失败：' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  const openEditDialog = (student) => {
    currentEditStudentId.value = student.studentId
    editForm.value = {
      name: student.name,
      studentId: student.studentId.toString(),
      gender: student.gender,
      phoneNumber: student.phoneNumber,
      college: student.college,
      major: student.major,
      grade: student.grade,
      classNum: student.classNum,
      password: ''
    }
    editDialogVisible.value = true
  }

  const cancelEdit = () => {
    editDialogVisible.value = false
    editFormRef.value?.resetFields()
    currentEditStudentId.value = ''
  }

  const confirmEdit = async () => {
    if (!editFormRef.value) return

    try {
      await editFormRef.value.validate()

      const adminPassword = adminStore.getAdminPassword()
      if (!adminPassword) {
        ElMessage.error('身份验证已过期，请重新登录')
        isAuthenticated.value = false
        adminStore.clearAdminPassword()
        return
      }

      isLoading.value = true

      const response = await updateStudentWithSpecialPassword(
        adminPassword,
        currentEditStudentId.value,
        editForm.value
      )

      if (response.code === 200) {
        ElMessage.success('学生信息修改成功')
        editDialogVisible.value = false
        await refreshData()
      } else {
        ElMessage.error(response.message || '修改失败')
      }
    } catch (error) {
      if (error.message) {
        ElMessage.error(error.message)
      }
    } finally {
      isLoading.value = false
    }
  }

  const showTodayAttendance = async () => {
    try {
      isLoading.value = true
      const response = await getTodayAttendanceRecords()
      if (response.code === 200) {
        todayAttendanceRecords.value = response.data || []
        todayAttendanceDialogVisible.value = true
      } else {
        ElMessage.error(response.message || '获取今日签到记录失败')
      }
    } catch (error) {
      ElMessage.error('获取今日签到记录失败：' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  const formatAttendanceTime = (timeString) => {
    if (!timeString) return ''
    const date = new Date(timeString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getTimePeriodClass = (timeString) => {
    if (!timeString) return 'morning'
    const date = new Date(timeString)
    const hour = date.getHours()

    if (hour >= 8 && hour < 11) {
      return 'morning'
    } else if (hour >= 14 && hour < 17) {
      return 'afternoon'
    } else if (hour >= 19 && hour < 22) {
      return 'evening'
    } else {
      return 'morning'
    }
  }

  const getTimePeriodName = (timeString) => {
    if (!timeString) return '早上'
    const date = new Date(timeString)
    const hour = date.getHours()

    if (hour >= 8 && hour < 11) {
      return '早上'
    } else if (hour >= 14 && hour < 17) {
      return '下午'
    } else if (hour >= 19 && hour < 22) {
      return '晚上'
    } else {
      return '早上'
    }
  }


  const isSlotSigned = (dateStr, slotKey) => {
    const times = getDateAttendanceTimes(dateStr)
    if (!times.length) return false
    return times.some(time => getTimePeriodClass(time) === slotKey)
  }

  const openDateDetails = (dateStr) => {
    selectedDate.value = dateStr
    showDateDetailsDialog.value = true
  }

  const openAttendanceRecordsDialog = async (student) => {
    currentStudentInfo.value = student
    scrollPosition.value = window.pageYOffset || document.documentElement.scrollTop

    try {
      isLoading.value = true
      const response = await getStudentAttendanceRecords(student.studentId)
      if (response.code === 200) {
        allStudentAttendanceRecords.value = response.data || []
        const firstRecordDate = allStudentAttendanceRecords.value[0]?.attendanceDateTime
        const baseDate = firstRecordDate ? new Date(firstRecordDate) : new Date()
        calendarValue.value = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
        selectedDate.value = firstRecordDate ? firstRecordDate.split('T')[0] : new Date().toISOString().split('T')[0]
        attendanceRecordsDialogVisible.value = true
        await nextTick()
        initHeatmapChart()
        initLineChart()
      } else {
        ElMessage.error(response.message || '获取考勤记录失败')
      }
    } catch (error) {
      ElMessage.error('获取考勤记录失败：' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  const closeAttendanceRecordsDialog = () => {
    // 先直接操作DOM隐藏对话框，避免闪烁
    const dialogWrapper = document.querySelector('.attendance-records-overlay')
    if (dialogWrapper) {
      dialogWrapper.style.display = 'none'
      dialogWrapper.style.visibility = 'hidden'
      dialogWrapper.style.opacity = '0'
    }

    // 立即设置v-model为false
    attendanceRecordsDialogVisible.value = false

    
    if (heatmapInstance.value) {
      heatmapInstance.value.dispose()
      heatmapInstance.value = null
    }
    if (lineInstance.value) {
      lineInstance.value.dispose()
      lineInstance.value = null
    }
    calendarValue.value = new Date()
    allStudentAttendanceRecords.value = []
    currentStudentInfo.value = {}

    // 恢复滚动位置
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition.value)
    })
  }

  const closeHeatmapDialog = () => {
    // 先直接操作DOM隐藏对话框，避免闪烁
    const dialogWrapper = document.querySelector('.heatmap-overlay')
    if (dialogWrapper) {
      dialogWrapper.style.display = 'none'
      dialogWrapper.style.visibility = 'hidden'
      dialogWrapper.style.opacity = '0'
    }

    // 立即设置v-model为false
    heatmapDialogVisible.value = false

    // 立即销毁图表实例，不延迟
    if (heatmapInstance.value) {
      heatmapInstance.value.dispose()
      heatmapInstance.value = null
    }

    // 恢复滚动位置
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition.value)
    })
  }

  const closeTrendDialog = () => {
    // 先直接操作DOM隐藏对话框，避免闪烁
    const dialogWrapper = document.querySelector('.trend-overlay')
    if (dialogWrapper) {
      dialogWrapper.style.display = 'none'
      dialogWrapper.style.visibility = 'hidden'
      dialogWrapper.style.opacity = '0'
    }

    // 立即设置v-model为false
    trendDialogVisible.value = false

    // 立即销毁图表实例，不延迟
    if (lineInstance.value) {
      lineInstance.value.dispose()
      lineInstance.value = null
    }

    // 恢复滚动位置
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition.value)
    })
  }

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}年${month}月${day}日`
  }

  const formatCalendarTitle = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    return `${year}年${month}月`
  }

  const prevMonth = () => {
    const date = new Date(calendarValue.value)
    date.setMonth(date.getMonth() - 1)
    calendarValue.value = date
  }

  const nextMonth = () => {
    const date = new Date(calendarValue.value)
    date.setMonth(date.getMonth() + 1)
    calendarValue.value = date
  }

  const goToday = () => {
    calendarValue.value = new Date()
  }

  const getTimeSlotLabel = (timeStr) => {
    if (!timeStr) return ''
    const date = new Date(timeStr)
    const hour = date.getHours()

    if (hour >= 8 && hour < 11) return '早上'
    if (hour >= 14 && hour < 17) return '下午'
    if (hour >= 19 && hour < 22) return '晚上'
    return '其他'
  }

  const getDateAttendanceTimes = (dateStr) => {
    if (!filteredStudentAttendanceRecords.value || !dateStr) return []
    return filteredStudentAttendanceRecords.value
      .filter(record => {
        const recordDate = new Date(record.attendanceDateTime).toISOString().split('T')[0]
        return recordDate === dateStr
      })
      .map(record => record.attendanceDateTime)
      .sort()
  }

  const initHeatmapChart = () => {
    if (!heatmapChart.value) return

    if (heatmapInstance.value) {
      heatmapInstance.value.dispose()
    }

    heatmapInstance.value = echarts.init(heatmapChart.value)

    const heatmapData = generateHeatmapData()

    if (!heatmapData || !Array.isArray(heatmapData) || heatmapData.length === 0) {
      return
    }

    const maxValue = Math.max(...heatmapData.map(item => item[2]), 1)

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#ddd',
        textStyle: {
          color: '#333'
        },
        formatter: function (params) {
          if (!params || !params.data || !Array.isArray(params.data)) {
            return ''
          }
          const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          const timeSlots = ['上午', '下午', '晚上']
          return `${weekDays[params.data[0]]} ${timeSlots[params.data[1]]}<br/>签到次数: ${params.data[2]}`
        }
      },
      grid: {
        height: '70%',
        top: '10%',
        left: '8%',
        right: '8%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        splitArea: {
          show: true,
          areaStyle: {
            color: 'rgba(0,0,0,0.02)'
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: ['上午', '下午', '晚上'],
        splitArea: {
          show: true,
          areaStyle: {
            color: 'rgba(0,0,0,0.02)'
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        }
      },
      visualMap: {
        min: 0,
        max: maxValue,
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        bottom: '3%',
        itemWidth: 25,
        itemHeight: 250,
        textStyle: {
          color: '#666',
          fontSize: 12
        },
        inRange: {
          color: ['#fef3c7', '#fde68a', '#f59e0b', '#d97706', '#b45309', '#92400e']
        }
      },
      series: [{
        name: '签到次数',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
          color: '#1f2937',
          fontSize: 11,
          fontWeight: 'bold'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            borderWidth: 2,
            borderColor: '#fff'
          }
        },
        itemStyle: {
          borderRadius: 4,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)'
        }
      }]
    }

    heatmapInstance.value.setOption(option)
  }

  const initLineChart = () => {
    if (!lineChart.value) return

    if (lineInstance.value) {
      lineInstance.value.dispose()
    }

    lineInstance.value = echarts.init(lineChart.value)

    const lineData = generateLineData()

    if (!lineData || !lineData.dates || !lineData.values || lineData.dates.length === 0) {
      return
    }

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#ddd',
        textStyle: {
          color: '#333'
        },
        formatter: function (params) {
          if (!params || !params[0] || !params[0].axisValue) {
            return ''
          }
          const date = new Date(params[0].axisValue)
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
          return `${formattedDate}<br/>累计签到次数: ${params[0].value}`
        }
      },
      grid: {
        left: '8%',
        right: '8%',
        bottom: '12%',
        top: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          color: '#666',
          fontSize: 11,
          rotate: 45,
          formatter: function (value) {
            const date = new Date(value)
            return `${date.getMonth() + 1}/${date.getDate()}`
          }
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0,0,0,0.05)'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '累计签到次数',
        nameTextStyle: {
          color: '#666',
          fontSize: 12
        },
        axisLabel: {
          color: '#666',
          fontSize: 11
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.05)'
          }
        }
      },
      series: [{
        name: '累计签到次数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#4fc3f7',
          width: 3
        },
        itemStyle: {
          color: '#4fc3f7',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(79, 195, 247, 0.3)'
            }, {
              offset: 1, color: 'rgba(79, 195, 247, 0.05)'
            }]
          }
        },
        emphasis: {
          itemStyle: {
            color: '#0288d1',
            borderColor: '#fff',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(79, 195, 247, 0.5)'
          },
          lineStyle: {
            width: 4
          }
        },
        data: lineData.dates.map((date, index) => [date, lineData.values[index]])
      }]
    }

    lineInstance.value.setOption(option)
  }

  const generateHeatmapData = () => {
    const data = []
    const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    const timeSlots = ['上午', '下午', '晚上']

    const records = allStudentAttendanceRecords.value || []

    if (!records || !Array.isArray(records) || records.length === 0) {
      weekDays.forEach((day, dayIndex) => {
        timeSlots.forEach((slot, slotIndex) => {
          data.push([dayIndex, slotIndex, 0])
        })
      })
      return data
    }

    weekDays.forEach((day, dayIndex) => {
      timeSlots.forEach((slot, slotIndex) => {
        let count = 0
        records.forEach(record => {
          if (!record || !record.attendanceDateTime) return

          const date = new Date(record.attendanceDateTime)
          if (isNaN(date.getTime())) return

          const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
          const hour = date.getHours()

          if (dayOfWeek === dayIndex) {
            if (slot === '上午' && hour >= 8 && hour < 11) count++
            else if (slot === '下午' && hour >= 14 && hour < 17) count++
            else if (slot === '晚上' && hour >= 19 && hour < 22) count++
          }
        })
        data.push([dayIndex, slotIndex, count])
      })
    })

    return data
  }

  const generateLineData = () => {
    const dateMap = new Map()

    const records = allStudentAttendanceRecords.value || []

    if (!records || !Array.isArray(records) || records.length === 0) {
      return {
        dates: [],
        values: []
      }
    }

    records.forEach(record => {
      if (!record || !record.attendanceDateTime) return

      const date = new Date(record.attendanceDateTime)
      if (isNaN(date.getTime())) return

      const dateStr = date.toISOString().split('T')[0]
      dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
    })

    const sortedDates = Array.from(dateMap.keys()).sort()
    const dailyValues = sortedDates.map(date => dateMap.get(date))

    let cumulativeSum = 0
    const cumulativeValues = dailyValues.map(value => {
      cumulativeSum += value
      return cumulativeSum
    })

    return {
      dates: sortedDates,
      values: cumulativeValues
    }
  }

  const openHeatmapDialog = async (student) => {
    currentStudentInfo.value = student
    scrollPosition.value = window.pageYOffset || document.documentElement.scrollTop

    const restoreScroll = () => {
      setTimeout(() => {
        window.scrollTo(0, scrollPosition.value)
      }, 50)
    }

    try {
      isLoading.value = true
      restoreScroll()
      const response = await getStudentAttendanceRecords(student.studentId)
      if (response.code === 200) {
        allStudentAttendanceRecords.value = response.data || []
        heatmapDialogVisible.value = true

        await nextTick()
        initHeatmapChart()
      } else {
        ElMessage.error(response.message || '获取考勤记录失败')
      }
    } catch (error) {
      ElMessage.error('获取考勤记录失败：' + error.message)
    } finally {
      isLoading.value = false
      restoreScroll()
    }
  }

  const openTrendDialog = async (student) => {
    currentStudentInfo.value = student
    scrollPosition.value = window.pageYOffset || document.documentElement.scrollTop

    const restoreScroll = () => {
      setTimeout(() => {
        window.scrollTo(0, scrollPosition.value)
      }, 50)
    }

    try {
      isLoading.value = true
      restoreScroll()
      const response = await getStudentAttendanceRecords(student.studentId)
      if (response.code === 200) {
        allStudentAttendanceRecords.value = response.data || []
        trendDialogVisible.value = true

        await nextTick()
        initLineChart()
      } else {
        ElMessage.error(response.message || '获取考勤记录失败')
      }
    } catch (error) {
      ElMessage.error('获取考勤记录失败：' + error.message)
    } finally {
      isLoading.value = false
      restoreScroll()
    }
  }

  const authenticate = async () => {
    if (!specialPassword.value.trim()) {
      authError.value = '请输入特殊密码'
      return
    }

    authLoading.value = true
    authError.value = ''

    try {
      const response = await getAllStudentsWithSpecialPassword(specialPassword.value)

      if (response.code === 200) {
        adminStore.setAdminPassword(specialPassword.value)
        ElMessage.success('身份验证成功')
        isAuthenticated.value = true
        // 验证成功后加载数据
        await loadAllData(specialPassword.value)
        // 跳转到管理员控制台页面
        router.push('/admin/console')
      } else {
        authError.value = '密码错误，请重新输入'
      }
    } catch (error) {
      if (error.message === '特殊密码错误') {
        authError.value = '密码错误，请重新输入'
      } else {
        authError.value = '验证失败，请重试'
      }
    } finally {
      authLoading.value = false
    }
  }

  const logout = () => {
    adminStore.clearAdminPassword()
    isAuthenticated.value = false
    isDataLoaded.value = false
    specialPassword.value = ''
    authError.value = ''
    students.value = []
    ElMessage.success('已退出管理员模式')
  }

  const monthMap = {
    'January': '一月',
    'February': '二月',
    'March': '三月',
    'April': '四月',
    'May': '五月',
    'June': '六月',
    'July': '七月',
    'August': '八月',
    'September': '九月',
    'October': '十月',
    'November': '十一月',
    'December': '十二月'
  }

  const weekDayMap = {
    'Sun': '日',
    'Sunday': '日',
    'Mon': '一',
    'Monday': '一',
    'Tue': '二',
    'Tuesday': '二',
    'Wed': '三',
    'Wednesday': '三',
    'Thu': '四',
    'Thursday': '四',
    'Fri': '五',
    'Friday': '五',
    'Sat': '六',
    'Saturday': '六'
  }

  let monthObserver = null

  const setChineseMonth = () => {
    const popper = document.querySelector('.makeup-date-picker-popper')
    if (popper) {
      const headerLabels = popper.querySelectorAll('.el-date-picker__header-label')
      headerLabels.forEach(label => {
        const text = label.textContent.trim()
        for (const [enMonth, cnMonth] of Object.entries(monthMap)) {
          if (text.includes(enMonth)) {
            const newText = text.replace(enMonth, cnMonth)
            label.textContent = newText
            break
          }
        }
      })
    }
  }

  const setChineseWeekDays = () => {
    const popper = document.querySelector('.makeup-date-picker-popper')
    if (popper) {
      const weekDayCells = popper.querySelectorAll('.el-date-table th')
      weekDayCells.forEach((cell) => {
        const text = cell.textContent.trim()
        if (text) {
          for (const [enDay, cnDay] of Object.entries(weekDayMap)) {
            if (text === enDay || text.includes(enDay)) {
              const childNodes = Array.from(cell.childNodes)
              childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                  node.textContent = ''
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                  node.style.display = 'none'
                  node.style.fontSize = '0'
                  node.style.opacity = '0'
                  node.style.visibility = 'hidden'
                }
              })
              if (!cell.querySelector('.chinese-weekday')) {
                const cnSpan = document.createElement('span')
                cnSpan.className = 'chinese-weekday'
                cnSpan.textContent = cnDay
                cnSpan.style.cssText = 'font-size: 20px !important; font-weight: 600 !important; display: block !important; position: absolute !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; color: #606266 !important; line-height: 1 !important; width: 100% !important; text-align: center !important;'
                cell.appendChild(cnSpan)
              }
              break
            }
          }
        }
      })
    }
  }

  const openMakeupDialog = async (student) => {
    makeupSelectedStudent.value = student
    makeupForm.value.attendanceTime = ''
    makeupForm.value.selectedDate = ''
    makeupForm.value.selectedHour = null
    makeupStep.value = 'date'
    makeupDialogVisible.value = true
    await nextTick()

    setTimeout(() => {
      const datePickerInput = document.querySelector('.makeup-date-picker input')
      if (datePickerInput) {
        datePickerInput.focus()
        datePickerInput.click()
      }

      setChineseMonth()
      setChineseWeekDays()

      setTimeout(() => {
        setChineseMonth()
        setChineseWeekDays()
      }, 200)

      setTimeout(() => {
        setChineseMonth()
        setChineseWeekDays()
      }, 500)

      setTimeout(() => {
        setChineseMonth()
        setChineseWeekDays()
      }, 800)
    }, 100)

    if (monthObserver) {
      monthObserver.disconnect()
    }

    monthObserver = new MutationObserver(() => {
      setChineseMonth()
      setChineseWeekDays()
    })

    setTimeout(() => {
      const popper = document.querySelector('.makeup-date-picker-popper')
      if (popper) {
        monthObserver.observe(popper, {
          childList: true,
          subtree: true,
          characterData: true
        })
      }
    }, 200)
  }

  const cancelMakeup = () => {
    if (monthObserver) {
      monthObserver.disconnect()
      monthObserver = null
    }
    makeupDialogVisible.value = false
    makeupFormRef.value?.resetFields()
    makeupSelectedStudent.value = null
    makeupForm.value.selectedDate = ''
    makeupForm.value.selectedHour = null
    makeupStep.value = 'date'
  }

  const handleDateChange = () => {
  }

  const formatSelectedDate = () => {
    if (!makeupForm.value.selectedDate) return ''
    const date = new Date(makeupForm.value.selectedDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}年${month}月${day}日`
  }

  const confirmDateStep = async () => {
    if (!makeupFormRef.value) return
    try {
      await makeupFormRef.value.validate()
      makeupStep.value = 'hour'
      makeupForm.value.selectedHour = null
    } catch {
      return
    }
  }

  const selectDatetimeShortcut = (shortcut) => {
    // 设置日期
    const dateValue = getShortcutDate(shortcut)
    makeupForm.value.selectedDate = dateValue

    // 设置默认时间（该时间段的首个时间）
    makeupForm.value.selectedHour = shortcut.defaultHour

    // 更新补卡时间
    updateAttendanceTime()

    // 自动切换到时间选择步骤
    makeupStep.value = 'hour'
  }

  const isDatetimeShortcutSelected = (shortcut) => {
    if (!makeupForm.value.selectedDate || makeupForm.value.selectedHour === null) return false

    // 检查日期是否匹配
    const shortcutDate = getShortcutDate(shortcut)
    if (makeupForm.value.selectedDate !== shortcutDate) return false

    // 检查时间段是否匹配
    const selectedSlot = timeSlots.find(slot => slot.hours.includes(makeupForm.value.selectedHour))
    if (!selectedSlot || selectedSlot.key !== shortcut.timeSlot) return false

    return true
  }

  const selectHour = (hour) => {
    if (!validHours.includes(hour)) return
    makeupForm.value.selectedHour = hour
    updateAttendanceTime()
  }

  const isHourSelected = (hour) => {
    if (makeupForm.value.selectedHour === null) return false
    return makeupForm.value.selectedHour === hour
  }

  const updateAttendanceTime = () => {
    if (makeupForm.value.selectedDate && makeupForm.value.selectedHour !== null) {
      const dateStr = makeupForm.value.selectedDate
      const hourStr = String(makeupForm.value.selectedHour).padStart(2, '0')
      makeupForm.value.attendanceTime = `${dateStr}T${hourStr}:00:00`
    } else {
      makeupForm.value.attendanceTime = ''
    }
  }

  const validateAttendanceTime = (dateStr, hour) => {
    const selectedTime = new Date(`${dateStr}T${String(hour).padStart(2, '0')}:00:00`)
    const now = new Date()
    if (selectedTime > now) {
      ElMessage.warning('补卡时间不能晚于当前时间')
      return false
    }
    return true
  }

  const submitMakeup = async () => {
    if (makeupLoading.value) return
    if (makeupForm.value.selectedHour === null) {
      ElMessage.warning('请选择补卡时间')
      return
    }
    if (!makeupForm.value.selectedDate) {
      ElMessage.warning('请选择补卡日期')
      return
    }
    if (!validateAttendanceTime(makeupForm.value.selectedDate, makeupForm.value.selectedHour)) {
      return
    }
    updateAttendanceTime()
    if (!makeupForm.value.attendanceTime) {
      ElMessage.warning('补卡时间不完整')
      return
    }
    const adminPassword = adminStore.getAdminPassword()
    if (!adminPassword) {
      ElMessage.error('身份验证已过期，请重新登录')
      isAuthenticated.value = false
      adminStore.clearAdminPassword()
      return
    }
    makeupLoading.value = true
    try {
      const response = await makeupAttendanceWithSpecialPassword(
        adminPassword,
        makeupSelectedStudent.value.studentId,
        makeupForm.value.attendanceTime
      )
      if (response.code === 200) {
        ElMessage.success('补卡成功')
        cancelMakeup()
        await loadStudentAttendanceCounts()
      } else {
        ElMessage.error(response.message || '补卡失败')
      }
    } catch (error) {
      ElMessage.error(error.message || '补卡失败')
    } finally {
      makeupLoading.value = false
    }
  }

  const openPointsDialog = (student) => {
    if (!student || !student.id) {
      ElMessage.warning('学生信息不完整，无法修改积分')
      return
    }

    // 恢复遮罩层样式，确保可以正常显示
    const dialogWrapper = document.querySelector('.points-dialog-overlay')
    if (dialogWrapper) {
      dialogWrapper.style.display = ''      // 清空内联样式
      dialogWrapper.style.visibility = ''   // 清空内联样式
      dialogWrapper.style.opacity = ''      // 清空内联样式
    }

    pointsSelectedStudent.value = student
    pointsForm.value = {
      changePoints: null,
      adjustReason: ''
    }
    pointsDialogVisible.value = true
  }

  const handlePointsDialogClose = () => {
    // 先直接操作DOM隐藏遮罩层，避免闪烁
    const dialogWrapper = document.querySelector('.points-dialog-overlay')
    if (dialogWrapper) {
      dialogWrapper.style.display = 'none'
      dialogWrapper.style.visibility = 'hidden'
      dialogWrapper.style.opacity = '0'
    }

    // 延迟清空数据，确保弹窗完全关闭后再清空
    setTimeout(() => {
      pointsFormRef.value?.resetFields()
      pointsSelectedStudent.value = null
      pointsForm.value = {
        changePoints: null,
        adjustReason: ''
      }
    }, 0)
  }

  const cancelPoints = () => {
    pointsDialogVisible.value = false
  }

  const confirmPoints = async () => {
    if (!pointsFormRef.value) return

    try {
      await pointsFormRef.value.validate()

      const adminPassword = adminStore.getAdminPassword()
      if (!adminPassword) {
        ElMessage.error('身份验证已过期，请重新登录')
        isAuthenticated.value = false
        adminStore.clearAdminPassword()
        return
      }

      if (!pointsSelectedStudent.value || !pointsSelectedStudent.value.id) {
        ElMessage.error('学生信息不完整')
        return
      }

      pointsLoading.value = true

      const response = await createPointsRecord(
        adminPassword,
        pointsForm.value.adjustReason.trim(),
        parseInt(pointsForm.value.changePoints),
        pointsSelectedStudent.value.id
      )

      if (response.code === 200) {
        ElMessage.success('积分记录创建成功')
        pointsDialogVisible.value = false
        // 数据清空由 handlePointsDialogClose 处理
      } else {
        ElMessage.error(response.message || '积分记录创建失败')
      }
    } catch (error) {
      if (error.message) {
        ElMessage.error(error.message)
      }
    } finally {
      pointsLoading.value = false
    }
  }

  const openScoreChangeRecordsDialog = async (student) => {
    if (!student || !student.id) {
      ElMessage.warning('学生信息不完整，无法查看改分记录')
      return
    }

    currentScoreChangeRecordsStudent.value = student
    scoreChangeRecordsDialogVisible.value = true
    scoreChangeRecordsLoading.value = true
    scoreChangeRecords.value = []

    try {
      const response = await getAllAdjustRecordsByStudentInfoId(student.id)
      if (response.code === 200 && Array.isArray(response.data)) {
        scoreChangeRecords.value = response.data
      } else {
        scoreChangeRecords.value = []
      }
    } catch (error) {
      console.error('获取改分记录失败:', error)
      ElMessage.error('获取改分记录失败：' + (error.message || '未知错误'))
      scoreChangeRecords.value = []
    } finally {
      scoreChangeRecordsLoading.value = false
    }
  }

  const closeScoreChangeRecordsDialog = () => {
    scoreChangeRecordsDialogVisible.value = false
    currentScoreChangeRecordsStudent.value = null
    scoreChangeRecords.value = []
  }

  const sortedScoreChangeRecords = computed(() => {
    return [...scoreChangeRecords.value].sort((a, b) => {
      const timeA = new Date(a.createTime).getTime()
      const timeB = new Date(b.createTime).getTime()
      return timeB - timeA // 最新的在前
    })
  })

  const totalScoreChangePoints = computed(() => {
    return scoreChangeRecords.value.reduce((sum, r) => sum + r.adjustPoints, 0)
  })

  const formatTime = (timeString) => {
    if (!timeString) return '--'
    try {
      const date = new Date(timeString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    } catch (error) {
      return timeString
    }
  }

  const loadAllData = async (adminPassword) => {
    const totalSteps = 7

    const updateProgress = (step, status) => {
      loadingProgress.value = (step / totalSteps) * 100
      loadingStatus.value = status
    }

    try {
      updateProgress(1, '正在获取学生数据...')
      const response = await getAllStudentsWithSpecialPassword(adminPassword)
      if (response.code !== 200) {
        ElMessage.error('身份验证失败，请重新登录')
        isAuthenticated.value = false
        adminStore.clearAdminPassword()
        return
      }

      students.value = response.data
      totalStudents.value = response.data.length

      updateProgress(2, '正在加载统计数据...')
      await loadStatistics()

      updateProgress(3, '正在加载学生等级...')
      await loadStudentLevels()

      updateProgress(4, '正在加载考勤数据...')
      await loadStudentAttendanceCounts()

      updateProgress(5, '正在加载积分信息...')
      await loadStudentPoints()

      updateProgress(6, '正在加载管理员信息...')
      await loadStudentAdmins()

      updateProgress(6, '正在加载学生头像...')
      await loadStudentAvatars()

      updateProgress(7, '数据加载完成！')

      setTimeout(() => {
        isDataLoaded.value = true
      }, 500)

    } catch (error) {
      ElMessage.error('加载数据失败：' + error.message)
      isAuthenticated.value = false
      adminStore.clearAdminPassword()
    }
  }

  onMounted(async () => {
    document.title = '超级管理员控制台 - AI坊学生管理系统'

    const adminPassword = adminStore.getAdminPassword()
    if (adminPassword) {
      // 如果已有密码，直接验证并加载数据
      isAuthenticated.value = true
      try {
        await loadAllData(adminPassword)
      } catch (error) {
        ElMessage.error('加载数据失败：' + error.message)
        isAuthenticated.value = false
        adminStore.clearAdminPassword()
      }
    } else {
      // 没有密码，显示身份验证界面
      isAuthenticated.value = false
    }
  })

  watch(calendarValue, async () => {
    if (attendanceRecordsDialogVisible.value && !isLoading.value) {
      await nextTick()
      initHeatmapChart()
      initLineChart()
    }
  })

  // 返回所有需要导出的变量和函数
  return {
    // 响应式数据
    isAuthenticated,
    specialPassword,
    authError,
    authLoading,
    isLoading,
    isDataLoaded,
    loadingProgress,
    loadingStatus,
    students,
    searchKeyword,
    currentPage,
    pageSize,
    totalStudents,
    todayCount,
    monthlyCount,
    studentLevels,
    studentAttendanceCounts,
    studentAdmins,
    studentPoints,
    activeLevelTab,
    editDialogVisible,
    editFormRef,
    editForm,
    currentEditStudentId,
    todayAttendanceDialogVisible,
    todayAttendanceRecords,
    attendanceRecordsDialogVisible,
    currentStudentInfo,
    calendarValue,
    scrollPosition,
    allStudentAttendanceRecords,
    calendarSlots,
    filteredStudentAttendanceRecords,
    heatmapDialogVisible,
    trendDialogVisible,
    heatmapChart,
    lineChart,
    heatmapInstance,
    lineInstance,
    showDateDetailsDialog,
    selectedDate,
    makeupDialogVisible,
    makeupLoading,
    makeupSelectedStudent,
    makeupStep,
    makeupFormRef,
    datePickerRef,
    makeupForm,
    pointsDialogVisible,
    pointsLoading,
    pointsSelectedStudent,
    pointsFormRef,
    pointsForm,
    scoreChangeRecordsDialogVisible,
    scoreChangeRecordsLoading,
    scoreChangeRecords,
    currentScoreChangeRecordsStudent,
    datetimeShortcuts,
    levelOptions,
    adminOptions,
    filteredStudents,
    currentLevelStudents,
    editFormRules,
    pointsFormRules,
    makeupDateFormRules,
    
    // 函数
    getLevelStudents,
    changeLevel,
    changeAdmin,
    loadStudentLevels,
    loadStudentAttendanceCounts,
    loadStudentPoints,
    loadStudentAdmins,
    loadStudentAvatars,
    handleAvatarError,
    loadStatistics,
    refreshData,
    openEditDialog,
    cancelEdit,
    confirmEdit,
    showTodayAttendance,
    formatAttendanceTime,
    getTimePeriodClass,
    getTimePeriodName,
    isSlotSigned,
    openDateDetails,
    openAttendanceRecordsDialog,
    closeAttendanceRecordsDialog,
    closeHeatmapDialog,
    closeTrendDialog,
    formatDateForDisplay,
    formatCalendarTitle,
    prevMonth,
    nextMonth,
    goToday,
    getTimeSlotLabel,
    getDateAttendanceTimes,
    initHeatmapChart,
    initLineChart,
    generateHeatmapData,
    generateLineData,
    openHeatmapDialog,
    openTrendDialog,
    authenticate,
    logout,
    getShortcutDate,
    setChineseMonth,
    setChineseWeekDays,
    openMakeupDialog,
    cancelMakeup,
    handleDateChange,
    formatSelectedDate,
    confirmDateStep,
    selectDatetimeShortcut,
    isDatetimeShortcutSelected,
    selectHour,
    isHourSelected,
    updateAttendanceTime,
    validateAttendanceTime,
    submitMakeup,
    openPointsDialog,
    handlePointsDialogClose,
    cancelPoints,
    confirmPoints,
    openScoreChangeRecordsDialog,
    closeScoreChangeRecordsDialog,
    formatTime,
    loadAllData,
    
    // 常量
    timeSlots,
    validHours,
    sortedScoreChangeRecords,
    totalScoreChangePoints,
    toggleTheme
  }
}