<template>
  <div class="admin-mobile-container">
    <div v-if="!isAuthenticated" class="auth-section-mobile">
      <div class="auth-page-header-mobile">
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="auth-logo-mobile" @click="toggleTheme" title="切换主题模式">
      </div>
      <div class="auth-card-mobile">
        <div class="auth-header-mobile">
          <div class="auth-icon-container-mobile">
            <el-icon class="auth-icon-mobile"><Key /></el-icon>
            <div class="icon-ring-mobile"></div>
          </div>
          <h2>身份验证</h2>
          <p>请输入特殊密码以访问管理员功能</p>
          <div class="auth-status-indicator-mobile">
            <div class="status-icon-mobile">
              <div class="status-dot-mobile"></div>
              <div class="status-pulse-mobile"></div>
            </div>
            <span class="status-text-mobile">等待验证</span>
            <div class="status-animation-mobile">
              <div class="loading-dots-mobile">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="auth-form-mobile">
          <div class="input-container-mobile">
            <el-input
              v-model="specialPassword"
              type="password"
              placeholder="请输入特殊密码"
              show-password
              size="large"
              @keyup.enter="authenticate"
              class="password-input-mobile"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </div>
          <el-button 
            type="primary" 
            size="large" 
            @click="authenticate"
            :loading="authLoading"
            class="auth-button-mobile"
          >
            <span>验证身份</span>
          </el-button>
        </div>
        <div v-if="authError" class="error-message-mobile">
          <el-icon><Warning /></el-icon>
          {{ authError }}
        </div>
      </div>
    </div>

    <div v-else-if="!isDataLoaded" class="admin-loading-mobile">
      <div class="loading-page-header-mobile">
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="loading-logo-mobile" @click="toggleTheme" title="切换主题模式">
      </div>
      <div class="loading-container-mobile">
        <div class="loading-spinner-mobile">
          <div class="spinner-ring-mobile"></div>
          <div class="spinner-ring-mobile"></div>
          <div class="spinner-ring-mobile"></div>
        </div>
        <div class="loading-text-mobile">数据加载中，请稍候...</div>
        <div class="loading-progress-mobile">
          <div class="progress-bar-mobile" :style="{ width: loadingProgress + '%' }"></div>
        </div>
        <div class="loading-status-mobile">{{ loadingStatus }}</div>
      </div>
    </div>
    
    <div v-else class="admin-console-mobile">
      <div class="admin-header-mobile">
        <div class="header-content-mobile">
          <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo-mobile" @click="toggleTheme" title="切换主题模式">
          <div class="title-section-mobile">
            <h1>超级管理员</h1>
            <p>Super Admin</p>
          </div>
        </div>
        <el-button @click="logout" type="danger" size="small" class="logout-btn-mobile">
          <el-icon><SwitchButton /></el-icon>
        </el-button>
      </div>
      
      <div class="admin-stats-mobile">
        <div class="stat-card-mobile">
          <div class="stat-icon-mobile">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-content-mobile">
            <div class="stat-value-mobile">{{ totalStudents }}</div>
            <div class="stat-label-mobile">学生总数</div>
          </div>
        </div>
        <div class="stat-card-mobile" @click="showTodayAttendance" style="cursor: pointer;">
          <div class="stat-icon-mobile">
            <el-icon><Calendar /></el-icon>
          </div>
          <div class="stat-content-mobile">
            <div class="stat-value-mobile">{{ todayCount }}</div>
            <div class="stat-label-mobile">今日签到</div>
          </div>
        </div>
        <div class="stat-card-mobile">
          <div class="stat-icon-mobile">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-content-mobile">
            <div class="stat-value-mobile">{{ monthlyCount }}</div>
            <div class="stat-label-mobile">本月签到</div>
          </div>
        </div>
      </div>

      <div class="students-section-mobile">
        <div class="section-header-mobile">
          <h2>学生信息管理</h2>
          <div class="header-actions-mobile">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索学生"
              clearable
              class="search-input-mobile"
              size="default"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button @click="refreshData" :loading="isLoading" type="primary" size="small">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </div>
        </div>
        
        <div class="level-tabs-mobile">
          <div class="level-buttons-container-mobile">
            <el-button
              v-for="level in levelOptions"
              :key="level.value"
              :type="activeLevelTab === level.value.toString() ? 'primary' : 'default'"
              :class="['level-button-mobile', { 'is-active': activeLevelTab === level.value.toString() }]"
              @click="activeLevelTab = level.value.toString()"
              class="level-btn-mobile"
            >
              <span class="button-label-mobile">{{ level.label }}</span>
              <span class="button-count-mobile">({{ getLevelStudents(level.value).length }})</span>
            </el-button>
          </div>
        </div>

        <div class="students-list-mobile">
          <div class="student-item-mobile" v-for="student in paginatedStudents" :key="student.studentId">
            <div class="student-main-info-mobile">
              <div class="student-avatar-mobile" :class="{ 'has-avatar': student.hasAvatar && student.avatarUrl, 'no-avatar': !student.hasAvatar || !student.avatarUrl }">
                <img v-if="student.hasAvatar && student.avatarUrl" :src="student.avatarUrl" alt="头像" class="avatar-image-mobile" @error="handleAvatarError(student)" />
                <span v-else class="avatar-text-mobile">{{ student.name.charAt(0) }}</span>
              </div>
              <div class="student-primary-info-mobile">
                <div class="student-name-mobile">{{ student.name }}</div>
                <div class="student-id-mobile">{{ student.studentId }}</div>
                <div class="student-details-mobile">
                  <span>{{ student.grade }}年级</span>
                  <span>{{ student.major }}</span>
                  <span>{{ student.classNum }}班</span>
                </div>
              </div>
              <div class="attendance-count-mobile">
                <el-icon class="attendance-icon-mobile"><Calendar /></el-icon>
                <span class="count-text-mobile">{{ studentAttendanceCounts[student.studentId] || 0 }}次</span>
              </div>
            </div>
            
            <div class="student-actions-mobile">
              <el-button 
                type="success" 
                size="small" 
                @click="openAttendanceRecordsDialog(student)"
                class="action-btn-mobile"
              >
                <el-icon><Calendar /></el-icon>
                考勤
              </el-button>
              <el-button 
                type="warning" 
                size="small" 
                @click="openMakeupDialog(student)"
                class="action-btn-mobile"
              >
                <el-icon><Clock /></el-icon>
                补卡
              </el-button>
              <el-button 
                type="primary" 
                size="small" 
                @click="openEditDialog(student)"
                class="action-btn-mobile"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
            </div>
            
            <div class="student-management-mobile">
              <div class="level-management-mobile">
                <span class="management-label-mobile">等级：</span>
                <el-select
                  :model-value="studentLevels[student.studentId] || 0"
                  @change="(value) => changeLevel(student.studentId, value)"
                  size="small"
                  class="level-select-mobile"
                >
                  <el-option
                    v-for="option in levelOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  >
                    <el-tag
                      :type="option.color"
                      size="small"
                      style="width: 100%; text-align: center;"
                    >
                      {{ option.label }}
                    </el-tag>
                  </el-option>
                </el-select>
              </div>
              <div class="admin-management-mobile" v-if="(studentLevels[student.studentId] || 0) !== 3">
                <span class="management-label-mobile">管理员：</span>
                <el-select
                  v-if="adminOptions.length > 0"
                  :model-value="studentAdmins[student.studentId]?.adminStudentId || ''"
                  @change="(value) => changeAdmin(student.studentId, value)"
                  size="small"
                  class="admin-select-mobile"
                  placeholder="分配管理员"
                  clearable
                >
                  <el-option
                    v-for="option in adminOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <span v-else class="no-admin-mobile">暂无可用的管理员</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination-mobile" v-if="currentLevelStudents.length > pageSize">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            :total="currentLevelStudents.length"
            layout="prev, pager, next"
            small
            class="pagination-component-mobile"
          />
        </div>
      </div>
    </div>

    <el-dialog
      v-if="editDialogVisible"
      v-model="editDialogVisible"
      title="修改学生信息"
      width="90%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :teleported="true"
      class="edit-dialog-mobile"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
        class="edit-form-mobile"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="editForm.studentId" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="editForm.gender" placeholder="请选择性别" style="width: 100%">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="editForm.phoneNumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-input v-model="editForm.college" placeholder="请输入学院" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="editForm.major" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="editForm.grade" placeholder="请选择年级" style="width: 100%">
            <el-option label="1年级" :value="1" />
            <el-option label="2年级" :value="2" />
            <el-option label="3年级" :value="3" />
            <el-option label="4年级" :value="4" />
            <el-option label="5年级" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="classNum">
          <el-input-number
            v-model="editForm.classNum"
            :min="1"
            :max="100"
            placeholder="请输入班级"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="editForm.password"
            type="password"
            placeholder="请输入新密码（6-16位）"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer-mobile">
          <el-button @click="cancelEdit" :disabled="isLoading">取消</el-button>
          <el-button type="primary" @click="confirmEdit" :loading="isLoading">
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-if="todayAttendanceDialogVisible"
      v-model="todayAttendanceDialogVisible"
      title="今日签到记录"
      width="90%"
      :close-on-click-modal="false"
      :append-to-body="true"
      :teleported="true"
      class="today-attendance-dialog-mobile"
    >
      <div class="attendance-records-container-mobile">
        <div v-if="todayAttendanceRecords.length === 0" class="no-records-mobile">
          <el-icon class="no-records-icon-mobile"><Calendar /></el-icon>
          <p>今日暂无签到记录</p>
        </div>
        <div v-else class="records-list-mobile">
          <div 
            v-for="(record, index) in todayAttendanceRecords" 
            :key="index"
            class="attendance-record-item-mobile"
            :class="getTimePeriodClass(record.attendanceTime)"
          >
            <div class="time-period-indicator-mobile" :class="getTimePeriodClass(record.attendanceTime)">
              <div class="indicator-dot-mobile"></div>
              <span class="period-text-mobile">{{ getTimePeriodName(record.attendanceTime) }}</span>
            </div>
            <div class="record-content-mobile">
              <div class="student-avatar-mobile-record">
                {{ record.name.charAt(0) }}
              </div>
              <div class="student-details-mobile-record">
                <div class="student-name-mobile-record">{{ record.name }}</div>
                <div class="student-id-mobile-record">{{ record.scheduleId }}</div>
              </div>
              <div class="attendance-time-mobile">
                <el-icon class="time-icon-mobile"><Clock /></el-icon>
                <span class="time-text-mobile">{{ formatAttendanceTime(record.attendanceTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer-mobile">
          <el-button @click="todayAttendanceDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElIcon, ElInput, ElButton, ElSelect, ElOption, ElPagination, ElDialog, ElForm, ElFormItem, ElInputNumber } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-pagination.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input-number.css'
import 'element-plus/theme-chalk/el-overlay.css'
import { User, Calendar, TrendCharts, Search, Refresh, SwitchButton, Edit, Clock, Warning, Key, Lock } from '@element-plus/icons-vue'
import { getAllStudentsWithSpecialPassword, setStudentLevel, getStudentLevel, getAdminInfo, assignStudentToAdmin, getAvatarUrl, updateStudentWithSpecialPassword } from '@/api/student'
import { getStudentAttendanceCount, getDailyAttendanceCount, getMonthlyAttendanceCount, getTodayAttendanceRecords } from '@/api/attendance'
import { useAdminStore } from '@/stores/admin'
import { useThemeStore } from '@/stores/theme'

const adminStore = useAdminStore()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

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
const pageSize = ref(10)
const totalStudents = ref(0)
const todayCount = ref(0)
const monthlyCount = ref(0)
const studentLevels = ref({})
const studentAttendanceCounts = ref({})
const studentAdmins = ref({})
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

const levelOptions = [
  { value: 0, label: '社团成员', color: 'info' },
  { value: 1, label: '普通成员', color: 'success' },
  { value: 2, label: '核心成员', color: 'warning' },
  { value: 3, label: '管理员', color: 'danger' }
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

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return currentLevelStudents.value.slice(start, end)
})

const loadStudentLevels = async () => {
  if (!students.value.length) return

  try {
    const levelPromises = students.value.map(async (student) => {
      try {
        const response = await getStudentLevel(student.studentId)
        if (response.code === 200) {
          studentLevels.value[student.studentId] = response.data.levelCode
        } else {
          studentLevels.value[student.studentId] = 0
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

const loadStudentAvatars = async () => {
  if (!students.value.length) return

  try {
    const avatarPromises = students.value.map(async (student) => {
      try {
        if (student.id) {
          const studentInfoId = student.id
          const avatarUrlString = getAvatarUrl(studentInfoId)
          
          if (avatarUrlString) {
            const avatarUrlWithTimestamp = avatarUrlString + '?t=' + Date.now()
            const img = new Image()
            img.onload = () => {
              student.hasAvatar = true
              student.avatarUrl = avatarUrlWithTimestamp
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
        } else {
          student.hasAvatar = false
          student.avatarUrl = null
        }
      } catch (error) {
        student.hasAvatar = false
        student.avatarUrl = null
      }
    })
    await Promise.all(avatarPromises)
  } catch (error) {
    ElMessage.warning('部分学生头像加载失败')
  }
}

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
      todayCount.value = dailyData.data.count || 0
    }
    
    if (monthlyData.code === 200) {
      monthlyCount.value = monthlyData.data.count || 0
    }
  } catch (error) {
    ElMessage.warning('加载统计数据失败')
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
      await loadStudentAdmins()
      ElMessage.success('数据刷新成功')
    }
  } catch (error) {
    ElMessage.error('数据刷新失败：' + error.message)
  } finally {
    isLoading.value = false
  }
}

const changeLevel = async (studentId, newLevel) => {
  const adminPassword = adminStore.getAdminPassword()
  if (!adminPassword) {
    ElMessage.error('身份验证已过期，请重新登录')
    isAuthenticated.value = false
    adminStore.clearAdminPassword()
    return
  }

  try {
    const response = await setStudentLevel(adminPassword, studentId, newLevel)
    if (response.code === 200) {
      studentLevels.value[studentId] = newLevel
      ElMessage.success('等级修改成功')
      if (newLevel === 3) {
        await loadStudentAdmins()
      }
    } else {
      ElMessage.error(response.message || '等级修改失败')
    }
  } catch (error) {
    ElMessage.error('等级修改失败：' + error.message)
  }
}

const changeAdmin = async (studentId, newAdminId) => {
  const adminPassword = adminStore.getAdminPassword()
  if (!adminPassword) {
    ElMessage.error('身份验证已过期，请重新登录')
    isAuthenticated.value = false
    adminStore.clearAdminPassword()
    return
  }

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
      ElMessage.error(response.message || '管理员分配失败')
    }
  } catch (error) {
    ElMessage.error('管理员分配失败：' + error.message)
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
      await loadAllData(specialPassword.value)
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


const editFormRules = {
  name: [
    { required: true, message: '请输入学生姓名', trigger: 'blur' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^[2-3][0-9]\d{8}$/, message: '学号格式不正确（以20-30开头的10位数字）', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  college: [
    { required: true, message: '请输入学院', trigger: 'blur' }
  ],
  major: [
    { required: true, message: '请输入专业', trigger: 'blur' }
  ],
  grade: [
    { required: true, message: '请选择年级', trigger: 'change' }
  ],
  classNum: [
    { required: true, message: '请输入班级', trigger: 'blur' }
  ],
  password: [
    { min: 6, max: 16, message: '密码长度必须在6到16位之间', trigger: 'blur' }
  ]
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

const openAttendanceRecordsDialog = () => {
  ElMessage.info('考勤记录功能开发中')
}

const openMakeupDialog = () => {
  ElMessage.info('补卡功能开发中')
}

const loadAllData = async (adminPassword) => {
  const totalSteps = 6
  
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
    
    updateProgress(5, '正在加载管理员信息...')
    await loadStudentAdmins()
    
    updateProgress(6, '正在加载学生头像...')
    await loadStudentAvatars()
    
    updateProgress(6, '数据加载完成！')
    
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
    isAuthenticated.value = true
    try {
      await loadAllData(adminPassword)
    } catch (error) {
      ElMessage.error('加载数据失败：' + error.message)
      isAuthenticated.value = false
      adminStore.clearAdminPassword()
    }
  } else {
    isAuthenticated.value = false
  }
})
</script>

<style scoped>
.admin-mobile-container {
  min-height: 100vh;
  background: var(--admin-primary-gradient);
  position: relative;
}

.auth-section-mobile {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--admin-primary-gradient);
}

.auth-page-header-mobile {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.auth-logo-mobile {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-logo-mobile:active {
  transform: scale(0.95);
}

.auth-card-mobile {
  width: 100%;
  max-width: 400px;
  background: var(--admin-glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid var(--admin-glass-border);
  box-shadow: 0 8px 32px var(--admin-shadow-color);
}

.auth-header-mobile {
  text-align: center;
  margin-bottom: 30px;
}

.auth-icon-container-mobile {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-icon-mobile {
  font-size: 40px;
  color: var(--admin-primary-color);
  z-index: 2;
}

.icon-ring-mobile {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid var(--admin-primary-color);
  border-radius: 50%;
  opacity: 0.3;
  animation: icon-pulse-mobile 2s ease-in-out infinite;
}

@keyframes icon-pulse-mobile {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}

.auth-header-mobile h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0 0 10px 0;
}

.auth-header-mobile p {
  font-size: 14px;
  color: var(--admin-text-secondary);
  margin: 0;
}

.auth-status-indicator-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.status-icon-mobile {
  position: relative;
  width: 16px;
  height: 16px;
}

.status-dot-mobile {
  width: 8px;
  height: 8px;
  background: var(--admin-primary-color);
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.status-pulse-mobile {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid var(--admin-primary-color);
  border-radius: 50%;
  animation: status-pulse-mobile 2s ease-in-out infinite;
}

@keyframes status-pulse-mobile {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.status-text-mobile {
  font-size: 14px;
  color: var(--admin-text-primary);
  font-weight: 600;
}

.loading-dots-mobile {
  display: flex;
  gap: 4px;
}

.loading-dots-mobile span {
  width: 6px;
  height: 6px;
  background: var(--admin-primary-color);
  border-radius: 50%;
  animation: loading-dots-mobile 1.4s ease-in-out infinite both;
}

.loading-dots-mobile span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots-mobile span:nth-child(2) {
  animation-delay: -0.16s;
}

.loading-dots-mobile span:nth-child(3) {
  animation-delay: 0s;
}

@keyframes loading-dots-mobile {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.auth-form-mobile {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-container-mobile {
  position: relative;
}

.password-input-mobile {
  width: 100%;
}

.password-input-mobile :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 2px solid var(--admin-border-color);
  background: var(--admin-bg-primary);
  transition: all 0.3s ease;
}

.password-input-mobile :deep(.el-input__wrapper.is-focus) {
  border-color: var(--admin-primary-color);
}

.auth-button-mobile {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
}

.error-message-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--admin-danger-color);
  font-size: 14px;
  font-weight: 600;
  margin-top: 16px;
  padding: 12px;
  background: rgba(245, 108, 108, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(245, 108, 108, 0.2);
}

.admin-loading-mobile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--admin-primary-gradient);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-page-header-mobile {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10000;
}

.loading-logo-mobile {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.loading-logo-mobile:active {
  transform: scale(0.95);
}

.loading-container-mobile {
  text-align: center;
  color: var(--admin-text-primary);
  padding: 20px;
}

.loading-spinner-mobile {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
}

.spinner-ring-mobile {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid var(--admin-primary-color);
  border-radius: 50%;
  animation: spin-mobile 1.5s linear infinite;
}

.spinner-ring-mobile:nth-child(2) {
  width: 45px;
  height: 45px;
  top: 7.5px;
  left: 7.5px;
  border-top-color: var(--admin-secondary-color);
  animation-delay: -0.5s;
}

.spinner-ring-mobile:nth-child(3) {
  width: 30px;
  height: 30px;
  top: 15px;
  left: 15px;
  border-top-color: var(--admin-success-color);
  animation-delay: -1s;
}

@keyframes spin-mobile {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text-mobile {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--admin-text-primary);
}

.loading-progress-mobile {
  width: 250px;
  height: 6px;
  background: var(--admin-glass-bg);
  border-radius: 3px;
  margin: 0 auto 10px;
  overflow: hidden;
  border: 1px solid var(--admin-glass-border);
}

.progress-bar-mobile {
  height: 100%;
  background: var(--admin-primary-gradient);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.loading-status-mobile {
  font-size: 14px;
  color: var(--admin-text-secondary);
  font-weight: 500;
}

.admin-console-mobile {
  padding: 15px;
  padding-bottom: 30px;
}

.admin-header-mobile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
}

.header-content-mobile {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.header-content-mobile {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.logo-mobile {
  width: 35px;
  height: 35px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.logo-mobile:active {
  transform: scale(0.95);
}

.title-section-mobile {
  flex: 1;
}

.title-section-mobile h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 2px 0;
  color: var(--admin-text-primary);
}

.title-section-mobile p {
  font-size: 12px;
  color: var(--admin-text-secondary);
  margin: 0;
  font-weight: 500;
}

.logout-btn-mobile {
  flex-shrink: 0;
}

.admin-stats-mobile {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.stat-card-mobile {
  background: var(--admin-glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 15px;
  border: 1px solid var(--admin-glass-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px var(--admin-shadow-color);
}

.stat-card-mobile:active {
  transform: scale(0.98);
}

.stat-icon-mobile {
  width: 40px;
  height: 40px;
  background: var(--admin-glass-bg);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--admin-text-primary);
  border: 1px solid var(--admin-glass-border);
}

.stat-content-mobile {
  text-align: center;
}

.stat-value-mobile {
  font-size: 24px;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin-bottom: 4px;
}

.stat-label-mobile {
  font-size: 12px;
  color: var(--admin-text-secondary);
  font-weight: 500;
}

.students-section-mobile {
  background: var(--admin-glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid var(--admin-glass-border);
  box-shadow: 0 4px 16px var(--admin-shadow-color);
}

.section-header-mobile {
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-header-mobile h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0 0 15px 0;
  text-align: center;
  width: 100%;
}

.header-actions-mobile {
  display: flex;
  gap: 10px;
  position: relative;
  z-index: 2;
  justify-content: center;
  align-items: center;
}

.search-input-mobile {
  flex: 0 1 auto;
  max-width: 200px;
  min-width: 150px;
}

.level-tabs-mobile {
  margin-bottom: 30px;
  margin-top: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  position: relative;
  z-index: 0;
  clear: both;
}

.level-buttons-container-mobile {
  background: var(--admin-glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 8px;
  border: 1px solid var(--admin-glass-border);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  align-items: stretch;
  justify-items: start;
}

.level-buttons-container-mobile > * {
  display: flex;
  width: 100%;
}

.level-btn-mobile {
  width: fit-content;
  min-width: calc(100% - 2px);
  max-width: 100%;
  height: 100%;
  min-height: 48px;
  padding: 0 !important;
  margin: 0 !important;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  display: flex !important;
  align-items: center;
  justify-content: center !important;
  gap: 8px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  background: transparent;
  color: var(--admin-text-primary);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  text-align: center !important;
}

.level-btn-mobile :deep(.el-button__inner) {
  width: 100%;
  height: 100%;
  min-height: 48px;
  display: flex !important;
  align-items: center;
  justify-content: center !important;
  gap: 8px;
  padding: 14px 16px !important;
  margin: 0 !important;
  text-align: center !important;
}

.level-btn-mobile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.level-btn-mobile:hover::before {
  opacity: 1;
}

.level-btn-mobile:hover {
  border-color: var(--admin-glass-border);
  transform: translateY(-1px);
}

.level-btn-mobile:active {
  transform: translateY(0) scale(0.98);
  transition: all 0.15s ease;
}

.level-btn-mobile.is-active {
  background: var(--admin-primary-gradient);
  border-color: var(--admin-primary-color);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  color: white;
  transform: translateY(-2px);
}

.level-btn-mobile.is-active::before {
  opacity: 0;
}

.level-btn-mobile.is-active:hover {
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.5);
  transform: translateY(-3px);
}

.button-label-mobile {
  font-size: 16px;
  font-weight: 600;
  transition: color 0.3s ease;
  flex-shrink: 0;
}

.level-btn-mobile.is-active .button-label-mobile {
  color: white;
}

.button-count-mobile {
  background: var(--admin-glass-bg);
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.3s ease;
  color: var(--admin-text-primary);
}

.level-btn-mobile.is-active .button-count-mobile {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.students-list-mobile {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 0;
  padding-top: 0;
  position: relative;
  z-index: 0;
}

.student-item-mobile {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 15px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.student-main-info-mobile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.student-avatar-mobile {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--admin-primary-gradient);
}

.student-avatar-mobile.has-avatar {
  background: transparent;
}

.avatar-image-mobile {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-text-mobile {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.student-primary-info-mobile {
  flex: 1;
  min-width: 0;
}

.student-name-mobile {
  font-size: 16px;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin-bottom: 4px;
}

.student-id-mobile {
  font-size: 12px;
  color: var(--admin-text-secondary);
  margin-bottom: 6px;
}

.student-details-mobile {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.student-details-mobile span {
  font-size: 11px;
  color: var(--admin-text-secondary);
  background: var(--admin-glass-bg);
  padding: 2px 6px;
  border-radius: 6px;
}

.attendance-count-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.attendance-icon-mobile {
  font-size: 20px;
  color: var(--admin-primary-color);
}

.count-text-mobile {
  font-size: 11px;
  color: var(--admin-text-secondary);
  font-weight: 600;
}

.student-actions-mobile {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.action-btn-mobile {
  flex: 1;
  min-width: 0;
  font-size: 12px;
}

.student-management-mobile {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid var(--admin-glass-border);
}

.level-management-mobile,
.admin-management-mobile {
  display: flex;
  align-items: center;
  gap: 8px;
}

.management-label-mobile {
  font-size: 12px;
  color: var(--admin-text-secondary);
  font-weight: 600;
  flex-shrink: 0;
  min-width: 50px;
}

.level-select-mobile,
.admin-select-mobile {
  flex: 1;
  min-width: 0;
}

.no-admin-mobile {
  font-size: 11px;
  color: var(--admin-text-tertiary);
  font-style: italic;
}

.pagination-mobile {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.pagination-component-mobile {
  background: var(--admin-glass-bg);
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--admin-glass-border);
}

.edit-dialog-mobile :deep(.el-dialog) {
  border-radius: 20px;
  background: var(--admin-glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--admin-glass-border);
}

.edit-dialog-mobile :deep(.el-dialog__header) {
  padding: 20px 20px 15px;
  border-bottom: 1px solid var(--admin-glass-border);
}

.edit-dialog-mobile :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 700;
  color: var(--admin-text-primary);
}

.edit-dialog-mobile :deep(.el-dialog__body) {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.edit-form-mobile {
  padding: 0;
}

.edit-form-mobile :deep(.el-form-item) {
  margin-bottom: 18px;
}

.edit-form-mobile :deep(.el-form-item__label) {
  font-size: 14px;
  color: var(--admin-text-primary);
  font-weight: 600;
}

.dialog-footer-mobile {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid var(--admin-glass-border);
}

.today-attendance-dialog-mobile :deep(.el-dialog) {
  border-radius: 20px;
  background: var(--admin-glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--admin-glass-border);
}

.today-attendance-dialog-mobile :deep(.el-dialog__header) {
  padding: 20px 20px 15px;
  border-bottom: 1px solid var(--admin-glass-border);
}

.today-attendance-dialog-mobile :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 700;
  color: var(--admin-text-primary);
}

.today-attendance-dialog-mobile :deep(.el-dialog__body) {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.attendance-records-container-mobile {
  min-height: 200px;
}

.no-records-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--admin-text-secondary);
}

.no-records-icon-mobile {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.no-records-mobile p {
  font-size: 14px;
  margin: 0;
}

.records-list-mobile {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attendance-record-item-mobile {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.time-period-indicator-mobile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  width: fit-content;
  font-size: 12px;
  font-weight: 600;
}

.time-period-indicator-mobile.morning {
  background: rgba(255, 193, 7, 0.2);
  color: #ff9800;
}

.time-period-indicator-mobile.afternoon {
  background: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.time-period-indicator-mobile.evening {
  background: rgba(156, 39, 176, 0.2);
  color: #9c27b0;
}

.indicator-dot-mobile {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.period-text-mobile {
  font-size: 12px;
}

.record-content-mobile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar-mobile-record {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--admin-primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.student-details-mobile-record {
  flex: 1;
  min-width: 0;
}

.student-name-mobile-record {
  font-size: 15px;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin-bottom: 4px;
}

.student-id-mobile-record {
  font-size: 12px;
  color: var(--admin-text-secondary);
}

.attendance-time-mobile {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.time-icon-mobile {
  font-size: 16px;
  color: var(--admin-text-secondary);
}

.time-text-mobile {
  font-size: 12px;
  color: var(--admin-text-secondary);
}
</style>
