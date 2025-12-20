<template>
	<!-- 身份验证界面 -->
	<div v-if="!isAuthenticated" class="auth-section-mobile">
		<div class="auth-page-header-mobile">
			<img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="auth-logo-mobile" @click="toggleTheme" title="切换主题模式">
		</div>
		<div class="auth-card-mobile">
			<div class="auth-header-mobile">
				<div class="auth-icon-container-mobile">
					<el-icon class="auth-icon-mobile"><Key /></el-icon>
					<img v-if="adminAvatarUrl" :src="adminAvatarUrl" alt="Admin Avatar" class="admin-avatar-mobile" @error="adminAvatarUrl = null" />
					<div v-else class="icon-ring-mobile"></div>
				</div>				<h2>身份验证</h2>
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

	<!-- 加载界面 -->
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

	<!-- 管理控制台界面 -->
	<div v-else class="admin-console-mobile">
		<div class="admin-header-mobile">
			<div class="header-left-mobile">
				<img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo-mobile" @click="toggleTheme" title="切换主题模式">
				<div class="title-section-mobile">
					<h1>超级管理员控制台</h1>
					<p>Super Admin Console</p>
				</div>
			</div>
			<div class="header-right-mobile">
				<el-button @click="logout" type="danger" size="small" class="logout-btn-mobile">
					<el-icon><SwitchButton /></el-icon>
					退出登录
				</el-button>
			</div>
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
						placeholder="搜索学生信息"
						clearable
						class="search-input-mobile"
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

			<div class="level-tabs-mobile">
				<el-tabs v-model="activeLevelTab" type="card" class="level-tabs-container-mobile">
					<el-tab-pane
						v-for="level in levelOptions"
						:key="level.value"
						:label="level.label"
						:name="level.value.toString()"
						:class="`level-tab-${level.color}-mobile`"
					>
						<template #label>
							<el-tag :type="level.color" size="large" class="tab-label-mobile">
								{{ level.label }}
								<span class="tab-count-mobile">({{ getLevelStudents(level.value).length }})</span>
							</el-tag>
						</template>
					</el-tab-pane>
				</el-tabs>
			</div>

			<div class="students-cards-container-mobile">
				<div class="student-card-mobile" v-for="student in filteredStudents" :key="student.studentId" :data-level="studentLevels[student.studentId] || 0" v-show="(parseInt(studentLevels[student.studentId] || 0) === parseInt(activeLevelTab))">
					<div class="student-main-row-mobile">
						<div class="student-avatar-mobile" :class="{ 'has-avatar': student.hasAvatar && student.avatarUrl, 'no-avatar': !student.hasAvatar || !student.avatarUrl }">
							<img v-if="student.hasAvatar && student.avatarUrl" :src="student.avatarUrl" alt="头像" class="avatar-image-mobile" @error="handleAvatarError(student)" />
							<span v-else class="avatar-text-mobile">{{ student.name.charAt(0) }}</span>
						</div>
						<div class="student-primary-info-mobile">
							<div class="student-name-mobile">{{ student.name }}</div>
							<div class="student-id-mobile">学号: {{ student.studentId }}</div>
							<div class="student-db-id-mobile">唯一ID: {{ student.id }}</div>
						</div>
						<div class="attendance-count-mobile">
							<el-icon class="attendance-icon-mobile"><Calendar /></el-icon>
							<span class="count-text-mobile">{{ studentAttendanceCounts[student.studentId] || 0 }}次</span>
						</div>
						<div class="points-info-mobile">
							<div class="points-summary-mobile">
								<span class="points-total-mobile">总积分: {{ Math.round((studentAttendanceCounts[student.studentId] || 0) * 0.64) + ((studentPoints[student.studentId] && studentPoints[student.studentId].totalPoints) || 0) }}</span>
							</div>
							<div class="points-details-mobile">
								<span class="points-type-mobile">签到: {{ Math.round((studentAttendanceCounts[student.studentId] || 0) * 0.64) }}</span>
								<span class="points-type-mobile">活动: {{ (studentPoints[student.studentId] && studentPoints[student.studentId].totalPoints) || 0 }}</span>
							</div>
						</div>
					</div>

					<div class="student-detail-row-mobile">
						<div class="student-details-mobile">
							<div class="detail-item-mobile">
								<span class="label-mobile">年级：</span>
								<span class="value-mobile">{{ student.grade }}年级</span>
							</div>
							<div class="detail-item-mobile">
								<span class="label-mobile">专业：</span>
								<span class="value-mobile">{{ student.major }}</span>
							</div>
							<div class="detail-item-mobile">
								<span class="label-mobile">班级：</span>
								<span class="value-mobile">{{ student.classNum }}班</span>
							</div>
							<div class="detail-item-mobile">
								<span class="label-mobile">性别：</span>
								<span class="value-mobile">{{ student.gender }}</span>
							</div>
							<div class="detail-item-mobile">
								<span class="label-mobile">手机：</span>
								<span class="value-mobile">{{ student.phoneNumber }}</span>
							</div>
						</div>
						<div class="student-actions-mobile">
							<el-button
								type="success"
								size="small"
								@click="openAttendanceRecordsDialog(student)"
								class="records-btn-mobile"
							>
								<el-icon><Calendar /></el-icon>
								考勤记录
							</el-button>
							<el-button
								type="warning"
								size="small"
								@click="openMakeupDialog(student)"
								class="makeup-btn-mobile"
							>
								<el-icon><Clock /></el-icon>
								补卡
							</el-button>
							<el-button
								type="info"
								size="small"
								@click="openHeatmapDialog(student)"
								class="heatmap-btn-mobile"
							>
								<el-icon><TrendCharts /></el-icon>
								热力图
							</el-button>
							<el-button
								type="primary"
								size="small"
								@click="openTrendDialog(student)"
								class="trend-btn-mobile"
							>
								<el-icon><TrendCharts /></el-icon>
								趋势图
							</el-button>
							<el-button
								type="success"
								size="small"
								@click="openPointsDialog(student)"
								class="points-btn-mobile"
							>
								<el-icon><Edit /></el-icon>
								修改积分
							</el-button>
							<el-button
								type="info"
								size="small"
								@click="openScoreChangeRecordsDialog(student)"
								class="score-records-btn-mobile"
							>
								<el-icon><Document /></el-icon>
								改分记录
							</el-button>
						</div>
					</div>

					<div class="student-management-row-mobile">
						<div class="level-management-mobile">
							<span class="management-label-mobile">学生等级：</span>
							<el-select
								:model-value="studentLevels[student.studentId] || 0"
								@change="(value) => changeLevel(student.studentId, value)"
								size="small"
								style="width: 120px;"
								:loading="isLoading"
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
						<div class="admin-management-mobile">
							<span class="management-label-mobile">所属管理员：</span>
							<div v-if="(studentLevels[student.studentId] || 0) === 3" class="admin-level-notice-mobile">
								<el-icon class="admin-icon-mobile"><UserFilled /></el-icon>
								<span>管理员身份</span>
							</div>
							<div v-else-if="adminOptions.length === 0" class="no-admin-available-mobile">
								<el-icon class="warning-icon-mobile"><Warning /></el-icon>
								<span>暂无可用的管理员</span>
							</div>
							<div v-else>
								<el-select
									:model-value="studentAdmins[student.studentId]?.adminStudentId || ''"
									@change="(value) => changeAdmin(student.studentId, value)"
									size="small"
									style="width: 180px;"
									:loading="isLoading"
									class="admin-select-mobile"
									placeholder="分配管理员"
									clearable
								>
									<el-option
										v-for="option in adminOptions"
										:key="option.value"
										:label="option.label"
										:value="option.value"
									>
										<div class="admin-option-mobile">
											<el-icon class="option-icon-mobile"><UserFilled /></el-icon>
											<div class="option-text-mobile">
												<div class="option-name-mobile">{{ option.student.name }}</div>
												<div class="option-id-mobile">{{ option.student.studentId }}</div>
											</div>
										</div>
									</el-option>
								</el-select>
							</div>
						</div>
						<div class="edit-action-mobile">
							<el-tooltip content="编辑学生信息" placement="top">
								<el-button
									type="primary"
									size="small"
									@click="openEditDialog(student)"
									:loading="isLoading"
									class="edit-btn-mobile"
								>
									<el-icon><Edit /></el-icon>
									编辑
								</el-button>
							</el-tooltip>
						</div>
					</div>
				</div>
			</div>

			<div class="table-footer-mobile">
				<div class="pagination-info-mobile">
					共 {{ currentLevelStudents.length }} 条记录
				</div>
				<el-pagination
					v-model:current-page="currentPage"
					v-model:page-size="pageSize"
					:page-sizes="[10, 20, 50, 100]"
					:total="currentLevelStudents.length"
					layout="total, sizes, prev, pager, next, jumper"
					class="pagination-mobile"
				/>
			</div>
		</div>

		<div class="admin-footer-mobile">
			<div class="footer-content-mobile">
				<div class="footer-left-mobile">
					<span>人工智能创作坊学生管理系统</span>
				</div>
				<div class="footer-right-mobile">
					<span>超级管理员模式</span>
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
							<div class="student-avatar-mobile" :class="getTimePeriodClass(record.attendanceTime)">
								{{ record.name.charAt(0) }}
							</div>
							<div class="student-details-mobile">
								<div class="student-name-mobile">{{ record.name }}</div>
								<div class="student-id-mobile">{{ record.scheduleId }}</div>
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

		<el-dialog
			v-if="attendanceRecordsDialogVisible"
			v-model="attendanceRecordsDialogVisible"
			:title="`${currentStudentInfo.name} 的考勤记录`"
			width="90%"
			:close-on-click-modal="false"
			:destroy-on-close="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="attendance-records-overlay-mobile"
			class="attendance-records-dialog-mobile"
			@close="closeAttendanceRecordsDialog"
		>
			<div class="student-info-header-mobile">
				<div class="student-avatar-large-mobile">
					{{ currentStudentInfo.name?.charAt(0) }}
				</div>
				<div class="student-info-mobile">
					<h3>{{ currentStudentInfo.name }}</h3>
					<p>学号：{{ currentStudentInfo.studentId }}</p>
					<p>专业：{{ currentStudentInfo.major }} | 年级：{{ currentStudentInfo.grade }}年级</p>
				</div>
				<div class="attendance-summary-mobile">
					<div class="summary-item-mobile">
						<span class="summary-label-mobile">总签到次数</span>
						<span class="summary-value-mobile">{{ allStudentAttendanceRecords.length }}</span>
					</div>
				</div>
			</div>

			<div class="attendance-records-container-mobile">
				<el-calendar v-model="calendarValue" :locale="zhCn" class="attendance-calendar-mobile fullcalendar-mobile">
					<template #header="{ date }">
						<div class="calendar-header-mobile">
							<div class="header-title-mobile">{{ formatCalendarTitle(date) }}</div>
							<div class="header-actions-mobile">
								<el-button size="small" @click="prevMonth">上个月</el-button>
								<el-button size="small" @click="goToday">今天</el-button>
								<el-button size="small" @click="nextMonth">下个月</el-button>
							</div>
						</div>
					</template>
					<template #date-cell="{ data }">
						<div class="calendar-cell-mobile" @click="openDateDetails(data.day)">
							<div class="cell-date-mobile">{{ data.day.split('-')[2] }}</div>
							<div class="time-slot-status-mobile">
                <span
					v-for="slot in calendarSlots"
					:key="slot.key"
					class="time-slot-mobile"
					:class="{ signed: isSlotSigned(data.day, slot.key) }"
				>
                  <span class="time-label-mobile">{{ slot.label }}</span>
                </span>
							</div>
						</div>
					</template>
				</el-calendar>
			</div>
			<template #footer>
				<div class="dialog-footer-mobile">
					<el-button @click="closeAttendanceRecordsDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<el-dialog
			v-if="showDateDetailsDialog"
			v-model="showDateDetailsDialog"
			title="签到详情"
			width="90%"
			class="date-details-dialog-mobile"
			destroy-on-close
			:close-on-click-modal="false"
			:append-to-body="true"
			:teleported="true"
		>
			<div class="date-details-content-mobile" @click.stop>
				<div class="selected-date-mobile">{{ formatDateForDisplay(selectedDate) }}</div>
				<div class="attendance-times-mobile">
					<div v-if="getDateAttendanceTimes(selectedDate).length === 0" class="no-attendance-mobile">
						该日期无签到记录
					</div>
					<div v-else>
						<div v-for="(time, index) in getDateAttendanceTimes(selectedDate)" :key="index" class="attendance-time-item-mobile">
							<el-icon class="time-icon-mobile"><Clock /></el-icon>
							<span class="time-text-mobile">{{ formatAttendanceTime(time) }}</span>
							<span class="time-slot-label-mobile">{{ getTimeSlotLabel(time) }}</span>
						</div>
					</div>
				</div>
			</div>
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
					{{ currentStudentInfo.name?.charAt(0) }}
				</div>
				<div class="student-info-mobile">
					<h3>{{ currentStudentInfo.name }}</h3>
					<p>学号：{{ currentStudentInfo.studentId }}</p>
					<p>专业：{{ currentStudentInfo.major }} | 年级：{{ currentStudentInfo.grade }}年级</p>
				</div>
				<div class="attendance-summary-mobile">
					<div class="summary-item-mobile">
						<span class="summary-label-mobile">总签到次数</span>
						<span class="summary-value-mobile">{{ allStudentAttendanceRecords.length }}</span>
					</div>
				</div>
			</div>

			<div class="chart-container">
				<div class="chart-item-mobile">
					<div class="chart-title-mobile">签到热力图</div>
					<div ref="heatmapChart" class="chart-content-mobile"></div>
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
					{{ currentStudentInfo.name?.charAt(0) }}
				</div>
				<div class="student-info-mobile">
					<h3>{{ currentStudentInfo.name }}</h3>
					<p>学号：{{ currentStudentInfo.studentId }}</p>
					<p>专业：{{ currentStudentInfo.major }} | 年级：{{ currentStudentInfo.grade }}年级</p>
				</div>
				<div class="attendance-summary-mobile">
					<div class="summary-item-mobile">
						<span class="summary-label-mobile">总签到次数</span>
						<span class="summary-value-mobile">{{ allStudentAttendanceRecords.length }}</span>
					</div>
				</div>
			</div>

			<div class="chart-container">
				<div class="chart-item-mobile">
					<div class="chart-title-mobile">签到趋势图</div>
					<div ref="lineChart" class="chart-content-mobile"></div>
				</div>
			</div>

			<template #footer>
				<div class="dialog-footer-mobile">
					<el-button @click="closeTrendDialog">关闭</el-button>
				</div>
			</template>
		</el-dialog>

		<el-dialog
			v-if="makeupDialogVisible"
			v-model="makeupDialogVisible"
			:title=null
			:close-on-click-modal="false"
			class="makeup-dialog-mobile"
			:show-close="false"
			:modal="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="makeup-overlay-mobile"
			:destroy-on-close="true"
		>
			<div class="makeup-header-mobile">
				<div class="header-icon">
					<el-icon size="28"><Clock /></el-icon>
				</div>
				<div class="header-content">
					<h3>学生补卡</h3>
					<p>为指定学生进行补卡操作</p>
				</div>
			</div>

			<div class="makeup-content-mobile">
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

				<div v-if="makeupStep === 'date'" class="makeup-step-content-mobile">
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
						class="makeup-form-content-mobile"
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
								class="makeup-date-picker-mobile"
								popper-class="makeup-date-picker-popper-mobile"
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

				<div v-if="makeupStep === 'hour'" class="makeup-step-content-mobile">
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

			<div class="makeup-footer-mobile">
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
			width="90%"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:append-to-body="true"
			:teleported="true"
			modal-class="points-dialog-overlay-mobile"
			class="points-dialog-mobile"
			@close="handlePointsDialogClose"
		>
			<div v-if="pointsSelectedStudent" class="points-student-info-mobile">
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
				<div class="dialog-footer-mobile">
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
					{{ currentScoreChangeRecordsStudent?.name?.charAt(0) || '学' }}
				</div>
				<div class="student-info-mobile">
					<h3>{{ currentScoreChangeRecordsStudent?.name || '学生' }}</h3>
					<p>学号：{{ currentScoreChangeRecordsStudent?.studentId }}</p>
					<p v-if="currentScoreChangeRecordsStudent?.major && currentScoreChangeRecordsStudent?.grade">
						专业：{{ currentScoreChangeRecordsStudent.major }} | 年级：{{ currentScoreChangeRecordsStudent.grade }}年级
					</p>
				</div>
				<div class="attendance-summary-mobile">
					<div class="summary-item-mobile">
						<span class="summary-label-mobile">总记录数</span>
						<span class="summary-value-mobile">{{ scoreChangeRecords.length }}</span>
					</div>
					<div class="summary-item-mobile">
						<span class="summary-label-mobile">总调整分数</span>
						<span class="summary-value-mobile" :class="{ positive: totalScoreChangePoints >= 0, negative: totalScoreChangePoints < 0 }">
              {{ totalScoreChangePoints > 0 ? `+${totalScoreChangePoints}` : totalScoreChangePoints }}
            </span>
					</div>
				</div>
			</div>

			<div v-if="scoreChangeRecordsLoading" class="records-loading-mobile">
				<el-icon class="is-loading"><Loading /></el-icon>
				<span>加载中...</span>
			</div>
			<div v-else-if="scoreChangeRecords.length === 0" class="records-empty-mobile">
				<el-icon><Box /></el-icon>
				<span>暂无改分记录</span>
			</div>
			<div v-else class="score-change-records-container-mobile">
				<div class="records-grid">
					<div
						v-for="(record, index) in sortedScoreChangeRecords"
						:key="index"
						class="record-card-mobile"
					>
						<div class="record-header-mobile">
							<span class="record-time-mobile">{{ formatTime(record.createTime) }}</span>
							<span class="record-points-badge-mobile" :class="{ positive: record.adjustPoints >= 0, negative: record.adjustPoints < 0 }">
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
import { onMounted, watch, ref } from 'vue'
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
import { getAvatarUrl } from '@/api/student'

// 获取ID为2的头像URL
const adminAvatarUrl = ref(getAvatarUrl(2))

const {	isAuthenticated,
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
