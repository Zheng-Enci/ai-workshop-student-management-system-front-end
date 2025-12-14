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
        <div class="student-card" v-for="student in currentLevelStudents" :key="student.studentId">
          <div class="student-main-row">
            <div class="student-avatar">
              {{ student.name.charAt(0) }}
            </div>
            <div class="student-primary-info">
              <div class="student-name">{{ student.name }}</div>
              <div class="student-id">{{ student.studentId }}</div>
            </div>
            <div class="attendance-count">
              <el-icon class="attendance-icon"><Calendar /></el-icon>
              <span class="count-text">{{ studentAttendanceCounts[student.studentId] || 0 }}次</span>
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
      :title="null"
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
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElIcon, ElInput, ElButton, ElTabs, ElTabPane, ElTag, ElSelect, ElOption, ElTooltip, ElPagination, ElFormItem, ElInputNumber, ElForm, ElDialog, ElCalendar, ElDatePicker } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-tabs.css'
import 'element-plus/theme-chalk/el-tab-pane.css'
import 'element-plus/theme-chalk/el-tag.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-form.css'
import 'element-plus/theme-chalk/el-form-item.css'
import 'element-plus/theme-chalk/el-pagination.css'
import 'element-plus/theme-chalk/el-tooltip.css'
import 'element-plus/theme-chalk/el-input-number.css'
import 'element-plus/theme-chalk/el-button-group.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-calendar.css'
import 'element-plus/theme-chalk/el-date-picker.css'
import 'element-plus/theme-chalk/el-date-picker-panel.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { User, Calendar, TrendCharts, Search, Refresh, SwitchButton, Edit, UserFilled, Clock, Warning, Document, Loading, Box, Key, Lock } from '@element-plus/icons-vue'
import { getAllStudentsWithSpecialPassword, setStudentLevel, getStudentLevel, updateStudentWithSpecialPassword, getAdminInfo, assignStudentToAdmin } from '@/api/student'
import { getStudentAttendanceCount, getStudentAttendanceRecords, makeupAttendanceWithSpecialPassword } from '@/api/attendance'
import { getDailyAttendanceCount, getMonthlyAttendanceCount, getTodayAttendanceRecords } from '@/api/attendance'
import { createPointsRecord, getAllAdjustRecordsByStudentInfoId } from '@/api/points'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, HeatmapChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
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
const currentStudentInfo = ref({})
const calendarValue = ref(new Date())
const scrollPosition = ref(0)
const allStudentAttendanceRecords = ref([])
const calendarSlots = [
  { key: 'morning', label: '早' },
  { key: 'afternoon', label: '午' },
  { key: 'evening', label: '晚' }
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

// 改分记录查看相关
const scoreChangeRecordsDialogVisible = ref(false)
const scoreChangeRecordsLoading = ref(false)
const scoreChangeRecords = ref([])
const currentScoreChangeRecordsStudent = ref(null)
// 日期时间段快捷选项（包含日期和时间段）
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

// 获取快捷选项的日期值
const getShortcutDate = (shortcut) => {
  const date = new Date()
  date.setDate(date.getDate() + shortcut.dateOffset)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 按早中晚分类的所有可签到时间
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

// 所有可签到时间（扁平化，用于验证）
const validHours = timeSlots.flatMap(slot => slot.hours)
const makeupDateFormRules = {
  selectedDate: [
    { required: true, message: '请选择日期', trigger: 'change' }
  ]
}

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

const pointsFormRules = {
  changePoints: [
    { required: true, message: '请输入积分变动值', trigger: 'blur' },
    { type: 'number', message: '积分变动值必须为数字', trigger: 'blur' }
  ],
  adjustReason: [
    { required: true, message: '请输入改分理由', trigger: 'blur' },
    { max: 500, message: '改分理由不能超过500个字符', trigger: 'blur' }
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
  
  // 立即清理，不延迟
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

const loadAllData = async (adminPassword) => {
  const totalSteps = 5
  
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
    
    updateProgress(5, '数据加载完成！')
    
    setTimeout(() => {
      isDataLoaded.value = true
    }, 500)
    
  } catch (error) {
    ElMessage.error('加载数据失败：' + error.message)
    isAuthenticated.value = false
    adminStore.clearAdminPassword()
  }
}
</script>

<style scoped>
:root {
  --admin-primary-color: #667eea;
  --admin-primary-gradient: linear-gradient(135deg, #667eea, #764ba2);
  --admin-secondary-color: #764ba2;
  --admin-success-color: #67c23a;
  --admin-warning-color: #e6a23c;
  --admin-danger-color: #f56c6c;
  --admin-info-color: #909399;
  
  --admin-bg-primary: #ffffff;
  --admin-bg-secondary: #f8f9fa;
  --admin-bg-tertiary: #e9ecef;
  --admin-text-primary: #1a202c;
  --admin-text-secondary: #2d3748;
  --admin-text-tertiary: #4a5568;
  --admin-border-color: #e2e8f0;
  --admin-shadow-color: rgba(0, 0, 0, 0.1);
  --admin-shadow-hover: rgba(0, 0, 0, 0.15);
  --admin-glass-bg: rgba(255, 255, 255, 0.95);
  --admin-glass-border: rgba(255, 255, 255, 0.3);
  
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --primary-gradient: linear-gradient(135deg, #667eea, #764ba2);
  --glass-bg: rgba(255, 255, 255, 0.95);
  --glass-border: rgba(255, 255, 255, 0.3);
  --shadow-color: rgba(0, 0, 0, 0.1);
  --shadow-hover: rgba(0, 0, 0, 0.15);
  --border-color: #e2e8f0;
  --bg-primary: #ffffff;
  --text-primary: #1a202c;
  --text-secondary: #2d3748;
  --text-tertiary: #4a5568;
  --danger-color: #f56c6c;
}

html.dark {
  --admin-bg-primary: #0f172a;
  --admin-bg-secondary: #1e293b;
  --admin-bg-tertiary: #334155;
  --admin-text-primary: #e2e8f0;
  --admin-text-secondary: #cbd5e1;
  --admin-text-tertiary: #94a3b8;
  --admin-border-color: #334155;
  --admin-shadow-color: rgba(0, 0, 0, 0.4);
  --admin-shadow-hover: rgba(0, 0, 0, 0.6);
  --admin-glass-bg: rgba(15, 23, 42, 0.8);
  --admin-glass-border: rgba(255, 255, 255, 0.1);
  
  --glass-bg: rgba(15, 23, 42, 0.8);
  --glass-border: rgba(255, 255, 255, 0.1);
  --bg-primary: #0f172a;
  --text-primary: #e2e8f0;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --border-color: #334155;
  --danger-color: #f56c6c;
}

/* 身份验证界面样式 */
.auth-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.auth-page-header {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.auth-logo {
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0;
}

.auth-logo:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.auth-section :deep(.el-message--success) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

.auth-section :deep(.el-message--success .el-message__content) {
  color: white !important;
}

.auth-section :deep(.el-message--success .el-icon) {
  color: white !important;
}

.auth-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 25px 50px var(--shadow-color);
  border: 1px solid var(--glass-border);
  max-width: 420px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 32px 64px var(--shadow-hover);
}

.auth-icon-container {
  position: relative;
  margin-bottom: 32px;
}

.auth-icon {
  font-size: 56px;
  color: var(--primary-color);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.auth-icon:hover {
  transform: scale(1.1);
  color: var(--secondary-color);
}

.icon-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.auth-icon-container:hover .icon-ring {
  border-color: var(--primary-color);
  box-shadow: 0 0 20px var(--shadow-color);
}

.auth-status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  padding: 16px 24px;
  background: var(--glass-bg);
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px var(--shadow-color);
  transition: all 0.3s ease;
}

.auth-status-indicator:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px var(--shadow-hover);
}

.status-icon {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--primary-color);
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.status-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: status-pulse 2s ease-in-out infinite;
}

.status-text {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: 0.5px;
}

.status-animation {
  display: flex;
  align-items: center;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: var(--primary-color);
  border-radius: 50%;
  animation: loading-dots 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0s;
}

@keyframes status-pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes loading-dots {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.input-container {
  position: relative;
  margin-bottom: 24px;
}

.password-input {
  position: relative;
  z-index: 2;
  width: 100%;
}

.password-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-primary);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.password-input :deep(.el-input__wrapper:hover) {
  border-color: var(--primary-color);
  box-shadow: 0 6px 20px var(--shadow-color);
}

.password-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--shadow-color);
}

.password-input :deep(.el-input__inner) {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 16px;
}

.password-input :deep(.el-input__inner::placeholder) {
  color: var(--text-tertiary);
  font-weight: 500;
}

.password-input :deep(.el-input__prefix) {
  color: var(--text-secondary);
}

.auth-button {
  position: relative;
  overflow: hidden;
  background: var(--primary-gradient);
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 24px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  font-weight: 600;
  width: 100%;
  height: 52px;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.auth-button:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px var(--shadow-hover);
  color: white;
}

.auth-button:active {
  transform: translateY(0);
  color: white;
}

.auth-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.auth-header p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 600;
  line-height: 1.6;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--danger-color);
  font-size: 14px;
  font-weight: 600;
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(245, 108, 108, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(245, 108, 108, 0.2);
}

.admin-loading {
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

.loading-page-header {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10000;
}

.loading-logo {
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0;
}

.loading-logo:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.loading-container {
  text-align: center;
  color: var(--admin-text-primary);
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top: 4px solid var(--admin-primary-color);
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 60px;
  height: 60px;
  top: 10px;
  left: 10px;
  border-top-color: var(--admin-secondary-color);
  animation-delay: -0.5s;
}

.spinner-ring:nth-child(3) {
  width: 40px;
  height: 40px;
  top: 20px;
  left: 20px;
  border-top-color: var(--admin-success-color);
  animation-delay: -1s;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--admin-text-primary);
}

.loading-progress {
  width: 300px;
  height: 8px;
  background: var(--admin-glass-bg);
  border-radius: 4px;
  margin: 0 auto 15px;
  overflow: hidden;
  border: 1px solid var(--admin-glass-border);
}

.progress-bar {
  height: 100%;
  background: var(--admin-primary-gradient);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.loading-status {
  font-size: 16px;
  color: var(--admin-text-secondary);
  font-weight: 500;
}

.admin-console {
  max-width: 90%;
  margin: 0 auto;
  padding: 40px;
  background: var(--admin-primary-gradient);
  min-height: 100vh;
  position: relative;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 30px;
  border-bottom: 2px solid var(--admin-border-color);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0;
}

.logo:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.title-section h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: var(--admin-text-primary);
}

.title-section p {
  font-size: 14px;
  color: var(--admin-text-secondary);
  margin: 0;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: var(--admin-glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid var(--admin-glass-border);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px var(--admin-shadow-color);
}

.stat-card:hover {
  background: var(--admin-glass-bg);
  transform: translateY(-4px);
  box-shadow: 0 16px 48px var(--admin-shadow-hover);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: var(--admin-glass-bg);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--admin-text-primary);
  border: 1px solid var(--admin-glass-border);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 16px;
  color: var(--admin-text-secondary);
  font-weight: 500;
}

.students-section {
  background: var(--admin-glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid var(--admin-glass-border);
  box-shadow: 0 8px 32px var(--admin-shadow-color);
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
  color: var(--admin-text-primary);
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
  background: var(--admin-glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 12px;
  border: 1px solid var(--admin-glass-border);
  box-shadow: 0 8px 32px var(--admin-shadow-color);
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

.tab-count {
  background: var(--admin-glass-bg);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 800;
  color: var(--admin-text-primary);
  box-shadow: 0 4px 12px var(--admin-shadow-color);
  border: 2px solid var(--admin-glass-border);
  min-width: 32px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.students-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.student-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 8px 32px var(--shadow-color);
  border: 1px solid var(--glass-border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.student-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, var(--admin-glass-bg) 100%);
}

.student-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 60px var(--admin-shadow-hover);
  background: var(--admin-glass-bg);
}

.student-main-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--admin-primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 6px 20px var(--admin-shadow-color);
  border: 2px solid var(--admin-glass-border);
  transition: all 0.3s ease;
}

.student-card:hover .student-avatar {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 10px 30px var(--shadow-hover);
}

.student-primary-info {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
  text-shadow: 0 2px 8px var(--shadow-color);
  letter-spacing: 0.5px;
}

.student-id {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 600;
  text-shadow: 0 1px 4px var(--shadow-color);
}

.attendance-count {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  box-shadow: 0 6px 20px var(--shadow-color);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.attendance-count:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px var(--shadow-hover);
}

.attendance-icon {
  font-size: 16px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.count-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--admin-text-primary);
  text-shadow: 0 2px 8px var(--admin-shadow-color);
}

.student-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.student-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  flex: 1;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  white-space: nowrap;
}

.label {
  color: var(--text-secondary);
  font-weight: 600;
  margin-right: 4px;
  text-shadow: 0 1px 4px var(--shadow-color);
}

.value {
  color: var(--text-primary);
  font-weight: 700;
  text-shadow: 0 1px 4px var(--shadow-color);
}

.student-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.records-btn,
.makeup-btn,
.heatmap-btn,
.trend-btn,
.points-btn {
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  box-shadow: 0 4px 15px var(--shadow-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: 0 1px 4px var(--shadow-color);
}

.records-btn:hover,
.makeup-btn:hover,
.heatmap-btn:hover,
.trend-btn:hover,
.points-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px var(--shadow-hover);
}

.student-management-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid var(--glass-border);
}

.level-management,
.admin-management {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.management-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 600;
  white-space: nowrap;
}

.edit-action {
  flex-shrink: 0;
}

.edit-btn {
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  box-shadow: 0 4px 15px var(--shadow-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: 0 1px 4px var(--shadow-color);
}

.edit-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px var(--shadow-hover);
}

.student-id {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: var(--admin-text-secondary);
}

.student-name {
  font-weight: 600;
  color: var(--admin-text-primary);
}

.phone-number {
  font-family: 'Courier New', monospace;
  color: var(--admin-text-secondary);
  font-weight: 500;
}

.college, .major {
  color: var(--admin-text-primary);
}

.class-num {
  color: var(--admin-text-secondary);
  font-weight: 500;
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
  color: #2c3e50;
  font-size: 12px;
  width: 180px;
}

html.dark .no-admin-available {
  background: linear-gradient(135deg, #2d2419 0%, #3d2f1a 100%);
  border: 1px solid #f59e0b;
  color: #fde68a;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.admin-level-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-radius: 8px;
  border: 1px solid #f44336;
  color: #2c3e50;
  font-size: 12px;
  width: 180px;
  font-weight: 600;
}

html.dark .admin-level-notice {
  background: linear-gradient(135deg, #2d1b1b 0%, #3d2525 100%);
  border: 1px solid #ef4444;
  color: #fecaca;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.warning-icon {
  color: #5a6c7d;
  font-size: 14px;
}

.admin-icon {
  color: #5a6c7d;
  font-size: 14px;
}

html.dark .admin-icon {
  color: #fecaca;
}

.admin-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.option-icon {
  color: #5a6c7d;
  font-size: 14px;
}

html.dark .option-icon {
  color: #cbd5e1;
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
  color: #7f8c8d;
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

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.pagination-info {
  color: #5a6c7d;
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

.edit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.records-btn {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
}

.makeup-btn {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  color: white;
}

.points-btn {
  background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%);
  color: white;
}

.admin-footer {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 40px;
  margin-top: 40px;
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

/* 修改积分弹窗遮罩层样式，禁用过渡动画避免闪烁 */
:deep(.points-dialog-overlay) {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(0, 0, 0, 0.5) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 3000 !important;
  transition: none !important;  /* 禁用过渡动画 */
  animation: none !important;   /* 禁用动画 */
}

:deep(.points-dialog-overlay .el-overlay-dialog) {
  position: fixed !important;
  inset: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 3001 !important;
  transition: none !important;  /* 禁用过渡动画 */
  animation: none !important;   /* 禁用动画 */
}

.points-dialog {
  .el-dialog__header {
    background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%);
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

.points-student-info {
  margin-bottom: 24px;
}

.student-info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e1e8ed;
}

.student-avatar-card {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.student-info-details {
  flex: 1;
  min-width: 0;
}

.student-name-card {
  font-weight: 700;
  font-size: 18px;
  color: #1a202c;
  margin-bottom: 4px;
}

.student-id-card {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.student-major-card {
  font-size: 14px;
  color: #6b7280;
}

.points-form {
  .el-form-item__label {
    font-weight: 600;
    color: #2c3e50;
  }
  
  .el-input__inner,
  .el-textarea__inner {
    border-radius: 8px;
    border: 2px solid #e1e8ed;
    transition: all 0.3s ease;
  }
  
  .el-input__inner:focus,
  .el-textarea__inner:focus {
    border-color: #67c23a;
    box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.2);
  }
  
  .el-input-number {
    width: 100%;
  }
  
  .el-input-number .el-input__inner {
    text-align: left;
  }
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

.form-tip .el-icon {
  font-size: 14px;
  color: #e6a23c;
}

html.dark .points-dialog .el-dialog__body {
  background: var(--admin-bg-secondary);
}

html.dark .student-info-card {
  background: var(--admin-bg-primary);
  border-color: var(--admin-border-color);
}

html.dark .student-name-card {
  color: var(--admin-text-primary);
}

html.dark .student-id-card,
html.dark .student-major-card {
  color: var(--admin-text-secondary);
}

html.dark .points-form .el-form-item__label {
  color: var(--admin-text-primary);
}

html.dark .form-tip {
  color: var(--admin-text-tertiary);
}

:deep(.makeup-overlay),
:deep(.attendance-records-overlay),
:deep(.heatmap-overlay),
:deep(.trend-overlay) {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(0, 0, 0, 0.55) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 3000 !important;
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

:deep(.makeup-overlay .el-overlay-dialog),
:deep(.attendance-records-overlay .el-overlay-dialog),
:deep(.heatmap-overlay .el-overlay-dialog),
:deep(.trend-overlay .el-overlay-dialog) {
  position: fixed !important;
  inset: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 3001 !important;
  transition: none !important;
  animation: none !important;
  transform: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

/* 禁用所有可能的过渡效果 */
:deep(.el-fade-in),
:deep(.el-fade-in-linear),
:deep(.el-zoom-in-center),
:deep(.el-zoom-in-top),
:deep(.el-zoom-in-bottom) {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

.heatmap-dialog,
.trend-dialog,
.attendance-records-dialog {
  .el-dialog__wrapper {
    transition: none !important;
    animation: none !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
  
  .el-dialog {
    transition: none !important;
    animation: none !important;
    transform: none !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
  
  .el-overlay {
    transition: none !important;
    animation: none !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
  
  .el-dialog__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 24px;
    border-radius: 8px 8px 0 0;
    transition: none !important;
    animation: none !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
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
    transition: none !important;
    animation: none !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
  
  .el-dialog__footer {
    background: #f8f9fa;
    padding: 20px 24px;
    border-radius: 0 0 8px 8px;
    transition: none !important;
    animation: none !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
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

.makeup-form-content {
  .el-form-item__label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 14px;
  }
}

.attendance-records-dialog {
  max-height: calc(90vh - 20px);
  
  .el-dialog__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 16px;
    border-radius: 8px 8px 0 0;
  }
  
  .el-dialog__body {
    padding: 16px 12px;
    background: #f8f9fa;
  }
  
  .el-dialog__footer {
    background: #f8f9fa;
    padding: 12px 16px;
    border-radius: 0 0 8px 8px;
  }
}

.student-info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: 10px;
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
}

.student-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.student-info {
  flex: 1;
  min-width: 0;
}

.student-info h3 {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 3px 0;
}

.student-info p {
  font-size: 12px;
  color: #6b7280;
  margin: 1px 0;
  line-height: 1.3;
}

.attendance-summary {
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.summary-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.summary-value {
  font-size: 16px;
  font-weight: 700;
  color: #667eea;
}

.attendance-records-container {
  margin-top: 8px;
}

:deep(.attendance-fullcalendar) {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

:deep(.attendance-fullcalendar .fc-toolbar) {
  margin-bottom: 12px;
}

:deep(.attendance-fullcalendar .fc-daygrid-day) {
  cursor: pointer;
}

:deep(.attendance-fullcalendar .fc-daygrid-day.fc-day-today) {
  background: rgba(102, 126, 234, 0.08);
}

:deep(.attendance-fullcalendar .fc-event) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
  border-radius: 8px;
  padding: 2px 6px;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}

.chart-container {
  margin: 20px 0;
  min-height: 500px;
}

.chart-item-admin {
  background: var(--admin-glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--admin-glass-border);
  box-shadow: 0 8px 32px var(--admin-shadow-color);
}

.chart-title-admin {
  font-size: 16px;
  font-weight: 600;
  color: var(--admin-text-primary);
  margin-bottom: 15px;
  text-align: center;
}

.chart-content-admin {
  width: 100%;
  height: 400px;
}

.calendar-header-admin {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  background-color: var(--admin-bg-primary);
  border-bottom: 1px solid var(--admin-border-color);
}

.calendar-nav-buttons {
  display: flex;
  gap: 8px;
}

.calendar-nav-buttons .el-button {
  background-color: var(--admin-bg-secondary);
  border-color: var(--admin-border-color);
  color: var(--admin-text-primary);
}

.calendar-nav-buttons .el-button:hover {
  background-color: var(--admin-bg-hover);
  border-color: var(--admin-primary-color);
  color: var(--admin-primary-color);
}

.calendar-title-admin {
  font-size: 18px;
  font-weight: 600;
  color: var(--admin-text-primary);
  flex: 1;
  text-align: center;
}

.calendar-cell-admin {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.calendar-cell-admin:hover {
  background-color: var(--admin-bg-secondary);
  border-radius: 4px;
}

.cell-date-admin {
  font-size: 14px;
  font-weight: 600;
  color: var(--admin-text-primary);
  margin-bottom: 4px;
}

.cell-status-admin {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-slot-status-admin {
  display: flex;
  flex-direction: row;
  gap: 2px;
  margin-top: 2px;
  justify-content: center;
}

.time-slot-admin {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px 2px;
  border-radius: 3px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  min-width: 20px;
  width: 20px;
  height: 16px;
  transition: all 0.3s ease;
}

.time-slot-admin.signed {
  background-color: #4caf50;
  border-color: #2e7d32;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.time-label-admin {
  font-size: 8px;
  font-weight: 700;
  color: #666666;
  line-height: 1;
  transition: color 0.3s ease;
}

.time-slot-admin.signed .time-label-admin {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.date-details-dialog-admin .el-dialog__body {
  padding: 20px;
}

.date-details-content-admin {
  text-align: center;
}

.selected-date-admin {
  font-size: 18px;
  font-weight: 600;
  color: var(--admin-text-primary);
  background-color: var(--admin-bg-secondary);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.attendance-times-admin {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.no-attendance-admin {
  color: var(--admin-text-tertiary);
  font-style: italic;
}

.attendance-time-item-admin {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  background-color: var(--admin-bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--admin-border-color);
}

.time-icon-admin {
  color: var(--admin-success-color);
  font-size: 16px;
}

.time-text-admin {
  font-size: 16px;
  font-weight: 500;
  color: var(--admin-text-primary);
  font-family: 'Courier New', monospace;
}

.time-slot-label-admin {
  font-size: 12px;
  color: var(--admin-text-secondary);
  background-color: var(--admin-bg-tertiary);
  padding: 2px 6px;
  border-radius: 3px;
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
  background: linear-gradient(90deg, var(--success-color) 0%, var(--success-color) 100%);
}

.attendance-record-item.afternoon::before {
  background: linear-gradient(90deg, var(--warning-color) 0%, var(--warning-color) 100%);
}

.attendance-record-item.evening::before {
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-color) 100%);
}

.attendance-record-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
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
  color: var(--success-color);
}

.time-period-indicator.afternoon {
  color: var(--warning-color);
}

.time-period-indicator.evening {
  color: var(--primary-color);
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
  background: linear-gradient(135deg, var(--success-color) 0%, var(--success-color) 100%);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

.student-avatar.afternoon {
  background: linear-gradient(135deg, var(--warning-color) 0%, var(--warning-color) 100%);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
}

.student-avatar.evening {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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


html.dark .attendance-record-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

html.dark .attendance-record-item:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

html.dark .time-period-indicator.morning {
  color: var(--success-color);
}

html.dark .time-period-indicator.afternoon {
  color: var(--warning-color);
}

html.dark .time-period-indicator.evening {
  color: var(--primary-color);
}

html.dark .student-name {
  color: var(--text-primary);
}

html.dark .student-id {
  color: var(--text-secondary);
}

html.dark .time-text {
  color: var(--text-secondary);
}

html.dark .time-icon {
  color: var(--text-tertiary);
}

html.dark .student-avatar.morning {
  background: linear-gradient(135deg, var(--success-color) 0%, var(--success-color) 100%);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

html.dark .student-avatar.afternoon {
  background: linear-gradient(135deg, var(--warning-color) 0%, var(--warning-color) 100%);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
}

html.dark .student-avatar.evening {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.attendance-calendar-admin {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--admin-border-color);
}

.calendar-header-admin {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background-color: var(--admin-bg-primary);
  border-bottom: 1px solid var(--admin-border-color);
}

.header-title-admin {
  font-size: 15px;
  font-weight: 600;
  color: var(--admin-text-primary);
}

.header-actions-admin {
  display: flex;
  gap: 8px;
}

.attendance-calendar-admin :deep(.el-calendar__body) {
  padding: 0;
}

.attendance-calendar-admin :deep(.el-calendar-table thead th) {
  font-size: 0;
}

.attendance-calendar-admin :deep(.el-calendar-table thead th:nth-child(1))::after {
  content: '周日';
  font-size: 14px;
}

.attendance-calendar-admin :deep(.el-calendar-table thead th:nth-child(2))::after {
  content: '周一';
  font-size: 14px;
}

.attendance-calendar-admin :deep(.el-calendar-table thead th:nth-child(3))::after {
  content: '周二';
  font-size: 14px;
}

.attendance-calendar-admin :deep(.el-calendar-table thead th:nth-child(4))::after {
  content: '周三';
  font-size: 14px;
}

.attendance-calendar-admin :deep(.el-calendar-table thead th:nth-child(5))::after {
  content: '周四';
  font-size: 14px;
}

.attendance-calendar-admin :deep(.el-calendar-table thead th:nth-child(6))::after {
  content: '周五';
  font-size: 14px;
}

.attendance-calendar-admin :deep(.el-calendar-table thead th:nth-child(7))::after {
  content: '周六';
  font-size: 14px;
}

.attendance-calendar-admin :deep(.el-calendar-table td) {
  vertical-align: top;
}

.calendar-cell-admin {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
  min-height: 60px;
  cursor: pointer;
}

.calendar-cell-admin:hover {
  background: var(--admin-bg-secondary);
}

.cell-date-admin {
  font-size: 13px;
  font-weight: 700;
  color: var(--admin-text-primary);
}

html.dark .student-info-header {
  background: var(--admin-bg-primary);
  border-color: var(--admin-border-color);
}

html.dark .student-info h3 {
  color: var(--admin-text-primary);
}

html.dark .student-info p {
  color: var(--admin-text-secondary);
}

html.dark .summary-label {
  color: var(--admin-text-secondary);
}

html.dark .summary-value {
  color: var(--admin-primary-color);
}

html.dark .attendance-calendar-admin {
  background-color: var(--admin-bg-primary) !important;
  color: var(--admin-text-primary) !important;
}

html.dark .calendar-header-admin {
  background-color: var(--admin-bg-primary) !important;
  border-bottom-color: var(--admin-border-color) !important;
}

html.dark .header-title-admin {
  color: var(--admin-text-primary) !important;
}

html.dark .attendance-calendar-admin :deep(.el-calendar__header) {
  background-color: var(--admin-bg-primary) !important;
  color: var(--admin-text-primary) !important;
  border-bottom-color: var(--admin-border-color) !important;
}

html.dark .attendance-calendar-admin :deep(.el-calendar__title) {
  color: var(--admin-text-primary) !important;
}

html.dark .attendance-calendar-admin :deep(.el-calendar__button-group) {
  background-color: var(--admin-bg-primary) !important;
}

html.dark .attendance-calendar-admin :deep(.el-button) {
  background-color: var(--admin-bg-secondary) !important;
  border-color: var(--admin-border-color) !important;
  color: var(--admin-text-primary) !important;
}

html.dark .attendance-calendar-admin :deep(.el-button:hover) {
  background-color: var(--admin-bg-tertiary) !important;
  border-color: var(--admin-primary-color) !important;
  color: var(--admin-text-primary) !important;
}

html.dark .attendance-calendar-admin :deep(.el-calendar-table) {
  background-color: var(--admin-bg-primary) !important;
}

html.dark .attendance-calendar-admin :deep(.el-calendar-table thead th) {
  background-color: var(--admin-bg-secondary) !important;
  color: var(--admin-text-primary) !important;
  border-color: var(--admin-border-color) !important;
}

html.dark .attendance-calendar-admin :deep(.el-calendar-table tbody td) {
  background-color: var(--admin-bg-primary) !important;
  border-color: var(--admin-border-color) !important;
}

html.dark .attendance-calendar-admin :deep(.el-calendar-table tbody td:hover) {
  background-color: var(--admin-bg-secondary) !important;
}

html.dark .attendance-calendar-admin :deep(.el-calendar-table tbody td.is-today) {
  background-color: rgba(102, 126, 234, 0.2) !important;
}

html.dark .attendance-calendar-admin :deep(.el-calendar-table tbody td.is-selected) {
  background-color: rgba(102, 126, 234, 0.3) !important;
}

html.dark .attendance-calendar-admin :deep(.el-calendar-day) {
  color: var(--admin-text-primary) !important;
}

html.dark .calendar-container {
  background: var(--admin-glass-bg);
  border: 1px solid var(--admin-glass-border);
}

html.dark .no-records-overlay {
  background: rgba(30, 30, 30, 0.95);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

html.dark .no-records-overlay .no-records-icon {
  color: var(--admin-text-secondary-dark);
}

html.dark .no-records-overlay p {
  color: var(--admin-text-primary-dark);
}

html.dark .calendar-header-admin {
  background-color: var(--admin-bg-primary-dark);
  border-bottom-color: var(--admin-border-color-dark);
}

html.dark .calendar-nav-buttons .el-button {
  background-color: var(--admin-bg-secondary-dark);
  border-color: var(--admin-border-color-dark);
  color: var(--admin-text-primary-dark);
}

html.dark .calendar-nav-buttons .el-button:hover {
  background-color: var(--admin-bg-hover-dark);
  border-color: var(--admin-primary-color-dark);
  color: var(--admin-primary-color-dark);
}

html.dark .calendar-title-admin {
  color: var(--admin-text-primary-dark);
}

html.dark .calendar-legend {
  background: var(--admin-bg-secondary);
  border: 1px solid var(--admin-border-color);
}

html.dark .legend-item {
  color: var(--admin-text-secondary);
}

html.dark .time-slot-admin {
  background-color: #2a2a2a;
  border-color: #404040;
}

html.dark .time-slot-admin.signed {
  background-color: #4caf50;
  border-color: #2e7d32;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.4);
}

html.dark .time-label-admin {
  color: #cccccc;
}

html.dark .time-slot-admin.signed .time-label-admin {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* v-cloak指令样式，防止模板编译过程中的闪烁 */
[v-cloak] {
  display: none !important;
}

/* 完全禁用弹窗过渡动画，避免闪烁 */
.el-dialog__wrapper {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

.el-dialog {
  transition: none !important;
  animation: none !important;
  transform: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

.el-overlay {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

.el-dialog__body {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

.el-dialog__header {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

.el-dialog__footer {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

/* 禁用 BaseTransition 组件的过渡动画 */
.el-fade-in,
.el-fade-in-linear,
.el-zoom-in-center,
.el-zoom-in-top,
.el-zoom-in-bottom {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

/* 禁用所有可能的过渡类 */
[class*="el-fade"],
[class*="el-zoom"],
[class*="transition"] {
  transition: none !important;
  animation: none !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}

.makeup-dialog {
  --el-dialog-width: 550px;
  width: 28%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.makeup-dialog .el-dialog__body {
  padding: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.makeup-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-content h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 700;
}

.header-content p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.makeup-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.date-shortcuts {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.date-shortcut-btn {
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-shortcut-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
  color: #667eea;
}

.date-shortcut-btn.el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

.date-shortcut-btn.el-button--primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.student-info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
}

.student-avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.student-details {
  flex: 1;
}

.student-name {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.student-id {
  font-size: 14px;
  color: #6b7280;
  font-family: 'Courier New', monospace;
  margin-bottom: 4px;
}

.student-grade {
  font-size: 13px;
  color: #9ca3af;
}

.makeup-step-content {
  padding: 20px 0;
}

.step-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
  text-align: center;
}

.selected-date-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  margin-bottom: 24px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  color: #0369a1;
  font-size: 16px;
  font-weight: 500;
}

.selected-date-display .el-icon {
  font-size: 20px;
}

.hour-buttons-group {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.hour-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  font-weight: 500;
}

.hour-buttons-container {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  padding: 24px;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border-radius: 16px;
  border: 2px solid #e5e7eb;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.time-slot-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.time-slot-label {
  min-width: 50px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-right: 12px;
  text-align: right;
  flex-shrink: 0;
}

.time-slot-divider {
  width: 1px;
  height: 36px;
  background: linear-gradient(to bottom, transparent, #d1d5db, transparent);
  margin: 0 20px;
  flex-shrink: 0;
}


.hour-btn {
  min-width: 80px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  padding: 12px 20px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #374151;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.hour-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.hour-btn:hover::before {
  left: 100%;
}

.hour-btn:hover {
  border-color: #F59E0B;
  color: #F59E0B;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25), 0 2px 4px rgba(245, 158, 11, 0.15);
  background: linear-gradient(135deg, #fff5e6 0%, #fffbf0 100%);
}

.hour-btn.el-button--primary {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  border-color: #F59E0B;
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35), 0 2px 6px rgba(245, 158, 11, 0.2);
  position: relative;
}

.hour-btn.el-button--primary::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  border-radius: 12px;
  pointer-events: none;
}

.hour-btn.el-button--primary:hover {
  background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4), 0 3px 8px rgba(245, 158, 11, 0.25);
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 8px;
  color: #92400e;
  font-size: 13px;
}

.form-tip .el-icon {
  font-size: 16px;
}

.makeup-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
  background: white;
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: #f8f9fa;
}

.cancel-btn {
  border-radius: 8px;
}

.submit-btn {
  border-radius: 8px;
}

.makeup-form-content .el-form-item__label {
  font-weight: 600;
  color: #2c3e50;
}

.makeup-form-content .el-input__inner,
.makeup-form-content .el-select .el-input__inner {
  border-radius: 8px;
  border: 2px solid #e1e8ed;
  transition: all 0.3s ease;
}

.makeup-form-content .el-input__inner:focus,
.makeup-form-content .el-select .el-input__inner:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

html.dark .student-info-card {
  background: #1e293b;
  border-color: #334155;
}

html.dark .student-name {
  color: #e2e8f0;
}

html.dark .student-id {
  color: #cbd5e1;
}

html.dark .student-grade {
  color: #94a3b8;
}

html.dark .step-title {
  color: #e2e8f0;
}

html.dark .selected-date-display {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

html.dark .hour-buttons-group {
  background: #1e293b;
  border-color: #334155;
}

html.dark .hour-label {
  color: #cbd5e1;
}

html.dark .hour-buttons-container {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: #334155;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

html.dark .time-slot-divider {
  background: linear-gradient(to bottom, transparent, #475569, transparent);
}

html.dark .time-slot-label {
  color: #e2e8f0;
}

html.dark .hour-btn {
  background: #2a2a2a;
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

html.dark .hour-btn:hover {
  border-color: #F59E0B;
  color: #F59E0B;
  background: #2a2a2a;
}

html.dark .hour-btn.el-button--primary {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  border-color: #F59E0B;
  color: white;
}

html.dark .hour-btn.el-button--primary:hover {
  background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
}

html.dark .date-shortcut-btn {
  background: #2a2a2a;
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

html.dark .date-shortcut-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: #2a2a2a;
}

html.dark .date-shortcut-btn.el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

html.dark .hour-btn:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: #F59E0B;
  color: #F59E0B;
}

html.dark .form-tip {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
  color: #fde68a;
}

html.dark .makeup-footer {
  background: #1e293b;
  border-top-color: #334155;
}

html.dark .makeup-content {
  background: transparent;
}

html.dark .makeup-form-content .el-form-item__label {
  color: #e2e8f0;
}

html.dark .makeup-form-content .el-input__inner,
html.dark .makeup-form-content .el-select .el-input__inner {
  background: #2a2a2a;
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

html.dark .makeup-form-content .el-input__inner:focus,
html.dark .makeup-form-content .el-select .el-input__inner:focus {
  border-color: #667eea;
}

.makeup-date-picker-popper {
  min-width: 750px !important;
  background-color: #ffffff !important;
  opacity: 1 !important;
  z-index: 2001 !important;
  max-width: 800px !important;
  pointer-events: auto !important;
  position: relative !important;
}

.makeup-date-picker-popper .el-picker-panel {
  width: 100% !important;
  min-width: 750px !important;
  background-color: #ffffff !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  position: relative !important;
  z-index: 1 !important;
}

.makeup-date-picker-popper .el-picker-panel__body {
  padding: 40px !important;
  background-color: #ffffff !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  position: relative !important;
  z-index: 1 !important;
}

.makeup-date-picker-popper .el-date-table {
  background-color: #ffffff !important;
  pointer-events: auto !important;
  position: relative !important;
  z-index: 1 !important;
  width: 100% !important;
}

.makeup-date-picker-popper .el-date-table tr {
  height: 80px !important;
}

.makeup-date-picker-popper .el-date-table td {
  padding: 6px !important;
}

.makeup-date-picker-popper .el-date-table th,
.makeup-date-picker-popper .el-date-table td {
  background-color: transparent !important;
  pointer-events: auto !important;
  cursor: pointer !important;
}

.makeup-date-picker-popper .el-date-table th {
  font-size: 0 !important;
  position: relative !important;
  height: 56px !important;
  padding: 16px 0 !important;
  line-height: 0 !important;
  overflow: hidden !important;
}

.makeup-date-picker-popper .el-date-table th > * {
  font-size: 0 !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

.makeup-date-picker-popper .el-date-table th:nth-child(1)::after {
  content: '日' !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  display: block !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  color: #606266 !important;
  line-height: 1 !important;
  width: 100% !important;
  text-align: center !important;
}

.makeup-date-picker-popper .el-date-table th:nth-child(2)::after {
  content: '一' !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  display: block !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  color: #606266 !important;
  line-height: 1 !important;
  width: 100% !important;
  text-align: center !important;
}

.makeup-date-picker-popper .el-date-table th:nth-child(3)::after {
  content: '二' !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  display: block !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  color: #606266 !important;
  line-height: 1 !important;
  width: 100% !important;
  text-align: center !important;
}

.makeup-date-picker-popper .el-date-table th:nth-child(4)::after {
  content: '三' !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  display: block !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  color: #606266 !important;
  line-height: 1 !important;
  width: 100% !important;
  text-align: center !important;
}

.makeup-date-picker-popper .el-date-table th:nth-child(5)::after {
  content: '四' !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  display: block !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  color: #606266 !important;
  line-height: 1 !important;
  width: 100% !important;
  text-align: center !important;
}

.makeup-date-picker-popper .el-date-table th:nth-child(6)::after {
  content: '五' !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  display: block !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  color: #606266 !important;
  line-height: 1 !important;
  width: 100% !important;
  text-align: center !important;
}

.makeup-date-picker-popper .el-date-table th:nth-child(7)::after {
  content: '六' !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  display: block !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  color: #606266 !important;
  line-height: 1 !important;
  width: 100% !important;
  text-align: center !important;
}

.makeup-date-picker-popper .el-date-picker__header {
  margin-bottom: 24px !important;
  padding: 0 8px !important;
}

.makeup-date-picker-popper .el-date-picker__header-label {
  font-size: 24px !important;
  font-weight: 600 !important;
  color: #303133;
  padding: 6px 12px !important;
}

.makeup-date-picker-popper .el-picker-panel__icon-btn {
  width: 44px !important;
  height: 44px !important;
  font-size: 20px !important;
}

.makeup-date-picker-popper .el-date-table-cell {
  height: 80px !important;
  pointer-events: auto !important;
  cursor: pointer !important;
  padding: 6px !important;
}

.makeup-date-picker-popper .el-date-table-cell__text {
  width: 72px !important;
  height: 72px !important;
  line-height: 72px !important;
  font-size: 28px !important;
  font-weight: 500 !important;
  pointer-events: auto !important;
  cursor: pointer !important;
  border-radius: 12px !important;
}

.makeup-date-picker-popper .el-date-table td.available {
  pointer-events: auto !important;
  cursor: pointer !important;
}

.makeup-date-picker :deep(.el-date-table) {
  pointer-events: auto;
  position: relative;
  z-index: 1;
  width: 100% !important;
}

.makeup-date-picker :deep(.el-date-table tr) {
  height: 80px !important;
}

.makeup-date-picker :deep(.el-date-table th) {
  pointer-events: auto;
  height: 56px !important;
  padding: 16px 0 !important;
  font-size: 0 !important;
}

.makeup-date-picker :deep(.el-date-table td) {
  pointer-events: auto;
  cursor: pointer;
  padding: 6px !important;
}

.makeup-date-picker :deep(.el-date-table-cell) {
  height: 80px !important;
  padding: 6px !important;
  pointer-events: auto;
  cursor: pointer;
}

.makeup-date-picker :deep(.el-date-table-cell__text) {
  width: 72px !important;
  height: 72px !important;
  line-height: 72px !important;
  font-size: 28px !important;
  border-radius: 12px !important;
  transition: all 0.2s ease;
  font-weight: 500 !important;
  pointer-events: auto;
  cursor: pointer;
}

.makeup-date-picker :deep(.el-date-table td.available) {
  pointer-events: auto;
  cursor: pointer;
}

html.dark .makeup-date-picker-popper {
  background-color: #1e293b !important;
}

html.dark .makeup-date-picker-popper .el-picker-panel {
  background-color: #1e293b !important;
}

html.dark .makeup-date-picker-popper .el-picker-panel__body {
  background-color: #1e293b !important;
}

html.dark .makeup-date-picker-popper .el-date-table {
  background-color: #1e293b !important;
}

html.dark .makeup-date-picker-popper .el-date-table th::after {
  color: #cbd5e1 !important;
}

html.dark .makeup-date-picker-popper .el-date-picker__header-label {
  color: #e2e8f0 !important;
}

html.dark .makeup-date-picker-popper .el-date-table-cell__text {
  color: #e2e8f0 !important;
}

html.dark .makeup-date-picker-popper .el-date-table td.current .el-date-table-cell__text {
  color: white !important;
}

html.dark .makeup-date-picker-popper .el-date-table td.today .el-date-table-cell__text {
  color: white !important;
}


</style>

<style>

html.dark .makeup-date-picker-popper .el-date-table-cell__text {
  color: #e2e8f0 !important;
}

html.dark .makeup-date-picker-popper .el-date-table td.current .el-date-table-cell__text {
  color: white !important;
}

html.dark .makeup-date-picker-popper .el-date-table td.today .el-date-table-cell__text {
  color: white !important;
}

/* 改分记录查看弹窗样式 */
.score-change-records-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.score-change-records-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.score-change-records-container {
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  padding: 16px 0;
}

.records-loading,
.records-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  color: var(--admin-text-secondary);
}

.records-loading .el-icon {
  font-size: 40px;
  color: var(--admin-primary-color);
}

.records-empty .el-icon {
  font-size: 56px;
  color: var(--admin-text-tertiary);
  opacity: 0.5;
}

.records-loading span,
.records-empty span {
  font-size: 14px;
  font-weight: 500;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.record-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(0, 242, 254, 0.05) 100%);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.record-card:hover {
  transform: translateY(-4px);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(0, 242, 254, 0.08) 100%);
  border-color: rgba(102, 126, 234, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.record-time {
  font-size: 13px;
  color: var(--admin-text-secondary);
  font-weight: 500;
  word-break: break-word;
  flex: 1;
  min-width: 0;
}

.record-points-badge {
  font-size: 16px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 8px;
  min-width: 70px;
  text-align: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.record-points-badge.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.record-points-badge.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.record-reason-text {
  font-size: 14px;
  color: var(--admin-text-primary);
  line-height: 1.6;
  word-break: break-word;
}

.summary-value.positive {
  color: #10b981;
}

.summary-value.negative {
  color: #ef4444;
}

.score-records-btn {
  margin-left: 8px;
}
</style>
