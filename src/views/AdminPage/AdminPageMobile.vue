<template>
  <div class="admin-mobile-container">
    <div v-if="!isAuthenticated" class="auth-section-mobile">
      <div class="auth-page-header-mobile">
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="auth-logo-mobile" @click="toggleTheme"
             title="切换主题模式">
      </div>
      <div class="auth-card-mobile">
        <div class="auth-header-mobile">
          <div class="auth-icon-container-mobile">
            <el-icon class="auth-icon-mobile">
              <Key/>
            </el-icon>
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
                <el-icon>
                  <Lock/>
                </el-icon>
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
          <el-icon>
            <Warning/>
          </el-icon>
          {{ authError }}
        </div>
      </div>
    </div>

    <div v-else-if="!isDataLoaded" class="admin-loading-mobile">
      <div class="loading-page-header-mobile">
        <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="loading-logo-mobile" @click="toggleTheme"
             title="切换主题模式">
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
          <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo-mobile" @click="toggleTheme"
               title="切换主题模式">
          <div class="title-section-mobile">
            <h1>超级管理员</h1>
            <p>Super Admin</p>
          </div>
        </div>
        <el-button @click="logout" type="danger" size="small" class="logout-btn-mobile">
          <el-icon>
            <SwitchButton/>
          </el-icon>
        </el-button>
      </div>

      <div class="admin-stats-mobile">
        <div class="stat-card-mobile">
          <div class="stat-icon-mobile">
            <el-icon>
              <User/>
            </el-icon>
          </div>
          <div class="stat-content-mobile">
            <div class="stat-value-mobile">{{ totalStudents }}</div>
            <div class="stat-label-mobile">学生总数</div>
          </div>
        </div>
        <div class="stat-card-mobile" @click="showTodayAttendance" style="cursor: pointer;">
          <div class="stat-icon-mobile">
            <el-icon>
              <Calendar/>
            </el-icon>
          </div>
          <div class="stat-content-mobile">
            <div class="stat-value-mobile">{{ todayCount }}</div>
            <div class="stat-label-mobile">今日签到</div>
          </div>
        </div>
        <div class="stat-card-mobile">
          <div class="stat-icon-mobile">
            <el-icon>
              <TrendCharts/>
            </el-icon>
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
                <el-icon>
                  <Search/>
                </el-icon>
              </template>
            </el-input>
            <el-button @click="refreshData" :loading="isLoading" type="primary" size="small">
              <el-icon>
                <Refresh/>
              </el-icon>
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
          <div class="student-item-mobile" v-for="student in currentLevelStudents" :key="student.studentId">
            <div class="student-main-info-mobile">
              <div class="student-avatar-mobile"
                   :class="{ 'has-avatar': student.hasAvatar && student.avatarUrl, 'no-avatar': !student.hasAvatar || !student.avatarUrl }">
                <img v-if="student.hasAvatar && student.avatarUrl" :src="student.avatarUrl" alt="头像"
                     class="avatar-image-mobile" @error="handleAvatarError(student)"/>
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
                <el-icon class="attendance-icon-mobile">
                  <Calendar/>
                </el-icon>
                <span class="count-text-mobile">{{ studentAttendanceCounts[student.studentId] || 0 }}次</span>
              </div>
            </div>

            <div class="student-actions-mobile">
              <div>
                <span
                    style="display: inline-block; padding: 4px 0; background-color: transparent; color: #409eff; border: 1px solid transparent; border-radius: 4px; font-size: 12px; font-weight: 500; letter-spacing: 1px;"
                >考勤</span>
                <div style="display: flex; gap: 5px; flex-wrap: nowrap; margin-bottom: 10px;">
                  <el-button
                      type="success"
                      size="small"
                      @click="openAttendanceRecordsDialog(student)"
                      style="flex: 1; min-width: 0; font-size: 12px; padding: 8px 4px;"
                  >
                    <el-icon style="font-size: 12px;">
                      <Calendar/>
                    </el-icon>
                    考勤
                  </el-button>
                  <el-button
                      type="warning"
                      size="small"
                      @click="openMakeupDialog(student)"
                      style="flex: 1; min-width: 0; font-size: 12px; padding: 8px 4px;"
                  >
                    <el-icon style="font-size: 12px;">
                      <Clock/>
                    </el-icon>
                    补卡
                  </el-button>
                  <el-button
                      type="info"
                      size="small"
                      @click="openHeatmapDialog(student)"
                      style="flex: 1; min-width: 0; font-size: 12px; padding: 8px 4px;"
                  >
                    <el-icon style="font-size: 12px;">
                      <TrendCharts/>
                    </el-icon>
                    热力图
                  </el-button>
                  <el-button
                      type="info"
                      size="small"
                      @click="openTrendDialog(student)"
                      style="flex: 1; min-width: 0; font-size: 12px; padding: 8px 4px;"
                  >
                    <el-icon style="font-size: 12px;">
                      <TrendCharts/>
                    </el-icon>
                    趋势图
                  </el-button>
                </div>
              </div>
              <div>
                <div>
                  <span
                      style="
                      display: inline-block; padding: 4px 0;
                      background-color: transparent; color: #409eff;
                      border: 1px solid transparent; border-radius: 4px;
                      font-size: 12px; font-weight: 500; letter-spacing: 1px;
                    "
                  >积分</span>
                </div>
                <div style="display: flex; width: 64%;">
                  <el-button
                      type="success"
                      size="small"
                      @click="openPointsDialog(student)"
                      style="flex: 1; min-width: 0; font-size: 12px; padding: 8px 4px;"
                  >
                    <el-icon>
                      <Edit/>
                    </el-icon>
                    添加积分
                  </el-button>
                  <el-button
                      type="info"
                      size="small"
                      @click="openScoreChangeRecordsDialog(student)"
                      style="flex: 1; min-width: 0; font-size: 12px; padding: 8px 4px;"
                  >
                    <el-icon>
                      <Calendar/>
                    </el-icon>
                    查看积分
                  </el-button>
                </div>
              </div>
              <div>
                <div>
                  <span
                      style="
                      display: inline-block; padding: 4px 0;
                      background-color: transparent; color: #409eff;
                      border: 1px solid transparent; border-radius: 4px;
                      font-size: 12px; font-weight: 500; letter-spacing: 1px;
                    "
                  >个人信息</span>
                </div>
                <div>
                  <el-button
                      type="primary"
                      size="small"
                      @click="openEditDialog(student)"
                      class="action-btn-mobile"
                  >
                    <el-icon>
                      <Edit/>
                    </el-icon>
                    编辑
                  </el-button>
                </div>
              </div>
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
        modal-class="edit-dialog-overlay-mobile"
        class="edit-dialog-mobile"
        @close="cancelEdit"
    >
      <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
          label-width="80px"
          class="edit-form-mobile"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入学生姓名"/>
        </el-form-item>
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="editForm.studentId" placeholder="请输入学号"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="editForm.gender" placeholder="请选择性别" style="width: 100%">
            <el-option label="男" value="男"/>
            <el-option label="女" value="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="editForm.phoneNumber" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-input v-model="editForm.college" placeholder="请输入学院"/>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="editForm.major" placeholder="请输入专业"/>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="editForm.grade" placeholder="请选择年级" style="width: 100%">
            <el-option label="1年级" :value="1"/>
            <el-option label="2年级" :value="2"/>
            <el-option label="3年级" :value="3"/>
            <el-option label="4年级" :value="4"/>
            <el-option label="5年级" :value="5"/>
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
        :modal-class="'today-attendance-overlay-mobile'"
        @close="closeTodayAttendanceDialog"
        class="today-attendance-dialog-mobile"
    >
      <div class="attendance-records-container-mobile">
        <div v-if="todayAttendanceRecords.length === 0" class="no-records-mobile">
          <el-icon class="no-records-icon-mobile">
            <Calendar/>
          </el-icon>
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
              <div class="student-avatar-mobile-record"
                   :class="{ 'has-avatar': record.hasAvatar && record.avatarUrl, 'no-avatar': !record.hasAvatar || !record.avatarUrl }">
                <img v-if="record.hasAvatar && record.avatarUrl" :src="record.avatarUrl" alt="头像"
                     class="avatar-image-mobile-record" @error="handleTodayRecordAvatarError(record)"/>
                <span v-else class="avatar-text-mobile-record">{{ record.name.charAt(0) }}</span>
              </div>
              <div class="student-details-mobile-record">
                <div class="student-name-mobile-record">{{ record.name }}</div>
                <div class="student-id-mobile-record">{{ record.scheduleId }}</div>
              </div>
              <div class="attendance-time-mobile">
                <el-icon class="time-icon-mobile">
                  <Clock/>
                </el-icon>
                <span class="time-text-mobile">{{ formatAttendanceTime(record.attendanceTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer-mobile">
          <el-button @click="closeTodayAttendanceDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
        v-if="attendanceRecordsDialogVisible"
        v-model="attendanceRecordsDialogVisible"
        :title="`${currentStudentInfo.name} 的考勤记录`"
        width="90%"
        :close-on-click-modal="false"
        :append-to-body="true"
        :teleported="true"
        class="attendance-records-dialog-mobile"
        @close="closeAttendanceRecordsDialog"
    >
      <div class="student-info-header-mobile">
        <div class="student-avatar-large-mobile">
          <img v-if="currentStudentInfo.hasAvatar && currentStudentInfo.avatarUrl" :src="currentStudentInfo.avatarUrl"
               alt="头像" class="avatar-image-large-mobile"/>
          <span v-else class="avatar-text-large-mobile">{{ currentStudentInfo.name?.charAt(0) }}</span>
        </div>
        <div class="student-info-mobile">
          <h3>{{ currentStudentInfo.name }}</h3>
          <p>学号：{{ currentStudentInfo.studentId }}</p>
          <p>{{ currentStudentInfo.grade }}年级 | {{ currentStudentInfo.major }}</p>
        </div>
        <div class="attendance-summary-mobile">
          <div class="summary-item-mobile">
            <span class="summary-label-mobile">总签到次数</span>
            <span class="summary-value-mobile">{{ studentAttendanceRecords.length }}</span>
          </div>
        </div>
      </div>

      <div class="month-selector-mobile" v-if="getAvailableMonths.length > 0">
        <span class="selector-label-mobile">选择月份：</span>
        <el-select
            v-model="selectedMonth"
            placeholder="请选择月份"
            size="default"
            class="month-select-mobile"
        >
          <el-option
              label="全部"
              value=""
          />
          <el-option
              v-for="month in getAvailableMonths"
              :key="month.value"
              :label="month.label"
              :value="month.value"
          />
        </el-select>
      </div>

      <div class="attendance-records-list-mobile">
        <div v-if="filteredAttendanceRecords.length === 0" class="no-records-mobile">
          <el-icon class="no-records-icon-mobile">
            <Calendar/>
          </el-icon>
          <p>{{ selectedMonth ? '该月份暂无考勤记录' : '暂无考勤记录' }}</p>
        </div>
        <div v-else class="records-by-date-mobile">
          <div
              v-for="group in groupRecordsByDate(filteredAttendanceRecords)"
              :key="group.date"
              class="date-group-mobile"
          >
            <div class="date-header-mobile">
              <el-icon class="date-icon-mobile">
                <Calendar/>
              </el-icon>
              <span class="date-text-mobile">{{ group.date }}</span>
              <span class="date-count-mobile">({{ group.records.length }}次)</span>
            </div>
            <div class="records-list-mobile">
              <div
                  v-for="(record, index) in group.records"
                  :key="index"
                  class="attendance-record-item-mobile"
                  :class="getTimePeriodClass(record.attendanceDateTime)"
              >
                <div class="time-period-indicator-mobile" :class="getTimePeriodClass(record.attendanceDateTime)">
                  <div class="indicator-dot-mobile"></div>
                  <span class="period-text-mobile">{{ getTimePeriodName(record.attendanceDateTime) }}</span>
                </div>
                <div class="record-content-mobile">
                  <div class="attendance-time-mobile">
                    <el-icon class="time-icon-mobile">
                      <Clock/>
                    </el-icon>
                    <span class="time-text-mobile">{{ formatRecordTime(record.attendanceDateTime) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer-mobile">
          <el-button @click="closeAttendanceRecordsDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
        v-if="makeupDialogVisible"
        v-model="makeupDialogVisible"
        title="学生补卡"
        width="90%"
        :close-on-click-modal="false"
        :append-to-body="true"
        :teleported="true"
        class="makeup-dialog-mobile"
        @close="cancelMakeup"
    >
      <div class="makeup-student-info-mobile">
        <div class="makeup-student-avatar-mobile">
          <img v-if="makeupSelectedStudent?.hasAvatar && makeupSelectedStudent?.avatarUrl"
               :src="makeupSelectedStudent.avatarUrl" alt="头像" class="makeup-avatar-image-mobile"/>
          <span v-else class="makeup-avatar-text-mobile">{{ makeupSelectedStudent?.name?.charAt(0) }}</span>
        </div>
        <div class="makeup-student-details-mobile">
          <div class="makeup-student-name-mobile">{{ makeupSelectedStudent?.name }}</div>
          <div class="makeup-student-id-mobile">{{ makeupSelectedStudent?.studentId }}</div>
          <div class="makeup-student-grade-mobile">{{ makeupSelectedStudent?.grade }}年级 ·
            {{ makeupSelectedStudent?.major }}
          </div>
        </div>
      </div>

      <div v-if="makeupStep === 'date'" class="makeup-step-content-mobile">
        <div class="step-title-mobile">第一步：选择补卡日期</div>
        <div class="date-shortcuts-mobile">
          <div class="shortcut-row-mobile">
            <div class="shortcut-buttons-mobile">
              <el-button
                  v-for="shortcut in yesterdayShortcuts"
                  :key="shortcut.key"
                  size="small"
                  :type="isDatetimeShortcutSelected(shortcut) ? 'primary' : 'default'"
                  @click="selectDatetimeShortcut(shortcut)"
                  class="date-shortcut-btn-mobile"
              >
                <el-icon>
                  <Clock/>
                </el-icon>
                <span>{{ shortcut.label }}</span>
              </el-button>
            </div>
          </div>
          <div class="shortcut-row-mobile">
            <div class="shortcut-buttons-mobile">
              <el-button
                  v-for="shortcut in todayShortcuts"
                  :key="shortcut.key"
                  size="small"
                  :type="isDatetimeShortcutSelected(shortcut) ? 'primary' : 'default'"
                  @click="selectDatetimeShortcut(shortcut)"
                  class="date-shortcut-btn-mobile"
              >
                <el-icon>
                  <Clock/>
                </el-icon>
                <span>{{ shortcut.label }}</span>
              </el-button>
            </div>
          </div>
        </div>
        <el-form
            ref="makeupFormRef"
            :model="makeupForm"
            :rules="makeupDateFormRules"
            label-width="0"
            class="makeup-form-content-mobile"
        >
          <el-form-item prop="selectedDate">
            <el-date-picker
                v-model="makeupForm.selectedDate"
                type="date"
                :locale="zhCn"
                placeholder="请选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                class="makeup-date-picker-mobile"
                popper-class="makeup-date-picker-popper-mobile"
                clearable
                @change="handleDateChange"
                @focus="handleDatePickerFocus"
                style="width: 100%"
            >
              <template #prefix-icon>
                <el-icon>
                  <Calendar/>
                </el-icon>
              </template>
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="makeupStep === 'hour'" class="makeup-step-content-mobile">
        <div class="step-title-mobile">第二步：选择补卡时间</div>
        <div class="selected-date-display-mobile">
          <el-icon>
            <Calendar/>
          </el-icon>
          <span>已选择日期：{{ formatSelectedDate() }}</span>
        </div>
        <div class="hour-buttons-group-mobile">
          <div class="hour-label-mobile">选择时间：</div>
          <div class="hour-buttons-container-mobile">
            <template v-for="(slot, slotIndex) in timeSlots" :key="slot.key">
              <div class="time-slot-buttons-mobile">
                <div class="time-slot-label-mobile">{{ slot.label }}</div>
                <div class="hour-buttons-row-mobile">
                  <el-button
                      v-for="hour in slot.hours"
                      :key="hour"
                      size="small"
                      :type="isHourSelected(hour) ? 'primary' : 'default'"
                      @click="selectHour(hour)"
                      class="hour-btn-mobile"
                  >
                    {{ String(hour).padStart(2, '0') }}:00
                  </el-button>
                </div>
              </div>
              <div v-if="slotIndex < timeSlots.length - 1" class="time-slot-divider-mobile"></div>
            </template>
          </div>
          <div class="form-tip-mobile">
            <el-icon>
              <Warning/>
            </el-icon>
            <span>补卡时间必须在有效签到时间段内（早上 08:00-11:00、下午 14:00-17:00、晚上 19:00-22:00），且不能晚于当前时间</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="makeup-footer-mobile">
          <el-button
              @click="cancelMakeup"
              class="cancel-btn-mobile"
              size="default"
          >
            取消
          </el-button>
          <el-button
              v-if="makeupStep === 'date'"
              type="primary"
              @click="nextStep"
              :disabled="!makeupForm.selectedDate"
              size="default"
          >
            下一步
          </el-button>
          <el-button
              v-if="makeupStep === 'hour'"
              type="primary"
              @click="submitMakeup"
              :loading="makeupLoading"
              :disabled="makeupForm.selectedHour === null"
              size="default"
          >
            <el-icon v-if="!makeupLoading">
              <Clock/>
            </el-icon>
            {{ makeupLoading ? '处理中...' : '确认补卡' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
        v-if="heatmapDialogVisible"
        v-model="heatmapDialogVisible"
        :title="`${currentStudentInfo.name} 的签到热力图`"
        width="90%"
        :close-on-click-modal="false"
        :append-to-body="true"
        :teleported="true"
        :destroy-on-close="true"
        modal-class="heatmap-overlay-mobile"
        class="heatmap-dialog-mobile"
        @close="closeHeatmapDialog"
    >
      <div class="student-info-header-mobile">
        <div class="student-avatar-large-mobile">
          <img v-if="currentStudentInfo.hasAvatar && currentStudentInfo.avatarUrl" :src="currentStudentInfo.avatarUrl"
               alt="头像" class="avatar-image-large-mobile"/>
          <span v-else class="avatar-text-large-mobile">{{ currentStudentInfo.name?.charAt(0) }}</span>
        </div>
        <div class="student-info-mobile">
          <h3>{{ currentStudentInfo.name }}</h3>
          <p>学号：{{ currentStudentInfo.studentId }}</p>
          <p>{{ currentStudentInfo.grade }}年级 | {{ currentStudentInfo.major }}</p>
        </div>
        <div class="attendance-summary-mobile">
          <div class="summary-item-mobile">
            <span class="summary-label-mobile">总签到次数</span>
            <span class="summary-value-mobile">{{ allStudentAttendanceRecords.length }}</span>
          </div>
        </div>
      </div>

      <div class="chart-container-mobile">
        <div class="chart-item-mobile">
          <div class="heatmap-wrapper-mobile">
            <div ref="heatmapChart" class="chart-content-mobile"></div>
            <div class="daily-averages-mobile">
              <div class="averages-title-mobile">概率</div>
              <div
                  v-for="(prob, index) in calculateDayProbabilities"
                  :key="index"
                  class="average-item-mobile"
              >
                {{ prob }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer-mobile">
          <el-button @click="closeHeatmapDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
        v-if="trendDialogVisible"
        v-model="trendDialogVisible"
        :title="`${currentStudentInfo.name} 的签到趋势图`"
        width="90%"
        :close-on-click-modal="false"
        :append-to-body="true"
        :teleported="true"
        :destroy-on-close="true"
        modal-class="trend-overlay-mobile"
        class="trend-dialog-mobile"
        @close="closeTrendDialog"
    >
      <div class="student-info-header-mobile">
        <div class="student-avatar-large-mobile">
          <img v-if="currentStudentInfo.hasAvatar && currentStudentInfo.avatarUrl" :src="currentStudentInfo.avatarUrl"
               alt="头像" class="avatar-image-large-mobile"/>
          <span v-else class="avatar-text-large-mobile">{{ currentStudentInfo.name?.charAt(0) }}</span>
        </div>
        <div class="student-info-mobile">
          <h3>{{ currentStudentInfo.name }}</h3>
          <p>学号：{{ currentStudentInfo.studentId }}</p>
          <p>{{ currentStudentInfo.grade }}年级 | {{ currentStudentInfo.major }}</p>
        </div>
        <div class="attendance-summary-mobile">
          <div class="summary-item-mobile">
            <span class="summary-label-mobile">总签到次数</span>
            <span class="summary-value-mobile">{{ allStudentAttendanceRecords.length }}</span>
          </div>
        </div>
      </div>

      <div class="chart-container-mobile">
        <div class="chart-item-mobile">
          <div ref="lineChart" class="chart-content-mobile"></div>
        </div>
        <div class="trend-chart-footer-mobile">
          <el-button @click="closeTrendDialog">关闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 添加积分记录对话框 -->
    <el-dialog
        v-if="pointsDialogVisible"
        v-model="pointsDialogVisible"
        title="添加积分记录"
        width="90%"
        :close-on-click-modal="false"
        :append-to-body="true"
        :teleported="true"
        :destroy-on-close="true"
        modal-class="points-overlay-mobile"
        class="points-dialog-mobile"
        @close="handlePointsDialogClose"
    >
      <div v-if="pointsSelectedStudent" class="points-student-info-mobile">
        <div class="student-info-card-mobile">
          <div class="student-avatar-card-mobile">
            <img v-if="pointsSelectedStudent.hasAvatar && pointsSelectedStudent.avatarUrl"
                 :src="pointsSelectedStudent.avatarUrl" alt="头像" class="avatar-image-card-mobile"/>
            <span v-else class="avatar-text-card-mobile">{{ pointsSelectedStudent.name?.charAt(0) }}</span>
          </div>
          <div class="student-info-details-mobile">
            <div class="student-name-card-mobile">{{ pointsSelectedStudent.name }}</div>
            <div class="student-id-card-mobile">学号：{{ pointsSelectedStudent.studentId }}</div>
            <div class="student-major-card-mobile">{{ pointsSelectedStudent.major }} | {{
                pointsSelectedStudent.grade
              }}年级
            </div>
          </div>
        </div>
      </div>
      <el-form
          ref="pointsFormRef"
          :model="pointsForm"
          :rules="pointsFormRules"
          label-position="top"
          class="points-form-mobile"
      >
        <el-form-item label="积分变动" prop="changePoints">
          <el-input-number
              v-model="pointsForm.changePoints"
              :min="-9999"
              :max="9999"
              placeholder="请输入积分变动值（正数为加分，负数为扣分）"
              style="width: 100%"
          />
          <div class="form-tip-mobile">
            <el-icon>
              <Warning/>
            </el-icon>
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
        <div class="dialog-footer-mobile">
          <el-button @click="cancelPoints" :disabled="pointsLoading">取消</el-button>
          <el-button type="primary" @click="confirmPoints" :loading="pointsLoading">
            确认添加
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看积分记录对话框 -->
    <el-dialog
        v-if="scoreChangeRecordsDialogVisible"
        v-model="scoreChangeRecordsDialogVisible"
        :title="`${currentScoreChangeRecordsStudent?.name || '学生'} 的积分记录`"
        width="90%"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        :append-to-body="true"
        :teleported="true"
        modal-class="score-change-records-overlay-mobile"
        class="score-change-records-dialog-mobile"
        @close="closeScoreChangeRecordsDialog"
    >
      <div class="student-info-header-mobile">
        <div class="student-avatar-large-mobile">
          <img v-if="currentScoreChangeRecordsStudent?.hasAvatar && currentScoreChangeRecordsStudent?.avatarUrl"
               :src="currentScoreChangeRecordsStudent.avatarUrl" alt="头像" class="avatar-image-large-mobile"/>
          <span v-else class="avatar-text-large-mobile">{{
              currentScoreChangeRecordsStudent?.name?.charAt(0) || '学'
            }}</span>
        </div>
        <div class="student-info-mobile">
          <h3>{{ currentScoreChangeRecordsStudent?.name || '学生' }}</h3>
          <p>学号：{{ currentScoreChangeRecordsStudent?.studentId }}</p>
          <p v-if="currentScoreChangeRecordsStudent?.major && currentScoreChangeRecordsStudent?.grade">
            {{ currentScoreChangeRecordsStudent.major }} | {{ currentScoreChangeRecordsStudent.grade }}年级
          </p>
        </div>
        <div class="attendance-summary-mobile">
          <div class="summary-item-mobile">
            <span class="summary-label-mobile">总记录数</span>
            <span class="summary-value-mobile">{{ scoreChangeRecords.length }}</span>
          </div>
          <div class="summary-item-mobile">
            <span class="summary-label-mobile">总调整分数</span>
            <span class="summary-value-mobile"
                  :class="{ positive: totalScoreChangePoints >= 0, negative: totalScoreChangePoints < 0 }">
              {{ totalScoreChangePoints > 0 ? `+${totalScoreChangePoints}` : totalScoreChangePoints }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="scoreChangeRecordsLoading" class="records-loading-mobile">
        <el-icon class="is-loading">
          <Loading/>
        </el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="scoreChangeRecords.length === 0" class="records-empty-mobile">
        <el-icon>
          <Box/>
        </el-icon>
        <span>暂无积分记录</span>
      </div>
      <div v-else class="score-change-records-container-mobile">
        <div class="records-list-mobile">
          <div
              v-for="(record, index) in sortedScoreChangeRecords"
              :key="index"
              class="record-card-mobile"
          >
            <div class="record-header-mobile">
              <span class="record-time-mobile">{{ formatScoreChangeTime(record.createTime) }}</span>
              <span class="record-points-badge-mobile"
                    :class="{ positive: record.adjustPoints >= 0, negative: record.adjustPoints < 0 }">
                {{ record.adjustPoints > 0 ? `+${record.adjustPoints}` : record.adjustPoints }}
              </span>
            </div>
            <div class="record-reason-text-mobile">{{ record.adjustReason }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer-mobile">
          <el-button @click="closeScoreChangeRecordsDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useAdminPage } from './AdminPage.js'
import { onMounted } from 'vue'
import "./css/AdminPageMobile.css"
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
  ElButtonGroup,
  ElCalendar,
  ElScrollbar
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
  totalStudents,
  todayCount,
  monthlyCount,
  studentLevels,
  studentAttendanceCounts,
  studentAdmins,
  activeLevelTab,
  editDialogVisible,
  editFormRef,
  editForm,
  currentEditStudentId,
  todayAttendanceDialogVisible,
  todayAttendanceRecords,
  attendanceRecordsDialogVisible,
  currentStudentInfo,
  studentAttendanceRecords,
  selectedMonth,
  allStudentAttendanceRecords,
  makeupDialogVisible,
  makeupLoading,
  makeupSelectedStudent,
  makeupStep,
  makeupFormRef,
  makeupForm,
  heatmapDialogVisible,
  trendDialogVisible,
  heatmapChart,
  lineChart,
  heatmapInstance,
  lineInstance,
  pointsDialogVisible,
  pointsLoading,
  pointsSelectedStudent,
  pointsFormRef,
  pointsForm,
  scoreChangeRecordsDialogVisible,
  scoreChangeRecordsLoading,
  currentScoreChangeRecordsStudent,
  scoreChangeRecords,
  levelOptions,
  adminOptions,
  filteredStudents,
  currentLevelStudents,
  editFormRules,
  pointsFormRules,
  makeupDateFormRules,
  timeSlots,
  validHours,
  datetimeShortcuts,
  getShortcutDate,
  yesterdayShortcuts,
  todayShortcuts,
  monthMap,
  weekDayMap,
  monthObserverMobile,
  setChineseMonthMobile,
  setChineseWeekDaysMobile,
  

  getLevelStudents,
  changeLevel,
  changeAdmin,
  loadStudentLevels,
  loadStudentAttendanceCounts,
  loadStudentAdmins,
  loadStudentAvatars,
  handleAvatarError,
  loadStatistics,
  refreshData,
  openEditDialog,
  cancelEdit,
  confirmEdit,
  showTodayAttendance,
  closeTodayAttendanceDialog,
  loadTodayAttendanceAvatars,
  handleTodayRecordAvatarError,
  formatAttendanceTime,
  getTimePeriodClass,
  getTimePeriodName,
  openAttendanceRecordsDialog,
  closeAttendanceRecordsDialog,
  formatRecordDate,
  formatRecordTime,
  getAvailableMonths,
  filteredAttendanceRecords,
  groupRecordsByDate,
  selectDatetimeShortcut,
  isDatetimeShortcutSelected,
  handleDatePickerFocus,
  selectHour,
  isHourSelected,
  updateAttendanceTime,
  validateAttendanceTime,
  formatSelectedDate,
  nextStep,
  submitMakeup,
  generateHeatmapData,
  calculateDayProbabilities,
  calculateTimeSlotProbabilities,
  generateLineData,
  initHeatmapChart,
  initLineChart,
  openHeatmapDialog,
  closeHeatmapDialog,
  openTrendDialog,
  closeTrendDialog,
  openPointsDialog,
  handlePointsDialogClose,
  cancelPoints,
  confirmPoints,
  openScoreChangeRecordsDialog,
  closeScoreChangeRecordsDialog,
  sortedScoreChangeRecords,
  totalScoreChangePoints,
  formatScoreChangeTime,
  loadAllData,
  toggleTheme
} = useAdminPage()









































/**
 * 关闭今日签到对话框，避免闪烁
 */


/**
 * 加载今日签到记录的头像
 */


/**
 * 处理今日签到记录头像加载错误
 */


const formatRecordDate = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatRecordTime = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const getAvailableMonths = computed(() => {
  if (!studentAttendanceRecords.value || studentAttendanceRecords.value.length === 0) {
    return []
  }
  const monthsSet = new Set()
  studentAttendanceRecords.value.forEach(record => {
    if (record.attendanceDateTime) {
      const date = new Date(record.attendanceDateTime)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const monthKey = `${year}-${String(month).padStart(2, '0')}`
      monthsSet.add(monthKey)
    }
  })
  return Array.from(monthsSet).sort((a, b) => {
    const dateA = new Date(a + '-01')
    const dateB = new Date(b + '-01')
    return dateB - dateA
  }).map(monthKey => {
    const [year, month] = monthKey.split('-')
    const monthNum = parseInt(month)
    return {
      value: monthKey,
      label: `${year}年${monthNum}月`
    }
  })
})

const filteredAttendanceRecords = computed(() => {
  if (!selectedMonth.value) {
    return studentAttendanceRecords.value
  }
  return studentAttendanceRecords.value.filter(record => {
    if (!record.attendanceDateTime) return false
    const date = new Date(record.attendanceDateTime)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const monthKey = `${year}-${month}`
    return monthKey === selectedMonth.value
  })
})

const groupRecordsByDate = (records) => {
  const grouped = {}
  records.forEach(record => {
    const date = formatRecordDate(record.attendanceDateTime)
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(record)
  })
  return Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).map(date => ({
    date,
    records: grouped[date].sort((a, b) => new Date(b.attendanceDateTime) - new Date(a.attendanceDateTime))
  }))
}





const yesterdayShortcuts = computed(() => {
  return datetimeShortcuts.filter(shortcut => shortcut.dateOffset === -1)
})

const todayShortcuts = computed(() => {
  return datetimeShortcuts.filter(shortcut => shortcut.dateOffset === 0)
})

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

let monthObserverMobile = null





const handleDatePickerFocus = (event) => {
  if (event && event.target && event.target.tagName === 'INPUT') {
    event.target.setAttribute('readonly', 'readonly')
    event.target.setAttribute('inputmode', 'none')
    event.preventDefault()
  }
  setTimeout(() => {
    const input = document.querySelector('.makeup-date-picker-mobile input')
    if (input) {
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('inputmode', 'none')
    }
  }, 0)
}

const calculateDayProbabilities = computed(() => {
  const weekDays = ['一', '二', '三', '四', '五', '六', '日']
  const records = allStudentAttendanceRecords.value || []

  if (!records || !Array.isArray(records) || records.length === 0) {
    return weekDays.map(() => 0)
  }

  // 找到第一条签到记录的日期和今天的日期
  const dates = records
      .map(r => r?.attendanceDateTime ? new Date(r.attendanceDateTime) : null)
      .filter(d => d && !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime())

  if (dates.length === 0) {
    return weekDays.map(() => 0)
  }

  const firstDate = new Date(dates[0])
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  firstDate.setHours(0, 0, 0, 0)

  // 统计每个星期几有签到的日期
  const dayWithAttendance = [new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set()]

  records.forEach(record => {
    if (!record || !record.attendanceDateTime) return

    const date = new Date(record.attendanceDateTime)
    if (isNaN(date.getTime())) return

    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
    const dateStr = date.toISOString().split('T')[0]
    dayWithAttendance[dayOfWeek].add(dateStr)
  })

  // 计算从第一条签到记录到今天，每个星期几出现的总次数
  const dayTotalCounts = [0, 0, 0, 0, 0, 0, 0]
  const currentDate = new Date(firstDate)

  while (currentDate <= today) {
    const dayOfWeek = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1
    dayTotalCounts[dayOfWeek]++
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // 计算概率
  return dayTotalCounts.map((total, index) => {
    const attendedCount = dayWithAttendance[index].size
    return total > 0 ? parseFloat((attendedCount / total * 100).toFixed(1)) : 0
  })
})

const calculateTimeSlotProbabilities = computed(() => {
  const weekDays = ['一', '二', '三', '四', '五', '六', '日']
  const timeSlots = ['早上', '下午', '晚上']
  const records = allStudentAttendanceRecords.value || []

  if (!records || !Array.isArray(records) || records.length === 0) {
    return weekDays.map(() => timeSlots.map(() => 0))
  }

  // 找到第一条签到记录的日期和今天的日期
  const dates = records
      .map(r => r?.attendanceDateTime ? new Date(r.attendanceDateTime) : null)
      .filter(d => d && !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime())

  if (dates.length === 0) {
    return weekDays.map(() => timeSlots.map(() => 0))
  }

  const firstDate = new Date(dates[0])
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  firstDate.setHours(0, 0, 0, 0)

  // 统计每个星期几的每个时间段有签到的日期
  const dayTimeSlotWithAttendance = weekDays.map(() =>
      timeSlots.map(() => new Set())
  )

  records.forEach(record => {
    if (!record || !record.attendanceDateTime) return

    const date = new Date(record.attendanceDateTime)
    if (isNaN(date.getTime())) return

    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
    const hour = date.getHours()
    const dateStr = date.toISOString().split('T')[0]

    let timeSlotIndex = -1
    if (hour >= 8 && hour < 11) timeSlotIndex = 0 // 早上
    else if (hour >= 14 && hour < 17) timeSlotIndex = 1 // 下午
    else if (hour >= 19 && hour < 22) timeSlotIndex = 2 // 晚上

    if (timeSlotIndex >= 0) {
      dayTimeSlotWithAttendance[dayOfWeek][timeSlotIndex].add(dateStr)
    }
  })

  // 计算从第一条签到记录到今天，每个星期几出现的总次数
  const dayTotalCounts = [0, 0, 0, 0, 0, 0, 0]
  const currentDate = new Date(firstDate)

  while (currentDate <= today) {
    const dayOfWeek = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1
    dayTotalCounts[dayOfWeek]++
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // 计算每个星期几的每个时间段的概率
  return dayTotalCounts.map((total, dayIndex) => {
    return timeSlots.map((slot, slotIndex) => {
      const attendedCount = dayTimeSlotWithAttendance[dayIndex][slotIndex].size
      return total > 0 ? parseFloat((attendedCount / total * 100).toFixed(1)) : 0
    })
  })
})




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

