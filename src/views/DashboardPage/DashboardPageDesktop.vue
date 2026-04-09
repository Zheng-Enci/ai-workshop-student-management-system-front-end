<script setup>
/**
 * 人工智能创作坊学生管理仪表盘 - 桌面端入口
 *
 * @description 仪表盘页面入口文件，负责导入并初始化桌面端业务逻辑类
 * @component DashboardPageDesktop
 */
import { onMounted, onUnmounted } from 'vue'
import { ElButton, ElIcon, ElProgress, ElButtonGroup } from 'element-plus'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-button-group.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-progress.css'
import { ArrowLeft, Calendar, Clock, User, Setting, Star, Avatar } from '@element-plus/icons-vue'
import DashboardPageDesktopClass from './desktop/ts/DashboardPageDesktop'

const dashboardPageDesktop = new DashboardPageDesktopClass()

const goBack = () => dashboardPageDesktop.goBack()
const toggleTheme = () => dashboardPageDesktop.toggleTheme()
const switchQRType = () => dashboardPageDesktop.switchQRType()
const handleTimeRangeChange = () => dashboardPageDesktop.handleTimeRangeChange()

const gradeChart = dashboardPageDesktop.gradeChart
const majorChart = dashboardPageDesktop.majorChart
const attendanceChart = dashboardPageDesktop.attendanceChart
const progressWidth = dashboardPageDesktop.progressWidth
const currentQRType = dashboardPageDesktop.currentQRType
const selectedTimeRange = dashboardPageDesktop.selectedTimeRange
const timeRangeOptions = dashboardPageDesktop.timeRangeOptions
const monthlyAttendanceCount = dashboardPageDesktop.monthlyAttendanceCount
const todayCount = dashboardPageDesktop.todayCount
const workshopMembersCount = dashboardPageDesktop.workshopMembersCount
const levelStats = dashboardPageDesktop.levelStats
const clubMembers = dashboardPageDesktop.clubMembers
const VerificationCode = dashboardPageDesktop.getVerificationCode()

onMounted(() => {
	dashboardPageDesktop.onMounted()
})

onUnmounted(() => {
	dashboardPageDesktop.onUnmounted()
})
</script>

<template>
	<!-- 仪表盘主容器 -->
	<div class="dashboard-desktop-container dashboard-desktop-container-enter-animation">
		<!-- 头部区域：返回按钮 + 标题 + 标语 -->
		<div class="dashboard-desktop-header">
			<div class="dashboard-desktop-header-left">
				<!-- 返回按钮 -->
				<el-button
					class="dashboard-desktop-header-back-btn"
					type="primary"
					:icon="ArrowLeft"
					@click="goBack"/>
				<!-- Logo（点击切换主题） -->
				<img
					src="@/assets/AiWorkShop_icon.png"
					alt="AI坊"
					class="dashboard-desktop-header-logo"
					title="切换主题模式"
					@click="toggleTheme"/>
				<!-- 标题区域 -->
				<div class="dashboard-desktop-header-title-section">
					<h1>人工智能创作坊</h1>
					<p>Artificial Intelligence Workshop</p>
				</div>
			</div>
			<div class="dashboard-desktop-header-right">
				<!-- 标语 -->
				<div class="dashboard-desktop-header-slogan">
					<img src="@/assets/QunCeQunLiChuangXingGongXing.png" alt="群策群力，创新共行" class="dashboard-desktop-header-slogan-img"/>
				</div>
			</div>
		</div>

		<!-- 主内容区域：左侧排行榜 + 右侧学生总览 -->
		<div class="dashboard-desktop-main-content">
			<!-- 左侧区域：签到排行榜 -->
			<div class="dashboard-desktop-ranking-left-section">
				<div class="dashboard-desktop-ranking-punch-card">
					<h2>排行榜</h2>

					<!-- 排行榜图表区域 -->
					<div class="dashboard-desktop-ranking-top-students">
						<div class="dashboard-desktop-ranking-chart-header">
							<div class="dashboard-desktop-ranking-controls-section">
								<!-- 时间范围筛选器 -->
								<div class="dashboard-desktop-ranking-time-range-selector">
									<el-button-group
										size="small"
										class="time-button-group"
									>
										<el-button
											v-for="option in timeRangeOptions.filter(opt => opt.value !== 'custom')"
											:key="option.value"
											:type="selectedTimeRange === option.value ? 'primary' : 'default'"
											@click="selectedTimeRange = option.value; handleTimeRangeChange()"
										>
											{{ option.label }}
										</el-button>
									</el-button-group>
								</div>
							</div>
						</div>
						<!-- 签到排行榜图表容器 -->
						<div ref="attendanceChart" class="dashboard-desktop-ranking-attendance-chart"/>
					</div>

					<!-- 签到统计摘要 -->
					<div class="dashboard-desktop-ranking-summary-stats">
						<div class="dashboard-desktop-ranking-stats-row">
							<div class="dashboard-desktop-ranking-total-count">
								<span class="dashboard-desktop-ranking-label">
									<el-icon class="dashboard-desktop-ranking-stat-icon"><calendar/></el-icon>
									本月签到总人数
								</span>
								<span class="dashboard-desktop-ranking-value">{{ monthlyAttendanceCount }}人</span>
							</div>
							<div class="dashboard-desktop-ranking-total-count">
								<span class="dashboard-desktop-ranking-label">
									<el-icon class="dashboard-desktop-ranking-stat-icon"><clock/></el-icon>
									今日签到总人次
								</span>
								<span class="dashboard-desktop-ranking-value">{{ todayCount }}人</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 右侧区域：学生总览 -->
			<div class="dashboard-desktop-overview-right-section">
				<div class="dashboard-desktop-overview-overview-card">
					<h2>学生总览</h2>

					<!-- 图表容器：年级分布 + 专业分布 -->
					<div class="dashboard-desktop-overview-charts-container">
						<div class="dashboard-desktop-overview-chart-section">
							<h3>年级分布</h3>
							<div ref="gradeChart" class="dashboard-desktop-overview-chart"/>
						</div>

						<div class="dashboard-desktop-overview-chart-section">
							<h3>专业分布</h3>
							<div ref="majorChart" class="dashboard-desktop-overview-chart"/>
						</div>
					</div>

					<!-- 文明公约区域 -->
					<div class="dashboard-desktop-overview-environment-mechanism">
						<div class="dashboard-desktop-overview-mechanism-card">
							<h2>AI 坊文明公约</h2>

							<div class="dashboard-desktop-overview-mechanism-content">
								<div class="dashboard-desktop-overview-mechanism-section">
									<p>
										厦门工学院人工智能创作坊环境保障机制适用于所有入坊师生，
										遵循"谁使用，谁负责；人走场清，物归原位；共同维护"原则。
										个人工位需人走椅归、桌面整洁、垃圾自清；公共区域保持地面无杂物、设备用后归位；
										最后离开者需关闭照明空调、关好门窗。使用者为第一责任人，
										团队值日督促规范，管理员巡查，违规者暂停使用权限并承担相应责任。
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- 学生统计摘要 -->
					<div class="dashboard-desktop-overview-summary-stats">
						<div class="dashboard-desktop-overview-stats-row">
							<div class="dashboard-desktop-overview-total-count">
								<span class="dashboard-desktop-overview-label">
									<el-icon class="dashboard-desktop-overview-stat-icon"><user/></el-icon>
									坊内成员人数
								</span>
								<span class="dashboard-desktop-overview-value">{{ workshopMembersCount }}人</span>
							</div>
							<!-- 等级统计 -->
							<div class="dashboard-desktop-overview-level-stats">
								<div class="dashboard-desktop-overview-level-item dashboard-desktop-overview-admin-level">
									<div class="dashboard-desktop-overview-level-icon">
										<el-icon>
											<setting/>
										</el-icon>
									</div>
									<div class="dashboard-desktop-overview-level-content">
										<span class="dashboard-desktop-overview-level-label">管理员</span>
										<span class="dashboard-desktop-overview-level-value">{{ levelStats.admin }}人</span>
									</div>
								</div>
								<div class="dashboard-desktop-overview-level-item dashboard-desktop-overview-core-level">
									<div class="dashboard-desktop-overview-level-icon">
										<el-icon>
											<star/>
										</el-icon>
									</div>
									<div class="dashboard-desktop-overview-level-content">
										<span class="dashboard-desktop-overview-level-label">核心成员</span>
										<span class="dashboard-desktop-overview-level-value">{{ levelStats.core }}人</span>
									</div>
								</div>
								<div class="dashboard-desktop-overview-level-item dashboard-desktop-overview-normal-level">
									<div class="dashboard-desktop-overview-level-icon">
										<el-icon>
											<avatar/>
										</el-icon>
									</div>
									<div class="dashboard-desktop-overview-level-content">
										<span class="dashboard-desktop-overview-level-label">普通成员</span>
										<span class="dashboard-desktop-overview-level-value">{{ levelStats.normal }}人</span>
									</div>
								</div>
								<div class="dashboard-desktop-overview-level-item dashboard-desktop-overview-club-level">
									<div class="dashboard-desktop-overview-level-icon">
										<el-icon>
											<user/>
										</el-icon>
									</div>
									<div class="dashboard-desktop-overview-level-content">
										<span class="dashboard-desktop-overview-level-label">社团成员</span>
										<span class="dashboard-desktop-overview-level-value">{{ clubMembers }}人</span>
									</div>
								</div>
							</div>
							<!-- 系统信息 -->
							<div class="dashboard-desktop-overview-system-info">
								<div class="dashboard-desktop-overview-system-name">人工智能创作坊</div>
								<div class="dashboard-desktop-overview-system-subtitle">智慧学生管理系统</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 底部进度条 -->
		<div class="dashboard-desktop-footer-container">
			<el-progress
				:percentage="progressWidth"
				:show-text="false"
				:stroke-width="4"
				color="#fff"
			/>
		</div>

		<!-- 手机展示区域：验证码 + 二维码 -->
		<div class="dashboard-desktop-phone-display-container">
			<!-- 签到验证码卡片 -->
			<div class="dashboard-desktop-verification-code-card">
				<div class="dashboard-desktop-verification-code-label">签到验证码</div>
				<div class="dashboard-desktop-verification-code-value">
					<!-- 根据验证码状态显示不同内容 -->
					<span v-if="VerificationCode.getVerificationCodeStatus() === '本机无权获取验证码'"
						  style="font-size: 19px;padding: 10px 10px;">本机无权获取验证码</span>
					<span v-else-if="VerificationCode.getVerificationCodeStatus() === '验证码获取失败'"
						  style="font-size: 19px;">验证码获取失败</span>
					<div v-else-if="VerificationCode.getVerificationCodeStatus() === '正在申请获取验证码'">
					<span
						style="font-size: 16px;padding: 10px 10px;">正在申请获取验证码...</span>
						<ElProgress
							:percentage="VerificationCode.remainingTimePercent"
							:show-text="false"
							color="#409EFF"
						/>
					</div>
					<div v-else-if="VerificationCode.getVerificationCodeStatus() === '验证码'">
						<span>{{ VerificationCode.getVerificationCodeData() }}</span>
						<ElProgress
							:percentage="VerificationCode.remainingTimePercent"
							:show-text="false"
							color="#409EFF"
						/>
					</div>
				</div>
			</div>

			<!-- 网站二维码 -->
			<div v-if="currentQRType === 'website'" class="dashboard-desktop-qrcode-website-section">
				<img src="@/assets/ShouJiDuanQianDanRuKou.png" alt="手机端签到入口" class="dashboard-desktop-qrcode-website-code"/>
				<div
					class="dashboard-desktop-qrcode-website-text"
					:style="{
						'font-weight': '800 !important',
						'color': '#60a5fa !important',
						'text-shadow': '0 0 8px rgb(96 165 250 / 1) !important'
					}"
				>
					手机端签到入口
				</div>
			</div>

			<!-- 微信二维码 -->
			<div v-if="currentQRType === 'wechat'" class="dashboard-desktop-qrcode-wechat-section">
				<img src="@/assets/ErWeiMa.png" alt="公众号二维码" class="dashboard-desktop-qrcode-code"/>
				<div
					class="dashboard-desktop-qrcode-text"
					:style="{
						'font-weight': '800 !important',
						'color': '#60a5fa !important',
						'text-shadow': '0 0 8px rgb(96 165 250 / 1) !important'
					}"
				>
					扫码了解更多
				</div>
			</div>

			<!-- 二维码切换按钮 -->
			<div class="dashboard-desktop-qrcode-switch-buttons">
				<el-button
					class="dashboard-desktop-qrcode-switch-btn"
					type="primary"
					@click="switchQRType"
				>
					{{ currentQRType === 'website' ? '切换到公众号' : '切换到签到入口' }}
				</el-button>
			</div>

			<!-- 手机背景图 -->
			<img src="@/assets/Phone.png" alt="手机展示" class="dashboard-desktop-qrcode-phone-image"/>
		</div>
	</div>
</template>

<!-- 全局样式：头部区域 -->
<style>
@import './desktop/css/dashboard-desktop-header.css';
@import './desktop/css/dashboard-desktop-ranking.css';
@import './desktop/css/dashboard-desktop-overview.css';
@import './desktop/css/dashboard-desktop-verification.css';
@import './desktop/css/dashboard-desktop-qrcode.css';
@import './desktop/css/dashboard-desktop-qrcode-switch.css';
@import './desktop/css/dashboard-desktop-phone-display.css';
@import './desktop/css/dashboard-desktop-footer.css';
@import './desktop/css/DashboardPageDesktop.css';
</style>
