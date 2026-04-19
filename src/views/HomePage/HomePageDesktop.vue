<script setup>
/**
 * 首页组件(桌面端)
 *
 * @component HomePageDesktop
 * @description 展示系统介绍、快捷入口和环境保障机制
 * 主要功能:
 * 1. 展示AI坊学生管理系统的介绍和特色
 * 2. 提供快捷功能入口(登录、数据看板、考勤分析等)
 * 3. 展示环境保障机制和政策说明
 * 4. 支持主题切换功能
 *
 * @author 前端开发团队
 * @version 1.0.0
 */

// ===================== 样式和依赖导入区 =====================
// Element Plus 图标组件导入
import { TrendCharts, Lock, Star, User, OfficeBuilding, ArrowRight, Monitor } from '@element-plus/icons-vue'
import { ElIcon, ElButton } from 'element-plus'
// Vue3 响应式API导入
import { ref } from 'vue'

// 首页共用业务逻辑导入
import { useHomePageLogic } from './js/HomePage.js'
// 环境保障政策组件导入
import EnvironmentPolicy from './forms/desktop/EnvironmentPolicy.vue'
// Element Plus 基础样式导入(按需导入,减小打包体积)
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/dist/index.css'

// ===================== 类型定义 =====================

/**
 * @typedef {Object} HomePageDesktopEmits
 * @description HomePageDesktop组件的事件类型定义
 */

// ===================== 业务逻辑初始化 =====================
const {
	toggleTheme,
	goToLogin,
	goToDashboard,
	goToAdminSystem,
	goToPointsDashboard,
	goToAllMembers,
	goToAttendanceAnalysis,
	goToIPMonitor
} = useHomePageLogic()

const environmentPolicyRef = ref<InstanceType<typeof EnvironmentPolicy> | null>(null)

const showEnvironmentPolicy = () => {
	environmentPolicyRef.value?.showEnvironmentPolicy()
}
	</script>

<!-- 
  首页模板定义
  @template HomePageDesktopTemplate
  @description 定义首页桌面端的完整UI结构，包括主题切换、系统介绍、功能入口和环境保障政策弹窗
-->
<template>
	<!-- 首页根容器 -->
	<div class="home-page-desktop-container">
		<!-- 主题切换容器:固定在页面右上角 -->
		<div class="home-page-desktop-theme-toggle-container">
			<!-- 系统Logo:点击切换明暗主题 -->
			<img
				src="@/assets/AiWorkShop_icon.png"
				alt="AI坊"
				class="home-page-desktop-theme-toggle-icon"
				title="切换主题模式"
				@click="toggleTheme"
			/>
		</div>

		<!-- 主要内容区域:包含系统介绍和功能入口 -->
		<div class="home-page-desktop-hero-section">
			<div class="home-page-desktop-hero-content">
				<!-- 左侧内容区:系统介绍和操作按钮 -->
				<div class="home-page-desktop-hero-left">
					<!-- Logo和标题区域 -->
					<div class="home-page-desktop-logo-section">
						<!-- Logo容器:带发光效果 -->
						<div class="home-page-desktop-logo-container">
							<div class="home-page-desktop-logo-glow"/>
						</div>
						<!-- 主标题:系统名称 -->
						<h1 class="home-page-desktop-main-title">厦门工学院人工智能创作坊</h1>
						<!-- 副标题:系统类型 -->
						<p class="home-page-desktop-main-subtitle">学生管理系统</p>
						<!-- 标语:品牌口号 -->
						<p class="home-page-desktop-tagline">世界很大 AI无限</p>
					</div>

					<!-- 系统介绍区域 -->
					<div class="home-page-desktop-description-section">
						<!-- 介绍标题 -->
						<h2 class="home-page-desktop-section-title">欢迎使用AI坊学生管理系统</h2>
						<!-- 第一段介绍:AI坊的定位和功能 -->
						<p class="home-page-desktop-description">
							&nbsp;&nbsp;&nbsp;&nbsp;厦门工学院人工智能创作坊（
							<strong style="color: #ff6b6b;">AI坊</strong>）是学校根据智能学科发展特点，
							结合社会实际需求，依托人工智能学院雄厚师资力量而成立的实践创作基地。
							<strong style="color: #ff6b6b;">AI坊</strong>面向人工智能学院专业学生，
							构建了一个集<strong style="color: #4ecdc4;">学习</strong>、
							<strong style="color: #45b7d1;">研发</strong>、
							<strong style="color: #96ceb4;">展示推广</strong>于一体的创新平台。
						</p>
						<!-- 第二段介绍:AI坊的培养目标和愿景 -->
						<p class="home-page-desktop-description">
							&nbsp;&nbsp;&nbsp;&nbsp;我们以前沿特色项目实践为导向，
							着重培养学生的<strong style="color: #f39c12;">AI实践应用能力</strong>与
							<strong style="color: #9b59b6;">学科综合素养</strong>。同时，
							<strong style="color: #ff6b6b;">AI坊</strong>也诚挚邀请全校师生将此平台作为教学实践的沃土，
							共同实现<strong style="color: #27ae60;">教学相长</strong>与
							<strong style="color: #e67e22;">产学研深度融合</strong>的目标，
							最终提升学生的<strong style="color: #3498db;">综合实践能力</strong>与
							<strong style="color: #e74c3c;">创新竞争力</strong>，产出具有实用价值的创新成果。
						</p>
					</div>

					<!-- 操作按钮区域 -->
					<div class="home-page-desktop-action-section">
						<!-- 立即体验按钮:跳转到登录页 -->
						<el-button type="primary" class="home-page-desktop-action-button" @click="goToLogin">
							<el-icon><arrow-right /></el-icon>
							&nbsp;立即体验
						</el-button>

						<!-- 环境保障机制按钮:显示政策说明弹窗 -->
						<el-button class="home-page-desktop-environment-policy-button" @click="showEnvironmentPolicy">
							<el-icon><office-building /></el-icon>
							&nbsp;环境保障机制
						</el-button>
					</div>
				</div>

				<!-- 右侧内容区:功能卡片展示 -->
				<div class="home-page-desktop-hero-right">
					<div class="home-page-desktop-features-showcase">
						<!-- 数据看板功能卡片:点击跳转到数据看板页面 -->
						<div class="home-page-desktop-feature-card primary" title="点击查看数据看板" @click="goToDashboard">
							<div class="home-page-desktop-feature-icon">
								<el-icon><trend-charts /></el-icon>
							</div>
							<h3>数据看板</h3>
							<p>实时展示签到排行、考勤统计、成员数据</p>
						</div>

						<!-- 超级管理员系统功能卡片:点击跳转到超级管理员身份验证页面 -->
						<div class="home-page-desktop-feature-card secondary" title="点击进入超级管理员系统" @click="goToAdminSystem">
							<div class="home-page-desktop-feature-icon">
								<el-icon><lock /></el-icon>
							</div>
							<h3>超级管理员系统</h3>
							<p>管理学生信息、调整积分、处理考勤记录</p>
						</div>

						<!-- 积分看板功能卡片:点击跳转到积分看板页面 -->
						<div class="home-page-desktop-feature-card tertiary" title = "点击查看积分看板" @click="goToPointsDashboard">
							<div class="home-page-desktop-feature-icon">
								<el-icon><star /></el-icon>
							</div>
							<h3>积分看板</h3>
							<p>展示成员积分排行和优秀成员信息</p>
						</div>

						<!-- 全部成员功能卡片:点击跳转到所有成员页面 -->
						<div class="home-page-desktop-feature-card quaternary" title = "点击查看全部成员" @click="goToAllMembers">
							<div class="home-page-desktop-feature-icon">
								<el-icon><user /></el-icon>
							</div>
							<h3>全部成员</h3>
							<p>查看所有成员信息和积分排名</p>
						</div>

						<!-- 考勤分析功能卡片:点击跳转到考勤分析页面 -->
					<div class="home-page-desktop-feature-card quinary" title = "点击查看考勤趋势" @click="goToAttendanceAnalysis">
						<div class="home-page-desktop-feature-icon">
							<el-icon><trend-charts /></el-icon>
						</div>
						<h3>考勤分析</h3>
						<p>查看考勤趋势数据和统计信息</p>
					</div>

					<!-- IP监控功能卡片:点击跳转到IP监控页面 -->
					<div class="home-page-desktop-feature-card senary" title = "点击查看IP监控" @click="goToIPMonitor">
						<div class="home-page-desktop-feature-icon">
							<el-icon><monitor /></el-icon>
						</div>
						<h3>IP监控</h3>
						<p>查看AI坊内IP活跃程度和扫描统计</p>
					</div>
				</div>
				</div>
			</div>
		</div>


		<!-- 页脚区域:作者信息和联系方式 -->
		<div class="home-page-desktop-footer">
			<div class="home-page-desktop-footer-content">
				<div class="home-page-desktop-author-info">
					<p>项目作者：郑恩赐</p>
					<div class="home-page-desktop-author-links">
						<span class="home-page-desktop-author-contact">📧 zheng_enci@qq.com</span>
						<a href="https://gitee.com/zheng-enci050704" target="_blank" class="home-page-desktop-author-link">🔗 Gitee</a>
						<a href="https://juejin.cn/user/2883382090934252" target="_blank" class="home-page-desktop-author-link">📝 掘金</a>
						<a href="https://blog.csdn.net/2301_79239314" target="_blank" class="home-page-desktop-author-link">📄 CSDN</a>
						<a href="https://github.com/Zheng-Enci" target="_blank" class="home-page-desktop-author-link">🌐 GitHub</a>
						<a href="https://gitcode.com/ZhengEnCi" target="_blank" class="home-page-desktop-author-link">💻 GitCode</a>
					</div>
				</div>
			</div>
		</div>

		<EnvironmentPolicy ref="environmentPolicyRef" />

	</div>
</template>

<style scoped>
@import './css/HomePageDesktop.css';
</style>

			

<style scoped>
/* 这里应该导入外部CSS文件中的样式 */

/* 但由于我们已经在script中导入了CSS文件，这里可以保持为空或者添加一些组件特有的样式 */
</style>
