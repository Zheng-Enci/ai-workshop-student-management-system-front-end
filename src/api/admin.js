import axios from 'axios'

const api = axios.create({
  baseURL: 'http://10.0.48.241:7001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

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

export const setStudentLevel = async (specialPassword, studentId, levelCode) => {
  try {
    const response = await api.post('/api/v1/students/set-level', {
      studentId: studentId,
      levelCode: levelCode
    }, {
      params: { 'special-password': specialPassword }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 400) {
        throw new Error(error.response.data?.message || '设置学生等级失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '设置学生等级失败')
      }
    } else {
      throw new Error('网络错误，设置学生等级失败')
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
      if (status === 400) {
        throw new Error(error.response.data?.message || '获取学生等级失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取学生等级失败')
      }
    } else {
      throw new Error('网络错误，获取学生等级失败')
    }
  }
}

export const updateStudentWithSpecialPassword = async (specialPassword, studentId, studentData) => {
  try {
    const response = await api.put('/api/v1/students/update-with-special-password', studentData, {
      params: { 
        'special-password': specialPassword,
        'student-id': studentId
      }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 400) {
        throw new Error(error.response.data?.message || '更新学生信息失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '更新学生信息失败')
      }
    } else {
      throw new Error('网络错误，更新学生信息失败')
    }
  }
}

export const getStudentAttendanceCount = async (studentId) => {
  try {
    const response = await api.get('/api/v1/attendance/attendance-count-by-student-id', {
      params: { studentId }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 400) {
        throw new Error(error.response.data?.message || '获取学生签到次数失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取学生签到次数失败')
      }
    } else {
      throw new Error('网络错误，获取学生签到次数失败')
    }
  }
}

export const getAdminInfo = async (managedStudentId) => {
  try {
    const response = await api.get('/api/v1/students/admin-info', {
      params: { 'managed-student-id': managedStudentId }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 400) {
        throw new Error(error.response.data?.message || '获取管理员信息失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取管理员信息失败')
      }
    } else {
      throw new Error('网络错误，获取管理员信息失败')
    }
  }
}

export const assignStudentToAdmin = async (specialPassword, studentId, adminStudentId) => {
  try {
    const response = await api.post('/api/v1/students/assign-student-to-admin', {
      studentId: studentId,
      adminStudentId: adminStudentId
    }, {
      params: { 'special-password': specialPassword }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 400) {
        throw new Error(error.response.data?.message || '分配管理员失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '分配管理员失败')
      }
    } else {
      throw new Error('网络错误，分配管理员失败')
    }
  }
}

export const getManagedStudents = async (adminStudentId) => {
  try {
    const response = await api.get('/api/v1/students/managed-students', {
      params: { 'admin-student-id': adminStudentId }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 400) {
        throw new Error(error.response.data?.message || '获取管理学生信息失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取管理学生信息失败')
      }
    } else {
      throw new Error('网络错误，获取管理学生信息失败')
    }
  }
}

export const makeupAttendance = async (token, studentId, attendanceTime) => {
  try {
    const response = await api.post('/api/v1/attendance/makeup', {
      studentId: studentId,
      attendanceTime: attendanceTime
    }, {
      params: { token }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        throw new Error('Token无效，请重新登录')
      } else if (status === 400) {
        throw new Error(error.response.data?.message || '补卡失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '补卡失败')
      }
    } else {
      throw new Error('网络错误，补卡失败')
    }
  }
}

export default api
