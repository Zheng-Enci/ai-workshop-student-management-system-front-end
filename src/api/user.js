import axios from 'axios'

const api = axios.create({
  baseURL: 'http://10.0.48.241:7001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

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
      if (status === 400) {
        throw new Error('注册信息格式错误')
      } else if (status === 409) {
        throw new Error('学号已存在')
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
    const response = await api.post('/api/v1/attendance', null, {
      params: { token },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
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

export default api