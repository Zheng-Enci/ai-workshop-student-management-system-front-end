<script setup lang="ts">
/**
 * 签到页面组件(移动端)
 *
 * @description 学生签到功能页面,展示当前时段签到状态和历史记录(移动端)
 * @component AttendancePageMobile
 * @author 开发人员
 * @version 1.0.0
 */

// ======================== 依赖导入区 ========================
// Element Plus 组件及消息提示
import {ElButton, ElDialog, ElIcon, ElInput} from 'element-plus'
// Vue3 核心响应式API及生命周期钩子
import {onMounted, onUnmounted} from 'vue'
// Element Plus 基础样式（按需导入）
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-overlay.css'
// 本周签到概览样式
import './mobile/css/attendance-mobile-weekly-overview.css'
// Element Plus 组件样式覆盖
import './mobile/css/attendance-mobile-element-plus-overrides.css'
// Element Plus 图标组件
import {ArrowLeft, Check, Clock, Loading, Monitor, Moon, Sunny, Sunrise, User} from '@element-plus/icons-vue'
// 页面组件
import LoadingMask from '@/components/LoadingMask.vue'
// 页面控制器
import AttendancePageMobileController from '@/views/AttendancePage/mobile/ts/AttendancePageMobileController'
import flameGif from '@/assets/flame.gif'
import flameGrayStaticGif from '@/assets/flame-gray-static.gif'

// ======================== 控制器实例化 ========================
/**
 * 页面控制器实例
 * 封装所有业务逻辑和状态管理
 */
const controller = new AttendancePageMobileController()

// ======================== 生命周期钩子 ========================
/**
 * 组件挂载完成钩子
 * 初始化页面数据
 */
onMounted(() => {
	controller.onMounted()
})

/**
 * 组件卸载前钩子
 * 清理定时器等资源
 */
onUnmounted(() => {
	controller.onUnmounted()
})
</script>

<template>
	<!-- 加载蒙版 -->
	<LoadingMask/>

	<!-- 移动端签到页面根容器 -->
	<div class="attendance-mobile-background-container-mobile">
		<!-- 背景装饰效果：渐变浮动圆球 -->
		<div class="attendance-mobile-background-effects-mobile">
			<div class="attendance-mobile-background-orb-mobile attendance-mobile-background-orb-1"/>
			<div class="attendance-mobile-background-orb-mobile attendance-mobile-background-orb-2"/>
			<div class="attendance-mobile-background-orb-mobile attendance-mobile-background-orb-3"/>
		</div>

		<!-- 内容包裹层：所有业务内容容器 -->
		<div class="attendance-page-mobile-content-wrapper-mobile">
			<!-- 返回按钮：固定在左上角，点击返回导航页 -->
			<el-button
				type="primary"
				class="attendance-page-mobile-nav-button-mobile"
				:icon="ArrowLeft"
				@click="controller.goToNavigation()"
			>
				返回
			</el-button>

			<!-- 页面头部：logo、头像、标题 -->
			<div class="attendance-mobile-header-header-mobile">
				<!-- 左侧：Logo和标题 -->
				<div class="attendance-mobile-header-left-mobile">
					<!-- 系统logo：点击切换明暗主题 -->
					<img
						src="@/assets/AiWorkShop_icon.png"
						alt="AI坊学生管理系统"
						class="attendance-mobile-header-logo-mobile"
						title="切换主题模式"
						@click="controller.toggleTheme()"/>
					<!-- 页面标题区域 -->
					<div class="attendance-mobile-header-titles-mobile">
						<h1 class="attendance-mobile-header-title-mobile">AI坊学生签到</h1>
						<p class="attendance-mobile-header-subtitle-mobile">智能签到系统</p>
					</div>
				</div>
				<!-- 右侧：用户头像 -->
				<!-- 用户头像容器：点击跳转到个人资料页 -->
				<div class="attendance-mobile-header-avatar-mobile" 
					 :class="{ 'has-avatar': controller.hasAvatar.value, 'no-avatar': !controller.hasAvatar.value }"
					 @click="controller.handleAvatarClick()">
					<!-- 自定义头像：懒加载 -->
					<img
						v-if="controller.hasAvatar.value && controller.avatarUrl.value"
						v-lazy="controller.avatarUrl.value"
						:src="controller.avatarUrl.value"
						alt="用户头像"
						class="attendance-mobile-header-avatar-image-mobile"/>
					<!-- 默认头像图标：无自定义头像时显示 -->
					<el-icon v-else size="24" class="attendance-mobile-header-avatar-icon-mobile">
						<User/>
					</el-icon>
				</div>
				<!-- 火焰图标：本周签到≥1次时显示 -->
				<div class="attendance-mobile-flame-mobile">
					<img :src="controller.flameController.weeklyCount >= 3 ? flameGif : flameGrayStaticGif" 
						 alt="火焰" 
						 class="attendance-mobile-flame-image-mobile"/>
					<span class="attendance-mobile-flame-count-mobile">{{ controller.flameController.displayCount }}</span>
				</div>
			</div>

			<!-- 主内容区：签到按钮和状态卡片 -->
			<div class="attendance-page-mobile-main-content-mobile">
				<!-- 本周签到概览：展示本周每天的签到状态 -->
				<div class="attendance-mobile-weekly-overview-mobile">
					<div class="attendance-mobile-weekly-overview-title-mobile">本周签到概览</div>
					<div class="attendance-mobile-weekly-overview-grid-mobile">
						<div v-for="(day, index) in controller.weeklyAttendanceData.value" 
							 :key="day.date"
							 class="attendance-mobile-weekly-overview-day-mobile"
							 :class="{
								 'today': day.isToday,
								 'future': day.isFuture,
								 'circle-animate': controller.showCircleAnimation.value
							 }"
							 :style="{ animationDelay: `${index * 0.15}s` }">
							<div class="attendance-mobile-weekly-overview-circle-mobile"
								 :class="controller.getSlotClass(day.slots)">
								<span class="slot-count">{{ controller.getSignedCount(day.slots) }}</span>
							</div>
							<div class="attendance-mobile-weekly-overview-day-name-mobile">{{ day.dayName }}</div>
						</div>
					</div>
				</div>

				<!-- 签到按钮容器 -->
			<div class="attendance-mobile-sign-button-container-mobile">
				<div
					class="attendance-mobile-sign-button-button-mobile"
					role="button"
					tabindex="0"
					:aria-disabled="controller.loading.value || !controller.isInSignTime.value || controller.isCurrentSlotSigned()"
					:class="{
						'loading': controller.loading.value,
						'disabled': !controller.isInSignTime.value || controller.isCurrentSlotSigned(),
						'success': controller.isInSignTime.value && controller.isCurrentSlotSigned(),
						'morning': controller.getCurrentTimeSlot() === 'morning',
						'afternoon': controller.getCurrentTimeSlot() === 'afternoon',
						'evening': controller.getCurrentTimeSlot() === 'evening'
					}"
					@click="!controller.loading.value && !(!controller.isInSignTime.value || controller.isCurrentSlotSigned()) && controller.submitAttendance()"
					@keydown.enter="!controller.loading.value && !(!controller.isInSignTime.value || controller.isCurrentSlotSigned()) && controller.submitAttendance()">
					<span class="attendance-mobile-sign-button-background-mobile"/>
					<span class="attendance-mobile-sign-button-content-mobile">
						<span class="attendance-mobile-sign-button-icon-container-mobile">
							<el-icon v-if="!controller.loading.value && controller.isInSignTime.value && !controller.isCurrentSlotSigned()"
								 size="40"
								 class="attendance-mobile-sign-button-main-icon-mobile">
								<Check/>
							</el-icon>
							<el-icon v-else-if="!controller.loading.value && controller.isInSignTime.value && controller.isCurrentSlotSigned()"
								 size="40"
								 class="attendance-mobile-sign-button-main-icon-mobile attendance-mobile-sign-button-main-icon-mobile-success-icon-mobile">
								<Check/>
							</el-icon>
							<el-icon v-else-if="!controller.loading.value && !controller.isInSignTime.value"
								 size="40"
								 class="attendance-mobile-sign-button-main-icon-mobile attendance-mobile-sign-button-main-icon-mobile-disabled-icon-mobile">
								<Clock/>
							</el-icon>
							<el-icon v-else
								 size="28"
								 class="attendance-mobile-sign-button-main-icon-mobile attendance-mobile-sign-button-main-icon-mobile-loading-icon-mobile">
								<Loading/>
							</el-icon>
						</span>
						<span v-if="!controller.loading.value" class="attendance-mobile-sign-button-text-mobile">
							{{ !controller.isInSignTime.value ? '非签到时间' : (controller.isCurrentSlotSigned() ? '已签到' : '点击签到') }}
						</span>
						<span v-else class="attendance-mobile-sign-button-text-mobile attendance-mobile-sign-button-text-mobile-loading-text-mobile">
							签到中...
						</span>
					</span>
					<span class="attendance-mobile-sign-button-ripple-mobile"/>
				</div>
			</div>

				<!-- 签到状态卡片组：展示早中晚三个时段的签到状态 -->
				<div class="attendance-mobile-status-cards-cards-mobile">
					<!-- 上午签到状态卡片 -->
					<div class="attendance-mobile-status-cards-card-mobile morning"
						 :class="{ 'active': controller.getCurrentTimeSlot() === 'morning', 'signed': controller.isSlotSigned('morning') }">
						<div class="attendance-mobile-status-cards-card-icon-mobile">
							<el-icon>
								<Sunrise/>
							</el-icon>
						</div>
						<div class="attendance-mobile-status-cards-card-content-mobile">
							<div class="attendance-mobile-status-cards-card-title-mobile">上午签到</div>
							<div class="attendance-mobile-status-cards-card-time-mobile">08:00 - 11:00</div>
							<div class="attendance-mobile-status-cards-card-status-mobile" 
								 :class="{ 'signed': controller.isSlotSigned('morning') }">
								{{ controller.isSlotSigned('morning') ? '已签到' : '未签到' }}
							</div>
						</div>
					</div>

					<!-- 下午签到状态卡片 -->
					<div class="attendance-mobile-status-cards-card-mobile afternoon"
						 :class="{ 'active': controller.getCurrentTimeSlot() === 'afternoon', 'signed': controller.isSlotSigned('afternoon') }">
						<div class="attendance-mobile-status-cards-card-icon-mobile">
							<el-icon>
								<Sunny/>
							</el-icon>
						</div>
						<div class="attendance-mobile-status-cards-card-content-mobile">
							<div class="attendance-mobile-status-cards-card-title-mobile">下午签到</div>
							<div class="attendance-mobile-status-cards-card-time-mobile">14:00 - 17:00</div>
							<div class="attendance-mobile-status-cards-card-status-mobile" 
								 :class="{ 'signed': controller.isSlotSigned('afternoon') }">
								{{ controller.isSlotSigned('afternoon') ? '已签到' : '未签到' }}
							</div>
						</div>
					</div>

					<!-- 晚上签到状态卡片 -->
					<div class="attendance-mobile-status-cards-card-mobile evening"
						 :class="{ 'active': controller.getCurrentTimeSlot() === 'evening', 'signed': controller.isSlotSigned('evening') }">
						<div class="attendance-mobile-status-cards-card-icon-mobile">
							<el-icon>
								<Moon/>
							</el-icon>
						</div>
						<div class="attendance-mobile-status-cards-card-content-mobile">
							<div class="attendance-mobile-status-cards-card-title-mobile">晚上签到</div>
							<div class="attendance-mobile-status-cards-card-time-mobile">19:00 - 22:00</div>
							<div class="attendance-mobile-status-cards-card-status-mobile" 
								 :class="{ 'signed': controller.isSlotSigned('evening') }">
								{{ controller.isSlotSigned('evening') ? '已签到' : '未签到' }}
							</div>
						</div>
					</div>
				</div>

				<!-- 桌面端提示卡片：引导用户在电脑端查看详细记录 -->
				<div class="attendance-mobile-desktop-tip-card-card-mobile">
					<div class="attendance-mobile-desktop-tip-card-icon-mobile">
						<el-icon>
							<Monitor/>
						</el-icon>
					</div>
					<div class="attendance-mobile-desktop-tip-card-content-mobile">
						<p class="attendance-mobile-desktop-tip-card-text-mobile">
							💡 提示：如需查看详细签到记录和历史数据，请在电脑端访问
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- 验证码弹窗：输入6位数字验证码完成签到 -->
		<el-dialog
			v-model="controller.showVerificationCodeDialog.value"
			title="输入签到验证码"
			width="90%"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:lock-scroll="false"
			class="attendance-page-mobile-verification-code-dialog-mobile"
		>
			<div class="attendance-page-mobile-verification-code-content-mobile">
				<!-- 验证码提示文本 -->
				<div class="attendance-page-mobile-verification-code-hint-mobile">
					<p>请输入6位数字验证码</p>
				</div>
				<!-- 验证码输入框：限制6位数字，回车提交 -->
				<el-input
					v-model="controller.inputVerificationCode.value"
					placeholder="请输入验证码"
					maxlength="6"
					class="attendance-page-mobile-verification-code-input-mobile"
					@keyup.enter="controller.submitVerificationCode()"
				/>
				<!-- 弹窗操作按钮：取消/确认 -->
				<div class="attendance-page-mobile-verification-code-actions-mobile">
					<el-button @click.stop="controller.cancelVerificationCode()">取消</el-button>
					<el-button type="primary" 
							   :loading="controller.loading.value" 
							   @click.stop="controller.submitVerificationCode()">
						确认
					</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<style scoped>
@import './mobile/css/AttendancePageMobile.css';
@import './mobile/css/attendance-mobile-background.css';
@import './mobile/css/attendance-mobile-sign-button.css';
@import './mobile/css/attendance-mobile-header.css';
@import './mobile/css/attendance-mobile-status-cards.css';
@import './mobile/css/attendance-mobile-desktop-tip-card.css';
</style>
