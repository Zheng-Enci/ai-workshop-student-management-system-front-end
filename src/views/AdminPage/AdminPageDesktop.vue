<template>
  <!-- 身份验证界面 -->
  <div v-if="!isAuthenticated" class="auth-section">
    <div class="auth-page-header">
      <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="auth-logo" @click="toggleTheme" title="切换主题模式">
    </div>
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-icon-container">
          <el-icon class="auth-icon"><Key /></el-icon>
          <div class="icon-ring"></div>
        </div>
        <h2>身份验证</h2>
        <p>请输入特殊密码以访问管理员功能</p>
        <div class="auth-status-indicator">
          <div class="status-icon">
            <div class="status-dot"></div>
            <div class="status-pulse"></div>
          </div>
          <span class="status-text">等待验证</span>
          <div class="status-animation">
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      <div class="auth-form">
        <div class="input-container">
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
        </div>
        <el-button 
          type="primary" 
          size="large" 
          @click="authenticate"
          :loading="authLoading"
          class="auth-button"
        >
          <span>验证身份</span>
        </el-button>
      </div>
      <div v-if="authError" class="error-message">
        <el-icon><Warning /></el-icon>
        {{ authError }}
      </div>
    </div>
  </div>

  <!-- 加载界面 -->
  <div v-else-if="!isDataLoaded" class="admin-loading">
    <div class="loading-page-header">
      <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="loading-logo" @click="toggleTheme" title="切换主题模式">
    </div>
    <div class="loading-container">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <div class="loading-text">数据加载中，请稍候...</div>
      <div class="loading-progress">
        <div class="progress-bar" :style="{ width: loadingProgress + '%' }"></div>
      </div>
      <div class="loading-status">{{ loadingStatus }}</div>
    </div>
  </div>
  
  <!-- 管理控制台界面 -->
  <div v-else class="admin-console">
    <div class="admin-header">
      <div class="header-left">
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo" @click="toggleTheme" title="切换主题模式">
        <div class="title-section">
          <h1>超级管理员控制台</h1>
          <p>Super Admin Console</p>
        </div>
      </div>
      <div class="header-right">
        <el-button @click="logout" type="danger" size="small" class="logout-btn">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </div>
    
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

      <div class="students-cards-container">
        <div class="student-card" v-for="student in filteredStudents" :key="student.studentId" :data-level="studentLevels[student.studentId] || 0" :style="{ display: (parseInt(studentLevels[student.studentId] || 0) === parseInt(activeLevelTab)) ? 'block' : 'none' }">
          <div class="student-main-row">
            <div class="student-avatar" :class="{ 'has-avatar': student.hasAvatar && student.avatarUrl, 'no-avatar': !student.hasAvatar || !student.avatarUrl }">
              <img v-if="student.hasAvatar && student.avatarUrl" :src="student.avatarUrl" alt="头像" class="avatar-image" @error="handleAvatarError(student)" />
              <span v-else class="avatar-text">{{ student.name.charAt(0) }}</span>
            </div>
            <div class="student-primary-info">
              <div class="student-name">{{ student.name }}</div>
              <div class="student-id">{{ student.studentId }}</div>
            </div>
            <div class="attendance-count">
              <el-icon class="attendance-icon"><Calendar /></el-icon>
              <span class="count-text">{{ studentAttendanceCounts[student.studentId] || 0 }}次</span>
            </div>
            <div class="points-info">
              <div class="points-summary">
                <span class="points-total">总积分: {{ (studentPoints[student.studentId] && studentPoints[student.studentId].totalPoints) || 0 }}</span>
              </div>
              <div class="points-details">
                <span class="points-type">签到: {{ (studentPoints[student.studentId] && studentPoints[student.studentId].attendancePoints) || 0 }}</span>
                <span class="points-type">活动: {{ (studentPoints[student.studentId] && studentPoints[student.studentId].activityPoints) || 0 }}</span>
              </div>
            </div>
          </div>
          
          <div class="student-detail-row">
            <div class="student-details">
              <div class="detail-item">
                <span class="label">年级：</span>
                <span class="value">{{ student.grade }}年级</span>
              </div>
              <div class="detail-item">
                <span class="label">专业：</span>
                <span class="value">{{ student.major }}</span>
              </div>
              <div class="detail-item">
                <span class="label">班级：</span>
                <span class="value">{{ student.classNum }}班</span>
              </div>
              <div class="detail-item">
                <span class="label">性别：</span>
                <span class="value">{{ student.gender }}</span>
              </div>
              <div class="detail-item">
                <span class="label">手机：</span>
                <span class="value">{{ student.phoneNumber }}</span>
              </div>
            </div>
            <div class="student-actions">
              <el-button 
                type="success" 
                size="small" 
                @click="openAttendanceRecordsDialog(student)"
                class="records-btn"
              >
                <el-icon><Calendar /></el-icon>
                考勤记录
              </el-button>
              <el-button 
                type="warning" 
                size="small" 
                @click="openMakeupDialog(student)"
                class="makeup-btn"
              >
                <el-icon><Clock /></el-icon>
                补卡
              </el-button>
              <el-button 
                type="info" 
                size="small" 
                @click="openHeatmapDialog(student)"
                class="heatmap-btn"
              >
                <el-icon><TrendCharts /></el-icon>
                热力图
              </el-button>
              <el-button 
                type="primary" 
                size="small" 
                @click="openTrendDialog(student)"
                class="trend-btn"
              >
                <el-icon><TrendCharts /></el-icon>
                趋势图
              </el-button>
              <el-button 
                type="success" 
                size="small" 
                @click="openPointsDialog(student)"
                class="points-btn"
              >
                <el-icon><Edit /></el-icon>
                修改积分
              </el-button>
              <el-button 
                type="info" 
                size="small" 
                @click="openScoreChangeRecordsDialog(student)"
                class="score-records-btn"
              >
                <el-icon><Document /></el-icon>
                改分记录
              </el-button>
            </div>
          </div>
          
          <div class="student-management-row">
            <div class="level-management">
              <span class="management-label">学生等级：</span>
              <el-select
                :model-value="studentLevels[student.studentId] || 0"
                @change="(value) => changeLevel(student.studentId, value)"
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
            </div>
            <div class="admin-management">
              <span class="management-label">所属管理员：</span>
              <div v-if="(studentLevels[student.studentId] || 0) === 3" class="admin-level-notice">
                <el-icon class="admin-icon"><UserFilled /></el-icon>
                <span>管理员身份</span>
              </div>
              <div v-else-if="adminOptions.length === 0" class="no-admin-available">
                <el-icon class="warning-icon"><Warning /></el-icon>
                <span>暂无可用的管理员</span>
              </div>
              <div v-else>
                <el-select
                  :model-value="studentAdmins[student.studentId]?.adminStudentId || ''"
                  @change="(value) => changeAdmin(student.studentId, value)"
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
            </div>
            <div class="edit-action">
              <el-tooltip content="编辑学生信息" placement="top">
                <el-button
                  type="primary"
                  size="small"
                  @click="openEditDialog(student)"
                  :loading="isLoading"
                  class="edit-btn"
                >
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
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
    
    <div class="admin-footer">
      <div class="footer-content">
        <div class="footer-left">
          <span>人工智能创作坊学生管理系统</span>
        </div>
        <div class="footer-right">
          <span>超级管理员模式</span>
        </div>
      </div>
    </div>

    <el-dialog
      v-if="editDialogVisible"
      v-model="editDialogVisible"
      title="修改学生信息"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :teleported="true"
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
      v-if="todayAttendanceDialogVisible"
      v-model="todayAttendanceDialogVisible"
      title="今日签到记录"
      width="800px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :teleported="true"
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
      v-if="attendanceRecordsDialogVisible"
      v-model="attendanceRecordsDialogVisible"
      :title="`${currentStudentInfo.name} 的考勤记录`"
      width="900px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
      :teleported="true"
      modal-class="attendance-records-overlay"
      class="attendance-records-dialog"
      @close="closeAttendanceRecordsDialog"
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
            <span class="summary-value">{{ allStudentAttendanceRecords.length }}</span>
          </div>
        </div>
      </div>
      
      <div class="attendance-records-container">
        <el-calendar v-model="calendarValue" :locale="zhCn" class="attendance-calendar-admin attendance-fullcalendar">
          <template #header="{ date }">
            <div class="calendar-header-admin">
              <div class="header-title-admin">{{ formatCalendarTitle(date) }}</div>
              <div class="header-actions-admin">
                <el-button size="small" @click="prevMonth">上个月</el-button>
                <el-button size="small" @click="goToday">今天</el-button>
                <el-button size="small" @click="nextMonth">下个月</el-button>
              </div>
            </div>
          </template>
          <template #date-cell="{ data }">
            <div class="calendar-cell-admin" @click="openDateDetails(data.day)">
              <div class="cell-date-admin">{{ data.day.split('-')[2] }}</div>
              <div class="time-slot-status-admin">
                <span
                  v-for="slot in calendarSlots"
                  :key="slot.key"
                  class="time-slot-admin"
                  :class="{ signed: isSlotSigned(data.day, slot.key) }"
                >
                  <span class="time-label-admin">{{ slot.label }}</span>
                </span>
              </div>
            </div>
          </template>
        </el-calendar>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeAttendanceRecordsDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-if="showDateDetailsDialog"
      v-model="showDateDetailsDialog"
      title="签到详情"
      width="400px"
      class="date-details-dialog-admin"
      destroy-on-close
      :close-on-click-modal="false"
      :append-to-body="true"
      :teleported="true"
    >
      <div class="date-details-content-admin" @click.stop>
        <div class="selected-date-admin">{{ formatDateForDisplay(selectedDate) }}</div>
        <div class="attendance-times-admin">
          <div v-if="getDateAttendanceTimes(selectedDate).length === 0" class="no-attendance-admin">
            该日期无签到记录
          </div>
          <div v-else>
            <div v-for="(time, index) in getDateAttendanceTimes(selectedDate)" :key="index" class="attendance-time-item-admin">
              <el-icon class="time-icon-admin"><Clock /></el-icon>
              <span class="time-text-admin">{{ formatAttendanceTime(time) }}</span>
              <span class="time-slot-label-admin">{{ getTimeSlotLabel(time) }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-if="heatmapDialogVisible"
      v-model="heatmapDialogVisible"
      :title="`${currentStudentInfo.name} 的签到热力图`"
      width="1200px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :teleported="true"
      :destroy-on-close="true"
      modal-class="heatmap-overlay"
      class="heatmap-dialog"
      @close="closeHeatmapDialog"
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
            <span class="summary-value">{{ allStudentAttendanceRecords.length }}</span>
          </div>
        </div>
      </div>
      
      <div class="chart-container">
        <div class="chart-item-admin">
          <div class="chart-title-admin">签到热力图</div>
          <div ref="heatmapChart" class="chart-content-admin"></div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeHeatmapDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-if="trendDialogVisible"
      v-model="trendDialogVisible"
      :title="`${currentStudentInfo.name} 的签到趋势图`"
      width="1200px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :teleported="true"
      :destroy-on-close="true"
      modal-class="trend-overlay"
      class="trend-dialog"
      @close="closeTrendDialog"
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
            <span class="summary-value">{{ allStudentAttendanceRecords.length }}</span>
          </div>
        </div>
      </div>
      
      <div class="chart-container">
        <div class="chart-item-admin">
          <div class="chart-title-admin">签到趋势图</div>
          <div ref="lineChart" class="chart-content-admin"></div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeTrendDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-if="makeupDialogVisible"
      v-model="makeupDialogVisible"
      :title=null
      :close-on-click-modal="false"
      class="makeup-dialog"
      :show-close="false"
      :modal="true"
      :append-to-body="true"
      :teleported="true"
      modal-class="makeup-overlay"
      :destroy-on-close="true"
    >
      <div class="makeup-header">
        <div class="header-icon">
          <el-icon size="28"><Clock /></el-icon>
        </div>
        <div class="header-content">
          <h3>学生补卡</h3>
          <p>为指定学生进行补卡操作</p>
        </div>
      </div>
      
      <div class="makeup-content">
        <div class="student-info-card">
          <div class="student-avatar">
            <el-icon size="36"><User /></el-icon>
          </div>
          <div class="student-details">
            <div class="student-name">{{ makeupSelectedStudent?.name }}</div>
            <div class="student-id">{{ makeupSelectedStudent?.studentId }}</div>
            <div class="student-grade">{{ makeupSelectedStudent?.grade }}年级 · {{ makeupSelectedStudent?.major }}</div>
          </div>
        </div>
        
        <div v-if="makeupStep === 'date'" class="makeup-step-content">
          <div class="step-title">第一步：选择补卡日期</div>
          <div class="date-shortcuts">
            <el-button
              v-for="shortcut in datetimeShortcuts"
              :key="shortcut.key"
              size="small"
              :type="isDatetimeShortcutSelected(shortcut) ? 'primary' : 'default'"
              @click="selectDatetimeShortcut(shortcut)"
              class="date-shortcut-btn"
            >
              <el-icon><Clock /></el-icon>
              <span>{{ shortcut.label }}</span>
            </el-button>
          </div>
          <el-form
            ref="makeupFormRef"
            :model="makeupForm"
            :rules="makeupDateFormRules"
            label-width="100px"
            class="makeup-form-content"
          >
            <el-form-item label="选择日期" prop="selectedDate">
              <el-date-picker
                ref="datePickerRef"
                v-model="makeupForm.selectedDate"
                type="date"
                :locale="zhCn"
                placeholder="请选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                class="makeup-date-picker"
                popper-class="makeup-date-picker-popper"
                clearable
                @change="handleDateChange"
                style="width: 100%"
              >
                <template #prefix-icon>
                  <el-icon><Calendar /></el-icon>
                </template>
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        
        <div v-if="makeupStep === 'hour'" class="makeup-step-content">
          <div class="step-title">第二步：选择补卡时间</div>
          <div class="selected-date-display">
            <el-icon><Calendar /></el-icon>
            <span>已选择日期：{{ formatSelectedDate() }}</span>
          </div>
          <div class="hour-buttons-group">
            <div class="hour-label">选择时间：</div>
            <div class="hour-buttons-container">
              <template v-for="(slot, slotIndex) in timeSlots" :key="slot.key">
                <div class="time-slot-buttons" :data-slot="slot.key">
                  <div class="time-slot-label">{{ slot.label }}</div>
              <el-button
                    v-for="hour in slot.hours"
                :key="hour"
                size="small"
                :type="isHourSelected(hour) ? 'primary' : 'default'"
                @click="selectHour(hour)"
                class="hour-btn"
              >
                {{ String(hour).padStart(2, '0') }}:00
              </el-button>
                </div>
                <div v-if="slotIndex < timeSlots.length - 1" class="time-slot-divider"></div>
              </template>
            </div>
            <div class="form-tip">
              <el-icon><Warning /></el-icon>
              <span>补卡时间必须在有效签到时间段内（早上 08:00-11:00、下午 14:00-17:00、晚上 19:00-22:00），且不能晚于当前时间</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="makeup-footer">
        <el-button 
          @click="cancelMakeup" 
          class="cancel-btn"
          size="large"
        >
          取消
        </el-button>
        <el-button 
          v-if="makeupStep === 'date'"
          type="primary" 
          @click="confirmDateStep"
          :disabled="!makeupForm.selectedDate"
          class="submit-btn"
          size="large"
        >
          确认
        </el-button>
        <el-button 
          v-if="makeupStep === 'hour'"
          type="primary" 
          @click="submitMakeup" 
          :loading="makeupLoading"
          :disabled="makeupForm.selectedHour === null"
          class="submit-btn"
          size="large"
        >
          <el-icon v-if="!makeupLoading"><Clock /></el-icon>
          {{ makeupLoading ? '处理中...' : '确认补卡' }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-if="pointsDialogVisible"
      v-model="pointsDialogVisible"
      title="修改积分"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :teleported="true"
      modal-class="points-dialog-overlay"
      class="points-dialog"
      @close="handlePointsDialogClose"
    >
      <div v-if="pointsSelectedStudent" class="points-student-info">
        <div class="student-info-card">
          <div class="student-avatar-card">
            {{ pointsSelectedStudent.name.charAt(0) }}
          </div>
          <div class="student-info-details">
            <div class="student-name-card">{{ pointsSelectedStudent.name }}</div>
            <div class="student-id-card">学号：{{ pointsSelectedStudent.studentId }}</div>
            <div class="student-major-card">{{ pointsSelectedStudent.major }} | {{ pointsSelectedStudent.grade }}年级</div>
          </div>
        </div>
      </div>
      <el-form
        ref="pointsFormRef"
        :model="pointsForm"
        :rules="pointsFormRules"
        label-width="100px"
        class="points-form"
      >
        <el-form-item label="积分变动" prop="changePoints">
          <el-input-number
            v-model="pointsForm.changePoints"
            :min="-9999"
            :max="9999"
            placeholder="请输入积分变动值（正数为加分，负数为扣分）"
            style="width: 100%"
          />
          <div class="form-tip">
            <el-icon><Warning /></el-icon>
            <span>正数表示加分，负数表示扣分</span>
          </div>
        </el-form-item>
        <el-form-item label="改分理由" prop="adjustReason">
          <el-input
            v-model="pointsForm.adjustReason"
            type="textarea"
            :rows="4"
            placeholder="请输入详细的改分理由（最多500字符）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelPoints" :disabled="pointsLoading">取消</el-button>
          <el-button type="primary" @click="confirmPoints" :loading="pointsLoading">
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 改分记录查看弹窗 -->
    <el-dialog
      v-if="scoreChangeRecordsDialogVisible"
      v-model="scoreChangeRecordsDialogVisible"
      :title="`${currentScoreChangeRecordsStudent?.name || '学生'} 的改分记录`"
      width="900px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
      :teleported="true"
      modal-class="score-change-records-overlay"
      class="score-change-records-dialog"
      @close="closeScoreChangeRecordsDialog"
    >
      <div class="student-info-header">
        <div class="student-avatar-large">
          {{ currentScoreChangeRecordsStudent?.name?.charAt(0) || '学' }}
        </div>
        <div class="student-info">
          <h3>{{ currentScoreChangeRecordsStudent?.name || '学生' }}</h3>
          <p>学号：{{ currentScoreChangeRecordsStudent?.studentId }}</p>
          <p v-if="currentScoreChangeRecordsStudent?.major && currentScoreChangeRecordsStudent?.grade">
            专业：{{ currentScoreChangeRecordsStudent.major }} | 年级：{{ currentScoreChangeRecordsStudent.grade }}年级
          </p>
        </div>
        <div class="attendance-summary">
          <div class="summary-item">
            <span class="summary-label">总记录数</span>
            <span class="summary-value">{{ scoreChangeRecords.length }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">总调整分数</span>
            <span class="summary-value" :class="{ positive: totalScoreChangePoints >= 0, negative: totalScoreChangePoints < 0 }">
              {{ totalScoreChangePoints > 0 ? `+${totalScoreChangePoints}` : totalScoreChangePoints }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-if="scoreChangeRecordsLoading" class="records-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="scoreChangeRecords.length === 0" class="records-empty">
        <el-icon><Box /></el-icon>
        <span>暂无改分记录</span>
      </div>
      <div v-else class="score-change-records-container">
        <div class="records-grid">
          <div
            v-for="(record, index) in sortedScoreChangeRecords"
            :key="index"
            class="record-card"
          >
            <div class="record-header">
              <span class="record-time">{{ formatTime(record.createTime) }}</span>
              <span class="record-points-badge" :class="{ positive: record.adjustPoints >= 0, negative: record.adjustPoints < 0 }">
                {{ record.adjustPoints > 0 ? `+${record.adjustPoints}` : record.adjustPoints }}
              </span>
            </div>
            <div class="record-reason-text">{{ record.adjustReason }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeScoreChangeRecordsDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useAdminPage } from './AdminPage.js'
import { onMounted, watch } from 'vue'
import "./css/AdminPageDesktop.css"
// Element Plus Components
import {
  ElMessage,
  ElIcon,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElDatePicker,
  ElTabs,
  ElTabPane,
  ElTag,
  ElTooltip,
  ElPagination,
  ElCalendar,
} from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-input-number.css'
import 'element-plus/theme-chalk/el-date-picker.css'
import 'element-plus/theme-chalk/el-date-picker-panel.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-pagination.css'
import 'element-plus/theme-chalk/el-tooltip.css'
import 'element-plus/theme-chalk/el-button-group.css'
import 'element-plus/theme-chalk/el-calendar.css'
import 'element-plus/theme-chalk/el-tabs.css'
import 'element-plus/theme-chalk/el-tab-pane.css'
import 'element-plus/theme-chalk/el-tag.css'
// Icon Components
import {
  User,
  Calendar,
  TrendCharts,
  Search,
  Refresh,
  SwitchButton,
  Edit,
  UserFilled,
  Clock,
  Warning,
  Document,
  Loading,
  Box,
  Key,
  Lock
} from '@element-plus/icons-vue'

const {

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
  

  getLevelStudents,
  changeLevel,
  changeAdmin,
  loadStudentLevels,
  loadStudentAttendanceCounts,
  loadStudentAdmins,
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
  submitMakeup,
  openPointsDialog,
  handlePointsDialogClose,
  cancelPoints,
  confirmPoints,
  openScoreChangeRecordsDialog,
  closeScoreChangeRecordsDialog,
  formatTime,
  loadAllData,
  timeSlots,
  sortedScoreChangeRecords,
  totalScoreChangePoints,
  toggleTheme
} = useAdminPage()









































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


let monthObserver = null



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

</script>
