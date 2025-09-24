<template>
  <div class="admin-container">
    <div class="admin-header">
      <div class="header-content">
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊" class="admin-logo">
        <div class="admin-title">
          <h1>超级管理员控制台</h1>
          <p>Super Admin Console</p>
        </div>
        <div class="security-badge">
          <el-icon class="security-icon"><Lock /></el-icon>
          <span>安全模式</span>
        </div>
      </div>
    </div>

    <div v-if="!isAuthenticated" class="auth-section">
      <div class="auth-card">
        <div class="auth-header">
          <el-icon class="auth-icon"><Key /></el-icon>
          <h2>身份验证</h2>
          <p>请输入特殊密码以访问管理员功能</p>
        </div>
        <div class="auth-form">
          <el-input
            v-model="specialPassword"
            type="password"
            placeholder="请输入特殊密码"
            show-password
            size="large"
            @keyup.enter="authenticate"
            class="password-input"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
          <el-button 
            type="primary" 
            size="large" 
            @click="authenticate"
            :loading="isLoading"
            class="auth-button"
          >
            验证身份
          </el-button>
        </div>
        <div v-if="authError" class="error-message">
          <el-icon><Warning /></el-icon>
          {{ authError }}
        </div>
      </div>
    </div>

    <div v-else class="admin-content">
      <div class="admin-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalStudents }}</div>
            <div class="stat-label">学生总数</div>
          </div>
        </div>
        <div class="stat-card" @click="showTodayAttendance" style="cursor: pointer;">
          <div class="stat-icon">
            <el-icon><Calendar /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ todayCount }}</div>
            <div class="stat-label">今日签到</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ monthlyCount }}</div>
            <div class="stat-label">本月签到</div>
          </div>
        </div>
      </div>

         <div class="students-section">
           <div class="section-header">
             <h2>学生信息管理</h2>
             <div class="header-actions">
               <el-input
                 v-model="searchKeyword"
                 placeholder="搜索学生信息"
                 clearable
                 class="search-input"
               >
                 <template #prefix>
                   <el-icon><Search /></el-icon>
                 </template>
               </el-input>
               <el-button @click="refreshData" :loading="isLoading" type="primary">
                 <el-icon><Refresh /></el-icon>
                 刷新数据
               </el-button>
             </div>
           </div>
           
 
           <div class="level-tabs">
             <el-tabs v-model="activeLevelTab" type="card" class="level-tabs-container">
               <el-tab-pane 
                 v-for="level in levelOptions" 
                 :key="level.value" 
                 :label="level.label" 
                 :name="level.value.toString()"
                 :class="`level-tab-${level.color}`"
               >
                 <template #label>
                   <el-tag :type="level.color" size="large" class="tab-label">
                     {{ level.label }}
                     <span class="tab-count">({{ getLevelStudents(level.value).length }})</span>
                   </el-tag>
                 </template>
               </el-tab-pane>
             </el-tabs>
           </div>

         <div class="students-table-container">
           <el-table
             :data="currentLevelStudents"
             stripe
             border
             height="500"
             class="students-table"
             :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
             :row-class-name="getRowClassName"
             style="width: 100%; min-width: 1800px;"
           >
            <el-table-column prop="studentId" label="学号" width="120" fixed="left">
              <template #default="{ row }">
                <span class="student-id">{{ row.studentId }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100">
              <template #default="{ row }">
                <span class="student-name">{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gender" label="性别" width="80">
              <template #default="{ row }">
                <el-tag :type="row.gender === '男' ? 'primary' : 'success'" size="small">
                  {{ row.gender }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="phoneNumber" label="手机号" width="130">
              <template #default="{ row }">
                <span class="phone-number">{{ row.phoneNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="college" label="学院" width="150">
              <template #default="{ row }">
                <span class="college">{{ row.college }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="grade" label="年级" width="80">
              <template #default="{ row }">
                <el-tag type="info" size="small">{{ row.grade }}年级</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="major" label="专业" width="150">
              <template #default="{ row }">
                <span class="major">{{ row.major }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="classNum" label="班级" width="80">
              <template #default="{ row }">
                <span class="class-num">{{ row.classNum }}班</span>
              </template>
            </el-table-column>
            <el-table-column label="签到次数" width="120">
              <template #default="{ row }">
                <div class="attendance-count">
                  <el-tag 
                    :type="getAttendanceCountType(studentAttendanceCounts[row.studentId] || 0)" 
                    size="small"
                    class="attendance-tag"
                  >
                    {{ studentAttendanceCounts[row.studentId] || 0 }}次
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="学生等级" width="150">
              <template #default="{ row }">
                <el-select
                  :model-value="studentLevels[row.studentId] || 0"
                  @change="(value) => changeLevel(row.studentId, value)"
                  size="small"
                  style="width: 120px;"
                  :loading="isLoading"
                  class="level-select"
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
              </template>
            </el-table-column>
            <el-table-column label="所属管理员" width="200">
              <template #default="{ row }">
                <div v-if="(studentLevels[row.studentId] || 0) === 3" class="admin-level-notice">
                  <el-icon class="admin-icon"><UserFilled /></el-icon>
                  <span>管理员身份</span>
                </div>
                <div v-else-if="adminOptions.length === 0" class="no-admin-available">
                  <el-icon class="warning-icon"><Warning /></el-icon>
                  <span>暂无可用的管理员</span>
                </div>
                <div v-else>
                  <el-select
                    :model-value="studentAdmins[row.studentId]?.adminStudentId || ''"
                    @change="(value) => changeAdmin(row.studentId, value)"
                    size="small"
                    style="width: 180px;"
                    :loading="isLoading"
                    class="admin-select"
                    placeholder="分配管理员"
                    clearable
                  >
                    <el-option
                      v-for="option in adminOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    >
                      <div class="admin-option">
                        <el-icon class="option-icon"><UserFilled /></el-icon>
                        <div class="option-text">
                          <div class="option-name">{{ option.student.name }}</div>
                          <div class="option-id">{{ option.student.studentId }}</div>
                        </div>
                      </div>
                    </el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <div class="action-buttons">
                  <el-tooltip content="编辑学生信息" placement="top">
                    <el-button
                      type="primary"
                      size="small"
                      @click="openEditDialog(row)"
                      :loading="isLoading"
                      class="action-btn edit-btn"
                      circle
                    >
                      <el-icon><Edit /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="查看考勤记录" placement="top">
                    <el-button
                      type="success"
                      size="small"
                      @click="openAttendanceRecordsDialog(row)"
                      :loading="isLoading"
                      class="action-btn records-btn"
                      circle
                    >
                      <el-icon><Clock /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="补卡操作" placement="top">
                    <el-button
                      type="warning"
                      size="small"
                      @click="openMakeupDialog(row)"
                      :loading="isLoading"
                      class="action-btn makeup-btn"
                      circle
                    >
                      <el-icon><Plus /></el-icon>
                    </el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

         <div class="table-footer">
           <div class="pagination-info">
             共 {{ currentLevelStudents.length }} 条记录
           </div>
           <el-pagination
             v-model:current-page="currentPage"
             v-model:page-size="pageSize"
             :page-sizes="[10, 20, 50, 100]"
             :total="currentLevelStudents.length"
             layout="total, sizes, prev, pager, next, jumper"
             class="pagination"
           />
         </div>
      </div>
    </div>

    <el-dialog
      v-model="editDialogVisible"
      title="修改学生信息"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="edit-dialog"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
        class="edit-form"
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
        <div class="dialog-footer">
          <el-button @click="cancelEdit" :disabled="isLoading">取消</el-button>
          <el-button type="primary" @click="confirmEdit" :loading="isLoading">
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="todayAttendanceDialogVisible"
      title="今日签到记录"
      width="800px"
      :close-on-click-modal="false"
      class="today-attendance-dialog"
    >
      <div class="attendance-records-container">
        <div v-if="todayAttendanceRecords.length === 0" class="no-records">
          <el-icon class="no-records-icon"><Calendar /></el-icon>
          <p>今日暂无签到记录</p>
        </div>
        <div v-else class="records-list">
          <div 
            v-for="(record, index) in todayAttendanceRecords" 
            :key="index"
            class="attendance-record-item"
            :class="getTimePeriodClass(record.attendanceTime)"
          >
            <div class="time-period-indicator" :class="getTimePeriodClass(record.attendanceTime)">
              <div class="indicator-dot"></div>
              <span class="period-text">{{ getTimePeriodName(record.attendanceTime) }}</span>
            </div>
            <div class="record-content">
              <div class="student-avatar" :class="getTimePeriodClass(record.attendanceTime)">
                {{ record.name.charAt(0) }}
              </div>
              <div class="student-details">
                <div class="student-name">{{ record.name }}</div>
                <div class="student-id">{{ record.scheduleId }}</div>
              </div>
              <div class="attendance-time">
                <el-icon class="time-icon"><Clock /></el-icon>
                <span class="time-text">{{ formatAttendanceTime(record.attendanceTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="todayAttendanceDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="attendanceRecordsDialogVisible"
      :title="`${currentStudentInfo.name} 的考勤记录`"
      width="900px"
      :close-on-click-modal="false"
      class="attendance-records-dialog"
    >
      <div class="student-info-header">
        <div class="student-avatar-large">
          {{ currentStudentInfo.name?.charAt(0) }}
        </div>
        <div class="student-info">
          <h3>{{ currentStudentInfo.name }}</h3>
          <p>学号：{{ currentStudentInfo.studentId }}</p>
          <p>专业：{{ currentStudentInfo.major }} | 年级：{{ currentStudentInfo.grade }}年级</p>
        </div>
        <div class="attendance-summary">
          <div class="summary-item">
            <span class="summary-label">总签到次数</span>
            <span class="summary-value">{{ studentAttendanceRecords.length }}</span>
          </div>
        </div>
      </div>
      
      <div class="attendance-records-container">
        <div v-if="studentAttendanceRecords.length === 0" class="no-records">
          <el-icon class="no-records-icon"><Calendar /></el-icon>
          <p>暂无考勤记录</p>
        </div>
        <div v-else class="calendar-container">
          <el-calendar v-model="calendarValue" class="attendance-calendar">
            <template #date-cell="{ data }">
              <div class="calendar-day">
                <div class="day-number">{{ data.day.split('-').slice(2).join('-') }}</div>
                <div class="attendance-dots">
                  <div 
                    v-for="record in getDayAttendanceRecords(data.day)" 
                    :key="record.attendanceDateTime"
                    class="attendance-dot"
                    :class="getTimePeriodClass(record.attendanceDateTime)"
                    :title="formatAttendanceTime(record.attendanceDateTime)"
                  ></div>
                </div>
              </div>
            </template>
          </el-calendar>
          <div class="calendar-legend">
            <div class="legend-item">
              <div class="legend-dot morning"></div>
              <span>早上 (8:00-11:00)</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot afternoon"></div>
              <span>下午 (14:00-17:00)</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot evening"></div>
              <span>晚上 (19:00-22:00)</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeAttendanceRecordsDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="makeupDialogVisible"
      title="学生补卡"
      width="500px"
      :close-on-click-modal="false"
      class="makeup-dialog"
    >
      <div class="makeup-form">
        <div class="student-info-card">
          <div class="student-avatar-medium">
            {{ currentStudentInfo.name?.charAt(0) }}
          </div>
          <div class="student-info">
            <h4>{{ currentStudentInfo.name }}</h4>
            <p>学号：{{ currentStudentInfo.studentId }}</p>
          </div>
        </div>
        
        <el-form
          ref="makeupFormRef"
          :model="makeupForm"
          :rules="makeupFormRules"
          label-width="100px"
          class="makeup-form-content"
        >
          <el-form-item label="补卡时间" prop="attendanceTime">
            <el-date-picker
              v-model="makeupForm.attendanceTime"
              type="datetime"
              placeholder="选择补卡时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelMakeup">取消</el-button>
          <el-button type="primary" @click="confirmMakeup" :loading="isLoading">
            确认补卡
          </el-button>
        </div>
      </template>
    </el-dialog>

    <div class="admin-footer">
      <div class="footer-content">
        <div class="footer-left">
          <span>人工智能创作坊学生管理系统</span>
        </div>
        <div class="footer-right">
          <span>超级管理员模式</span>
          <el-button @click="logout" type="danger" size="small" class="logout-btn">
            <el-icon><SwitchButton /></el-icon>
            退出管理
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Lock, Key, Warning, User, Calendar, TrendCharts, Search, Refresh, SwitchButton, Edit, UserFilled, Clock, Plus } from '@element-plus/icons-vue'
import { getAllStudentsWithSpecialPassword, setStudentLevel, getStudentLevel, updateStudentWithSpecialPassword, getStudentAttendanceCount, getAdminInfo, assignStudentToAdmin, getStudentAttendanceRecords, makeupAttendanceWithSpecialPassword } from '@/api/admin'
import { getDailyAttendanceCount, getMonthlyAttendanceCount, getTodayAttendanceRecords } from '@/api/user'

const isAuthenticated = ref(false)
const specialPassword = ref('')
const authError = ref('')
const isLoading = ref(false)
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
const studentAttendanceRecords = ref([])
const currentStudentInfo = ref({})
const calendarValue = ref(new Date())
const scrollPosition = ref(0)
const makeupDialogVisible = ref(false)
const makeupFormRef = ref()
const makeupForm = ref({
  attendanceTime: ''
})

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

const makeupFormRules = {
  attendanceTime: [
    { required: true, message: '请选择补卡时间', trigger: 'change' }
  ]
}

const filteredStudents = computed(() => {
  if (!searchKeyword.value) {
    return students.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return students.value.filter(student => 
    student.name.toLowerCase().includes(keyword) ||
    student.studentId.toString().includes(keyword) ||
    student.phoneNumber.includes(keyword) ||
    student.college.toLowerCase().includes(keyword) ||
    student.major.toLowerCase().includes(keyword)
  )
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

const getRowClassName = ({ row }) => {
  const level = studentLevels.value[row.studentId] || 0
  const levelInfo = levelOptions.find(option => option.value === level) || levelOptions[0]
  return `level-row-${levelInfo.color}`
}

const getAttendanceCountType = (count) => {
  if (count >= 20) return 'success'
  if (count >= 10) return 'warning'
  if (count >= 5) return 'info'
  return 'danger'
}

const changeLevel = async (studentId, newLevel) => {
  if (!specialPassword.value) {
    ElMessage.error('特殊密码已失效，请重新登录')
    return
  }

  if (studentLevels.value[studentId] === newLevel) {
    return
  }

  isLoading.value = true
  try {
    const response = await setStudentLevel(specialPassword.value, studentId, newLevel)
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
  if (!specialPassword.value) {
    ElMessage.error('特殊密码已失效，请重新登录')
    return
  }

  const currentAdminId = studentAdmins.value[studentId]?.adminStudentId
  if (currentAdminId === newAdminId) {
    return
  }

  const studentLevel = studentLevels.value[studentId] || 0
  if (studentLevel === 3) {
    ElMessage.warning('管理员不能分配所属管理员')
    return
  }

  isLoading.value = true
  try {
    const response = await assignStudentToAdmin(specialPassword.value, studentId, newAdminId)
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

const authenticate = async () => {
  if (!specialPassword.value.trim()) {
    authError.value = '请输入特殊密码'
    return
  }

  isLoading.value = true
  authError.value = ''

  try {
    const response = await getAllStudentsWithSpecialPassword(specialPassword.value)
    if (response.code === 200) {
      isAuthenticated.value = true
      students.value = response.data
      totalStudents.value = response.data.length
      await loadStatistics()
      await loadStudentLevels()
      await loadStudentAttendanceCounts()
      await loadStudentAdmins()
      ElMessage.success('身份验证成功')
    } else {
      authError.value = response.message || '特殊密码错误'
    }
  } catch (error) {
    authError.value = error.message
  } finally {
    isLoading.value = false
  }
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
  if (!isAuthenticated.value) return

  isLoading.value = true
  try {
    const response = await getAllStudentsWithSpecialPassword(specialPassword.value)
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
    
    if (!specialPassword.value) {
      ElMessage.error('特殊密码已失效，请重新登录')
      return
    }

    isLoading.value = true
    
    const response = await updateStudentWithSpecialPassword(
      specialPassword.value,
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

const getDayAttendanceRecords = (dateString) => {
  if (!studentAttendanceRecords.value || studentAttendanceRecords.value.length === 0) return []
  
  const targetDate = new Date(dateString)
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  return studentAttendanceRecords.value.filter(record => {
    const recordDate = new Date(record.attendanceDateTime)
    const recordYear = recordDate.getFullYear()
    const recordMonth = String(recordDate.getMonth() + 1).padStart(2, '0')
    const recordDay = String(recordDate.getDate()).padStart(2, '0')
    const recordDateStr = `${recordYear}-${recordMonth}-${recordDay}`
    return recordDateStr === dateStr
  })
}

const openAttendanceRecordsDialog = async (student) => {
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
      studentAttendanceRecords.value = response.data || []
      attendanceRecordsDialogVisible.value = true
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

const closeAttendanceRecordsDialog = () => {
  attendanceRecordsDialogVisible.value = false
  setTimeout(() => {
    window.scrollTo(0, scrollPosition.value)
  }, 100)
}

const openMakeupDialog = (student) => {
  currentStudentInfo.value = student
  makeupForm.value.attendanceTime = ''
  makeupDialogVisible.value = true
}

const cancelMakeup = () => {
  makeupDialogVisible.value = false
  makeupFormRef.value?.resetFields()
  currentStudentInfo.value = {}
}

const confirmMakeup = async () => {
  if (!makeupFormRef.value) return
  
  try {
    await makeupFormRef.value.validate()
    
    if (!specialPassword.value) {
      ElMessage.error('特殊密码已失效，请重新登录')
      return
    }

    isLoading.value = true
    
    const response = await makeupAttendanceWithSpecialPassword(
      specialPassword.value,
      currentStudentInfo.value.studentId.toString(),
      makeupForm.value.attendanceTime
    )
    
    if (response.code === 200) {
      ElMessage.success('补卡成功')
      makeupDialogVisible.value = false
      await refreshData()
    } else {
      ElMessage.error(response.message || '补卡失败')
    }
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    isLoading.value = false
  }
}

const logout = () => {
  isAuthenticated.value = false
  specialPassword.value = ''
  students.value = []
  totalStudents.value = 0
  todayCount.value = 0
  monthlyCount.value = 0
  searchKeyword.value = ''
  currentPage.value = 1
  authError.value = ''
  studentLevels.value = {}
  studentAttendanceCounts.value = {}
  studentAdmins.value = {}
  editDialogVisible.value = false
  currentEditStudentId.value = ''
  todayAttendanceDialogVisible.value = false
  todayAttendanceRecords.value = []
  attendanceRecordsDialogVisible.value = false
  studentAttendanceRecords.value = []
  currentStudentInfo.value = {}
  makeupDialogVisible.value = false
  makeupForm.value.attendanceTime = ''
  ElMessage.success('已退出管理员模式')
}

onMounted(() => {
  document.title = '超级管理员控制台 - AI坊学生管理系统'
})
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #ffffff;
  position: relative;
}

.admin-header {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 40px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.admin-logo {
  width: 50px;
  height: 50px;
  margin-right: 20px;
}

.admin-title h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: #ffffff;
}

.admin-title p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(76, 175, 80, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.security-icon {
  color: #4caf50;
  font-size: 18px;
}

.auth-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 40px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.auth-header {
  margin-bottom: 30px;
}

.auth-icon {
  font-size: 48px;
  color: #667eea;
  margin-bottom: 20px;
}

.auth-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.auth-header p {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.password-input {
  width: 100%;
}

.auth-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #f56565;
  font-size: 14px;
  margin-top: 15px;
}

.admin-content {
  max-width: 90%;
  margin: 0 auto;
  padding: 40px;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #ffffff;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.students-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-input {
  width: 250px;
}


.level-tabs {
  margin-bottom: 30px;
}

.level-tabs-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  padding: 16px 24px;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-size: 16px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  min-width: 160px;
  justify-content: center;
}

.tab-label::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.tab-label:hover::before {
  left: 100%;
}

.tab-count {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 800;
  color: #2c3e50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  min-width: 32px;
  text-align: center;
}

.level-tab-info .tab-label {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%);
  color: #ffffff;
  border: 2px solid rgba(25, 118, 210, 0.3);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
}

.level-tab-info .tab-label:hover {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #0277bd 100%);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 35px rgba(25, 118, 210, 0.5);
}

.level-tab-success .tab-label {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 50%, #0d4f1c 100%);
  color: #ffffff;
  border: 2px solid rgba(46, 125, 50, 0.3);
  box-shadow: 0 8px 25px rgba(46, 125, 50, 0.3);
}

.level-tab-success .tab-label:hover {
  background: linear-gradient(135deg, #1b5e20 0%, #0d4f1c 50%, #004d40 100%);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 35px rgba(46, 125, 50, 0.5);
}

.level-tab-warning .tab-label {
  background: linear-gradient(135deg, #f57c00 0%, #ef6c00 50%, #e65100 100%);
  color: #ffffff;
  border: 2px solid rgba(245, 124, 0, 0.3);
  box-shadow: 0 8px 25px rgba(245, 124, 0, 0.3);
}

.level-tab-warning .tab-label:hover {
  background: linear-gradient(135deg, #ef6c00 0%, #e65100 50%, #d84315 100%);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 35px rgba(245, 124, 0, 0.5);
}

.level-tab-danger .tab-label {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 50%, #b71c1c 100%);
  color: #ffffff;
  border: 2px solid rgba(211, 47, 47, 0.3);
  box-shadow: 0 8px 25px rgba(211, 47, 47, 0.3);
}

.level-tab-danger .tab-label:hover {
  background: linear-gradient(135deg, #c62828 0%, #b71c1c 50%, #a71e1e 100%);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 35px rgba(211, 47, 47, 0.5);
}

.level-tab-info .tab-count {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #0d47a1;
  border-color: rgba(25, 118, 210, 0.3);
}

.level-tab-success .tab-count {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  color: #1b5e20;
  border-color: rgba(46, 125, 50, 0.3);
}

.level-tab-warning .tab-count {
  background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%);
  color: #e65100;
  border-color: rgba(245, 124, 0, 0.3);
}

.level-tab-danger .tab-count {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #b71c1c;
  border-color: rgba(211, 47, 47, 0.3);
}

.students-table-container {
  margin-bottom: 20px;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.students-table {
  width: 100%;
  min-width: 1800px;
}

.student-id {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #667eea;
}

.student-name {
  font-weight: 600;
  color: #2c3e50;
}

.phone-number {
  font-family: 'Courier New', monospace;
  color: #7f8c8d;
}

.college, .major {
  color: #2c3e50;
}

.class-num {
  color: #7f8c8d;
}

.attendance-count {
  display: flex;
  justify-content: center;
  align-items: center;
}

.attendance-tag {
  font-weight: 600;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 50px;
  text-align: center;
}

.level-select {
  width: 120px;
}

.admin-select {
  width: 180px;
}

.no-admin-available {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%);
  border-radius: 8px;
  border: 1px solid #ff9800;
  color: #e65100;
  font-size: 12px;
  width: 180px;
}

.admin-level-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-radius: 8px;
  border: 1px solid #f44336;
  color: #c62828;
  font-size: 12px;
  width: 180px;
  font-weight: 600;
}

.warning-icon {
  color: #ff9800;
  font-size: 14px;
}

.admin-icon {
  color: #f44336;
  font-size: 14px;
}

.admin-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.option-icon {
  color: #ff9800;
  font-size: 14px;
}

.option-text {
  flex: 1;
}

.option-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 13px;
  line-height: 1.2;
}

.option-id {
  color: #666;
  font-size: 11px;
  line-height: 1.2;
  font-family: 'Courier New', monospace;
}


.level-row-info {
  background: #0000FF !important;
  border: 5px solid #000080 !important;
  box-shadow: 0 0 20px #0000FF, inset 0 0 20px #0000FF !important;
  font-weight: 900 !important;
  color: #FFFFFF !important;
  text-shadow: 2px 2px 4px #000000 !important;
  animation: pulse-blue 2s infinite !important;
}

.level-row-success {
  background: #00FF00 !important;
  border: 5px solid #008000 !important;
  box-shadow: 0 0 20px #00FF00, inset 0 0 20px #00FF00 !important;
  font-weight: 900 !important;
  color: #000000 !important;
  text-shadow: 2px 2px 4px #FFFFFF !important;
  animation: pulse-green 2s infinite !important;
}

.level-row-warning {
  background: #FFA500 !important;
  border: 5px solid #FF8C00 !important;
  box-shadow: 0 0 20px #FFA500, inset 0 0 20px #FFA500 !important;
  font-weight: 900 !important;
  color: #000000 !important;
  text-shadow: 2px 2px 4px #FFFFFF !important;
  animation: pulse-orange 2s infinite !important;
}

.level-row-danger {
  background: #FF0000 !important;
  border: 5px solid #8B0000 !important;
  box-shadow: 0 0 20px #FF0000, inset 0 0 20px #FF0000 !important;
  font-weight: 900 !important;
  color: #FFFFFF !important;
  text-shadow: 2px 2px 4px #000000 !important;
  animation: pulse-red 2s infinite !important;
}

.level-row-info:hover {
  background: #000080 !important;
  border: 8px solid #0000FF !important;
  box-shadow: 0 0 30px #0000FF, inset 0 0 30px #0000FF !important;
  transform: scale(1.05) !important;
  animation: pulse-blue-fast 0.5s infinite !important;
}

.level-row-success:hover {
  background: #008000 !important;
  border: 8px solid #00FF00 !important;
  box-shadow: 0 0 30px #00FF00, inset 0 0 30px #00FF00 !important;
  transform: scale(1.05) !important;
  animation: pulse-green-fast 0.5s infinite !important;
}

.level-row-warning:hover {
  background: #FF8C00 !important;
  border: 8px solid #FFA500 !important;
  box-shadow: 0 0 30px #FFA500, inset 0 0 30px #FFA500 !important;
  transform: scale(1.05) !important;
  animation: pulse-orange-fast 0.5s infinite !important;
}

.level-row-danger:hover {
  background: #8B0000 !important;
  border: 8px solid #FF0000 !important;
  box-shadow: 0 0 30px #FF0000, inset 0 0 30px #FF0000 !important;
  transform: scale(1.05) !important;
  animation: pulse-red-fast 0.5s infinite !important;
}

@keyframes pulse-blue {
  0%, 100% { box-shadow: 0 0 20px #0000FF, inset 0 0 20px #0000FF; }
  50% { box-shadow: 0 0 40px #0000FF, inset 0 0 40px #0000FF; }
}

@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 20px #00FF00, inset 0 0 20px #00FF00; }
  50% { box-shadow: 0 0 40px #00FF00, inset 0 0 40px #00FF00; }
}

@keyframes pulse-orange {
  0%, 100% { box-shadow: 0 0 20px #FFA500, inset 0 0 20px #FFA500; }
  50% { box-shadow: 0 0 40px #FFA500, inset 0 0 40px #FFA500; }
}

@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 20px #FF0000, inset 0 0 20px #FF0000; }
  50% { box-shadow: 0 0 40px #FF0000, inset 0 0 40px #FF0000; }
}

@keyframes pulse-blue-fast {
  0%, 100% { box-shadow: 0 0 30px #0000FF, inset 0 0 30px #0000FF; }
  50% { box-shadow: 0 0 60px #0000FF, inset 0 0 60px #0000FF; }
}

@keyframes pulse-green-fast {
  0%, 100% { box-shadow: 0 0 30px #00FF00, inset 0 0 30px #00FF00; }
  50% { box-shadow: 0 0 60px #00FF00, inset 0 0 60px #00FF00; }
}

@keyframes pulse-orange-fast {
  0%, 100% { box-shadow: 0 0 30px #FFA500, inset 0 0 30px #FFA500; }
  50% { box-shadow: 0 0 60px #FFA500, inset 0 0 60px #FFA500; }
}

@keyframes pulse-red-fast {
  0%, 100% { box-shadow: 0 0 30px #FF0000, inset 0 0 30px #FF0000; }
  50% { box-shadow: 0 0 60px #FF0000, inset 0 0 60px #FF0000; }
}


.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.pagination-info {
  color: #7f8c8d;
  font-size: 14px;
}

.pagination {
  margin: 0;
}

.admin-footer {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 40px;
  margin-top: 40px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-left {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 15px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.logout-btn {
  background: rgba(245, 101, 101, 0.2);
  border: 1px solid rgba(245, 101, 101, 0.3);
  color: #f56565;
}

.logout-btn:hover {
  background: rgba(245, 101, 101, 0.3);
  border-color: rgba(245, 101, 101, 0.5);
}

@media (max-width: 768px) {
  .admin-header {
    padding: 15px 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .admin-content {
    padding: 20px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .search-input {
    width: 100%;
  }
  
  .table-footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .admin-footer {
    padding: 15px 20px;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .students-table-container {
    margin: 0 -20px;
    border-radius: 0;
  }
  
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.action-btn:active {
  transform: translateY(0);
}

.edit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.edit-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.records-btn {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
}

.records-btn:hover {
  background: linear-gradient(135deg, #0ea572 0%, #047857 100%);
}

.makeup-btn {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  color: white;
}

.makeup-btn:hover {
  background: linear-gradient(135deg, #e58e0a 0%, #c46205 100%);
}

@media (max-width: 1200px) {
  .students-table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .students-table {
    min-width: 1800px;
  }
  
  .action-buttons {
    gap: 6px;
  }
  
  .action-btn {
    width: 28px;
    height: 28px;
  }
}
}

.edit-dialog {
  .el-dialog__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 24px;
    border-radius: 8px 8px 0 0;
  }
  
  .el-dialog__title {
    color: white;
    font-weight: 700;
    font-size: 18px;
  }
  
  .el-dialog__headerbtn .el-dialog__close {
    color: white;
    font-size: 20px;
  }
  
  .el-dialog__body {
    padding: 30px 24px;
    background: #f8f9fa;
  }
  
  .el-dialog__footer {
    background: #f8f9fa;
    padding: 20px 24px;
    border-radius: 0 0 8px 8px;
  }
}

.edit-form {
  .el-form-item__label {
    font-weight: 600;
    color: #2c3e50;
  }
  
  .el-input__inner,
  .el-select .el-input__inner {
    border-radius: 8px;
    border: 2px solid #e1e8ed;
    transition: all 0.3s ease;
  }
  
  .el-input__inner:focus,
  .el-select .el-input__inner:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
  
  .el-input-number {
    width: 100%;
  }
  
  .el-input-number .el-input__inner {
    text-align: left;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  
  .el-button {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .el-button--primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
  }
  
  .el-button--primary:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}


.today-attendance-dialog {
  .el-dialog__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 24px;
    border-radius: 8px 8px 0 0;
  }
  
  .el-dialog__title {
    color: white;
    font-weight: 700;
    font-size: 18px;
  }
  
  .el-dialog__headerbtn .el-dialog__close {
    color: white;
    font-size: 20px;
  }
  
  .el-dialog__body {
    padding: 30px 24px;
    background: #f8f9fa;
  }
  
  .el-dialog__footer {
    background: #f8f9fa;
    padding: 20px 24px;
    border-radius: 0 0 8px 8px;
  }
}

.attendance-records-container {
  max-height: 500px;
  overflow-y: auto;
}

.calendar-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.attendance-calendar {
  width: 100%;
}

.attendance-calendar :deep(.el-calendar__header) {
  display: none;
}

.attendance-calendar :deep(.el-calendar__body) {
  padding: 0;
}

.attendance-calendar :deep(.el-calendar-table) {
  border: none;
}

.attendance-calendar :deep(.el-calendar-table thead th) {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  padding: 12px 0;
  border: none;
  font-size: 14px;
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(1))::after {
  content: '周日';
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(2))::after {
  content: '周一';
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(3))::after {
  content: '周二';
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(4))::after {
  content: '周三';
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(5))::after {
  content: '周四';
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(6))::after {
  content: '周五';
}

.attendance-calendar :deep(.el-calendar-table thead th:nth-child(7))::after {
  content: '周六';
}

.attendance-calendar :deep(.el-calendar-table thead th) {
  font-size: 0;
}

.attendance-calendar :deep(.el-calendar-table tbody td) {
  border: 1px solid #e9ecef;
  padding: 0;
  height: 80px;
  vertical-align: top;
}

.attendance-calendar :deep(.el-calendar-table tbody td.is-today) {
  background: rgba(102, 126, 234, 0.1);
}

.attendance-calendar :deep(.el-calendar-table tbody td.is-selected) {
  background: rgba(102, 126, 234, 0.2);
}

.calendar-day {
  position: relative;
  height: 100%;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
}

.day-number {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.attendance-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.attendance-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.attendance-dot.morning {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  box-shadow: 0 0 4px rgba(16, 185, 129, 0.4);
}

.attendance-dot.afternoon {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  box-shadow: 0 0 4px rgba(245, 158, 11, 0.4);
}

.attendance-dot.evening {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  box-shadow: 0 0 4px rgba(139, 92, 246, 0.4);
}

.attendance-dot:hover {
  transform: scale(1.2);
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6B7280;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.morning {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
}

.legend-dot.afternoon {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.4);
}

.legend-dot.evening {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  box-shadow: 0 0 6px rgba(139, 92, 246, 0.4);
}

.no-records {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.no-records-icon {
  font-size: 48px;
  color: #ddd;
  margin-bottom: 20px;
}

.no-records p {
  font-size: 16px;
  margin: 0;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attendance-record-item {
  background: #ffffff;
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
}

.attendance-record-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  transition: all 0.4s ease;
}

.attendance-record-item.morning::before {
  background: linear-gradient(90deg, #10B981 0%, #059669 100%);
}

.attendance-record-item.afternoon::before {
  background: linear-gradient(90deg, #F59E0B 0%, #D97706 100%);
}

.attendance-record-item.evening::before {
  background: linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%);
}

.attendance-record-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.attendance-record-item.morning:hover {
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
}

.attendance-record-item.afternoon:hover {
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
}

.attendance-record-item.evening:hover {
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
}

.time-period-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.time-period-indicator.morning {
  color: #10B981;
}

.time-period-indicator.afternoon {
  color: #F59E0B;
}

.time-period-indicator.evening {
  color: #8B5CF6;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.time-period-indicator.morning .indicator-dot {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.time-period-indicator.afternoon .indicator-dot {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}

.time-period-indicator.evening .indicator-dot {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}

.record-content {
  display: flex;
  align-items: center;
  padding: 0 20px 20px;
  gap: 16px;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: white;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.student-avatar.morning {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.student-avatar.afternoon {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.student-avatar.evening {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.student-details {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-weight: 700;
  color: #1F2937;
  font-size: 16px;
  margin-bottom: 4px;
  line-height: 1.2;
}

.student-id {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-weight: 500;
  color: #6B7280;
  font-size: 13px;
  line-height: 1.2;
}

.attendance-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
  font-size: 14px;
  flex-shrink: 0;
}

.time-icon {
  color: #9CA3AF;
  font-size: 16px;
  transition: all 0.3s ease;
}

.time-text {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-weight: 500;
  font-size: 13px;
  color: #6B7280;
}

@media (max-width: 768px) {
  .record-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 0 16px 16px;
  }
  
  .attendance-time {
    align-self: flex-end;
    margin-top: 8px;
  }
  
  .time-period-indicator {
    padding: 10px 16px 6px;
    font-size: 11px;
  }
  
  .student-avatar {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .student-name {
    font-size: 15px;
  }
  
  .student-id {
    font-size: 12px;
  }
  
  .time-text {
    font-size: 12px;
  }
  
  .attendance-record-item {
    margin-bottom: 12px;
  }
}


</style>


