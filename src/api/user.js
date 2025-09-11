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
    return response.data.data
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
        throw new Error(error.response.data?.message || 'Token验证失败')
      }
    } else {
      throw new Error('网络错误，Token验证失败')
    }
  }
}

export default api