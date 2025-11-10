import axios from 'axios'
import config from '@/config'

const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络连接')
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('网络连接失败，请检查服务器状态')
    } else if (error.code === 'ERR_INTERNET_DISCONNECTED') {
      throw new Error('网络连接已断开，请检查网络设置')
    }
    return Promise.reject(error)
  }
)

export const login = async (data) => {
  try {
    const response = await api.post('/api/v1/students/login', data)
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        throw new Error('学号或密码错误')
      } else if (status === 403) {
        throw new Error('账户已被禁用')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '登录失败')
      }
    } else {
      throw new Error('网络错误，登录失败')
    }
  }
}

export const register = async (data) => {
  try {
    const response = await api.post('/api/v1/students', data)
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 400 || status === 409) {
        throw new Error(error.response.data?.message || '注册失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '注册失败')
      }
    } else {
      throw new Error('网络错误，注册失败')
    }
  }
}

export const signIn = async (token) => {
  try {
    const response = await api.post('/api/v1/attendance', {}, {
      params: { token },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 403) {
        throw new Error('Token已过期或无效，请重新登录')
      } else if (status === 401) {
        throw new Error('未授权访问，请重新登录')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else if (status === 400) {
        return error.response.data
      } else {
        throw new Error(error.response.data?.message || '签到失败')
      }
    } else {
      throw new Error('网络错误，签到失败')
    }
  }
}

export const validateToken = async (token) => {
  try {
    const response = await api.post('/api/v1/students/validation-token', null, {
      params: { token },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response.data.data || false
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 403) {
        return false // Token已过期或无效
      } else if (status === 401) {
        return false // 未授权访问
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        return false // 其他错误也返回false
      }
    } else {
      throw new Error('网络错误，Token验证失败')
    }
  }
}

export const getGradeStatistics = async () => {
  try {
    const response = await api.get('/api/v1/students/grade-statistics')
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取年级统计失败')
      }
    } else {
      throw new Error('网络错误，获取年级统计失败')
    }
  }
}

export const getMajorStatistics = async () => {
  try {
    const response = await api.get('/api/v1/students/major-statistics')
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取专业统计失败')
      }
    } else {
      throw new Error('网络错误，获取专业统计失败')
    }
  }
}

export const getTotalStudentCount = async () => {
  try {
    const response = await api.get('/api/v1/students/total-count')
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取学生总数失败')
      }
    } else {
      throw new Error('网络错误，获取学生总数失败')
    }
  }
}

export const getTopStudents = async () => {
  try {
    const response = await api.get('/api/v1/attendance/top-students')
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取优秀学生统计失败')
      }
    } else {
      throw new Error('网络错误，获取优秀学生统计失败')
    }
  }
}

export const getMonthlyAttendanceCount = async () => {
  try {
    const response = await api.get('/api/v1/attendance/monthly-count')
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取月度考勤统计失败')
      }
    } else {
      throw new Error('网络错误，获取月度考勤统计失败')
    }
  }
}

export const getDailyAttendanceCount = async () => {
  try {
    const response = await api.get('/api/v1/attendance/daily-count')
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取日度考勤统计失败')
      }
    } else {
      throw new Error('网络错误，获取日度考勤统计失败')
    }
  }
}

export const getStudentProfile = async (token) => {
  try {
    const response = await api.get('/api/v1/students/profile', {
      params: { token }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        throw new Error('Token无效，请重新登录')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取个人信息失败')
      }
    } else {
      throw new Error('网络错误，获取个人信息失败')
    }
  }
}

export const updateStudentInfo = async (token, data) => {
  try {
    const response = await api.put('/api/v1/students/update-info', data, {
      params: { token }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        throw new Error('Token无效，请重新登录')
      } else if (status === 400) {
        throw new Error('参数验证失败，请检查输入信息')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '更新个人信息失败')
      }
    } else {
      throw new Error('网络错误，更新个人信息失败')
    }
  }
}

export const changePassword = async (token, data) => {
  try {
    const response = await api.post('/api/v1/students/change-password', data, {
      params: { token }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        throw new Error('Token无效，请重新登录')
      } else if (status === 400) {
        throw new Error('原密码错误或参数验证失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '修改密码失败')
      }
    } else {
      throw new Error('网络错误，修改密码失败')
    }
  }
}

export const getMyAttendanceCount = async (token) => {
  try {
    const response = await api.get('/api/v1/attendance/my-attendance-count', {
      params: { token }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        throw new Error('Token无效，请重新登录')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取个人签到次数失败')
      }
    } else {
      throw new Error('网络错误，获取个人签到次数失败')
    }
  }
}

export const getStudentLevel = async (studentId) => {
  try {
    const response = await api.get('/api/v1/students/get-student-level', {
      params: { 'student-id': studentId }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取学生等级失败')
      }
    } else {
      throw new Error('网络错误，获取学生等级失败')
    }
  }
}

export const getTodayAttendanceRecords = async () => {
  try {
    const response = await api.get('/api/v1/attendance/today-records')
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取今日签到记录失败')
      }
    } else {
      throw new Error('网络错误，获取今日签到记录失败')
    }
  }
}

export const getAllStudentsWithSpecialPassword = async (specialPassword) => {
  try {
    const response = await api.get('/api/v1/students/all-with-special-password', {
      params: { 'special-password': specialPassword }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 400) {
        throw new Error('特殊密码错误')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取学生信息失败')
      }
    } else {
      throw new Error('网络错误，获取学生信息失败')
    }
  }
}

export const getMyAttendanceRecords = async () => {
  try {
    const response = await api.get('/api/v1/attendance/student-records', {
      params: { studentId: JSON.parse(localStorage.getItem('userInfo') || '{}').studentId }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        throw new Error('Token无效，请重新登录')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取个人考勤记录失败')
      }
    } else {
      throw new Error('网络错误，获取个人考勤记录失败')
    }
  }
}

export const getCurrentMonthTop10Students = async () => {
  try {
    const response = await api.get('/api/v1/attendance/current-month-top10-students')
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取本月签到前十名失败')
      }
    } else {
      throw new Error('网络错误，获取本月签到前十名失败')
    }
  }
}

export const getTopStudentsByTimeRange = async (startTime, endTime, topN) => {
  try {
    const response = await api.get('/api/v1/attendance/get-top-students-by-attendance-count-in-time-range', {
      params: { startTime, endTime, topN }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取签到排行失败')
      }
    } else {
      throw new Error('网络错误，获取签到排行失败')
    }
  }
}

export const getDailyRanking = async (date, topN = 10) => {
  const startTime = `${date}T00:00:00`
  const endTime = `${date}T23:59:59`
  return getTopStudentsByTimeRange(startTime, endTime, topN)
}

export const getWeeklyRanking = async (weekStart, topN = 10) => {
  const startTime = `${weekStart}T00:00:00`
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const endTime = `${weekEnd.toISOString().split('T')[0]}T23:59:59`
  return getTopStudentsByTimeRange(startTime, endTime, topN)
}

export const getMonthlyRanking = async (year, month, topN = 10) => {
  const startTime = `${year}-${month.toString().padStart(2, '0')}-01T00:00:00`
  const lastDay = new Date(year, month, 0).getDate()
  const endTime = `${year}-${month.toString().padStart(2, '0')}-${lastDay}T23:59:59`
  return getTopStudentsByTimeRange(startTime, endTime, topN)
}

export const getQuarterlyRanking = async (year, quarter, topN = 10) => {
  const quarterMonths = {
    1: [1, 2, 3],
    2: [4, 5, 6],
    3: [7, 8, 9],
    4: [10, 11, 12]
  }
  
  const startMonth = quarterMonths[quarter][0]
  const endMonth = quarterMonths[quarter][2]
  
  const startTime = `${year}-${startMonth.toString().padStart(2, '0')}-01T00:00:00`
  const lastDay = new Date(year, endMonth, 0).getDate()
  const endTime = `${year}-${endMonth.toString().padStart(2, '0')}-${lastDay}T23:59:59`
  
  return getTopStudentsByTimeRange(startTime, endTime, topN)
}

export const getSemesterRanking = async (year, semester, topN = 10) => {
  const semesterRanges = {
    1: { start: `${year}-02-01`, end: `${year}-07-31` },
    2: { start: `${year}-09-01`, end: `${year}-12-31` }
  }
  
  const range = semesterRanges[semester]
  const startTime = `${range.start}T00:00:00`
  const endTime = `${range.end}T23:59:59`
  
  return getTopStudentsByTimeRange(startTime, endTime, topN)
}

export const getYearlyRanking = async (year, topN = 10) => {
  const startTime = `${year}-01-01T00:00:00`
  const endTime = `${year}-12-31T23:59:59`
  return getTopStudentsByTimeRange(startTime, endTime, topN)
}

export const getLast7DaysRanking = async (topN = 10) => {
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000)
  
  const startTime = startDate.toISOString().split('T')[0] + 'T00:00:00'
  const endTime = endDate.toISOString().split('T')[0] + 'T23:59:59'
  
  return getTopStudentsByTimeRange(startTime, endTime, topN)
}

export const getLast30DaysRanking = async (topN = 10) => {
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - 29 * 24 * 60 * 60 * 1000)
  
  const startTime = startDate.toISOString().split('T')[0] + 'T00:00:00'
  const endTime = endDate.toISOString().split('T')[0] + 'T23:59:59'
  
  return getTopStudentsByTimeRange(startTime, endTime, topN)
}

export const getCustomRangeRanking = async (startDate, endDate, topN = 10) => {
  const startTime = `${startDate}T00:00:00`
  const endTime = `${endDate}T23:59:59`
  return getTopStudentsByTimeRange(startTime, endTime, topN)
}

export const getDailyAttendanceCountInRange = async (startTime, endTime) => {
  try {
    const PROJECT_LAUNCH_DATE = new Date('2024-09-09T00:00:00')
    const startDate = new Date(startTime)
    const endDate = new Date(endTime)
    
    const actualStartDate = startDate < PROJECT_LAUNCH_DATE ? PROJECT_LAUNCH_DATE : startDate
    const daysDiff = Math.ceil((endDate - actualStartDate) / (1000 * 60 * 60 * 24)) + 1
    const result = []
    
    for (let i = 0; i < daysDiff; i++) {
      const currentDate = new Date(actualStartDate)
      currentDate.setDate(actualStartDate.getDate() + i)
      const dateStr = currentDate.toISOString().split('T')[0]
      
      try {
        const response = await api.get('/api/v1/attendance/daily-count', {
          params: {
            date: dateStr
          }
        })
        
        if (response.data && response.data.code === 200) {
          result.push({
            date: dateStr,
            attendanceCount: response.data.data?.count || 0
          })
        } else {
          result.push({
            date: dateStr,
            attendanceCount: 0
          })
        }
      } catch (error) {
        result.push({
          date: dateStr,
          attendanceCount: 0
        })
      }
    }
    
    return {
      code: 200,
      message: '获取成功',
      data: result
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 400) {
        throw new Error('时间参数错误')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取签到数据失败')
      }
    } else {
      throw new Error('网络错误，获取签到数据失败')
    }
  }
}

export const getStudentCountByLevel = async (levelCode) => {
  try {
    const response = await api.get('/api/v1/students/student-count-by-level-code', {
      params: {
        'level-code': levelCode
      }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取等级学生数量失败')
      }
    } else {
      throw new Error('网络错误，获取等级学生数量失败')
    }
  }
}