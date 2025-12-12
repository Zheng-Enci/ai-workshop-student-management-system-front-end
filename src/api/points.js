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

export const createPointsRecord = async (specialPassword, adjustReason, changePoints, targetStudentInfoId) => {
  try {
    const response = await api.post('/api/v1/points', {
      adjustReason: adjustReason,
      changePoints: changePoints,
      targetStudentInfoId: targetStudentInfoId
    }, {
      headers: {
        'X-Special-Password': specialPassword
      }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 400) {
        throw new Error(error.response.data?.message || '积分记录创建失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '积分记录创建失败')
      }
    } else {
      throw new Error('网络错误，积分记录创建失败')
    }
  }
}

export const getPointsTopRanking = async (top = 50) => {
  try {
    const response = await api.get('/api/v1/points/top-ranking', {
      params: { top }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 400) {
        throw new Error(error.response.data?.message || '获取活动积分排名失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取活动积分排名失败')
      }
    } else {
      throw new Error('网络错误，获取活动积分排名失败')
    }
  }
}

export const getTopAdjustRecordsByStudentInfoId = async (studentInfoId, top = 3) => {
  try {
    const response = await api.get('/api/v1/points/top-n-adjust-reason-and-points-and-create-time-records-by-student-info-id-order-by-adjust-points-desc', {
      params: {
        'target-student-info-id': studentInfoId,
        top
      }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const status = error.response.status
      if (status === 400) {
        throw new Error(error.response.data?.message || '获取积分记录失败')
      } else if (status >= 500) {
        throw new Error('服务器错误，请稍后重试')
      } else {
        throw new Error(error.response.data?.message || '获取积分记录失败')
      }
    } else {
      throw new Error('网络错误，获取积分记录失败')
    }
  }
}

