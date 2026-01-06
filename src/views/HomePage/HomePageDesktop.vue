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
// 导入桌面端首页样式文件
import './css/HomePageDesktop.css'
// Element Plus 图标组件导入
import { TrendCharts, Calendar, Star, User, OfficeBuilding, ArrowRight } from '@element-plus/icons-vue'
// Element Plus 核心组件导入
import { ElIcon, ElDialog, ElButton } from 'element-plus'
// Vue3 响应式API导入
import { ref } from 'vue'

// 首页共用业务逻辑导入
import { useHomePageLogic } from './js/HomePage.js'
// Element Plus 基础样式导入(按需导入,减小打包体积)
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/dist/index.css'

// ===================== 类型定义 =====================
/**
 * @typedef {Object} HomePageDesktopProps
 * @description HomePageDesktop组件的属性类型定义
 */

/**
 * @typedef {Object} HomePageDesktopEmits
 * @description HomePageDesktop组件的事件类型定义
 */

// ===================== 业务逻辑初始化 =====================
/**
 * 使用首页共用逻辑
 * @description 从共用逻辑模块解构出页面跳转和主题切换方法
 * 包含的方法:
 * - toggleTheme: 切换明暗主题
 * - goToLogin: 跳转到登录页
 * - goToDashboard: 跳转到数据看板
 * - goToAttendanceAnalysis: 跳转到考勤分析
 * - goToPointsDashboard: 跳转到积分看板
 * - goToAllMembers: 跳转到所有成员页面
 */
const {
	toggleTheme,
	goToLogin,
	goToDashboard,
	goToAttendanceAnalysis,
	goToPointsDashboard,
	goToAllMembers
} = useHomePageLogic()

/**
 * 导出组件供模板使用
 * @description 使用defineExpose暴露组件实例,供父组件或模板引用
 */
defineExpose({
	ElIcon
})

// ===================== 桌面端特有逻辑 =====================
		/**
		 * 环境保障政策弹窗显示状态
		 * @type {Ref<boolean>}
		 * @description 控制环境保障政策说明弹窗的显示/隐藏
		 */
		const environmentPolicyVisible = ref(false)
		/**
		 * 环境保障政策弹窗关闭状态标记
		 * @type {Ref<boolean>}
		 * @description 防止弹窗关闭动画期间的重复关闭操作
		 */
		const isClosingEnvironmentPolicy = ref(false)

		/**
		 * 显示环境保障政策弹窗
		 * @function showEnvironmentPolicy
		 * @description 点击相关按钮时触发,显示环境保障政策说明弹窗
		 */
		const showEnvironmentPolicy = () => {
			environmentPolicyVisible.value = true
		}

		/**
		 * 关闭环境保障政策弹窗
		 * @function closeEnvironmentPolicy
		 * @description 关闭弹窗并处理关闭动画,防止重复关闭和视觉闪烁
		 * 流程:
		 * 1. 检查是否正在关闭,防止重复操作
		 * 2. 手动隐藏遮罩层,避免视觉闪烁
		 * 3. 关闭弹窗
		 * 4. 重置关闭状态标记
		 */
		const closeEnvironmentPolicy = () => {
			// 防止重复关闭:如果正在关闭中,直接返回
			if (isClosingEnvironmentPolicy.value) { return }
			// 标记为正在关闭状态
			isClosingEnvironmentPolicy.value = true

			// 先手动隐藏遮罩层,避免视觉闪烁
			// 通过DOM操作直接控制遮罩层的显示状态
			const dialogWrapper = document.querySelector('.environment-policy-overlay')
			if (dialogWrapper) {
				dialogWrapper.style.display = 'none'
				dialogWrapper.style.visibility = 'hidden'
				dialogWrapper.style.opacity = '0'
			}

			// 关闭弹窗:更新响应式状态
			environmentPolicyVisible.value = false

			// 重置关闭状态:在下一个事件循环中重置标记
			// 确保关闭动画完成后才能再次关闭
			setTimeout(() => {
				isClosingEnvironmentPolicy.value = false
			}, 0)
		}

		// ===================== 组件导出 =====================
		/**
		 * 导出HomePageDesktop组件
		 * @exports HomePageDesktop
		 * @description 导出桌面端首页组件，包含系统介绍、功能入口和环境保障政策说明
		 * @property {Object} setup - 组件的setup函数，包含所有响应式数据和方法
		 * @property {Function} setup.toggleTheme - 切换主题模式的方法
		 * @property {Function} setup.goToLogin - 跳转到登录页的方法
		 * @property {Function} setup.goToDashboard - 跳转到数据看板的方法
		 * @property {Function} setup.goToAttendanceAnalysis - 跳转到考勤分析的方法
		 * @property {Function} setup.goToPointsDashboard - 跳转到积分看板的方法
		 * @property {Function} setup.goToAllMembers - 跳转到所有成员页面的方法
		 * @property {Ref<boolean>} setup.environmentPolicyVisible - 环境保障政策弹窗显示状态
		 * @property {Ref<boolean>} setup.isClosingEnvironmentPolicy - 环境保障政策弹窗关闭状态标记
		 * @property {Function} setup.showEnvironmentPolicy - 显示环境保障政策弹窗的方法
		 * @property {Function} setup.closeEnvironmentPolicy - 关闭环境保障政策弹窗的方法
		 */
	</script>

<!-- 
  首页模板定义
  @template HomePageDesktopTemplate
  @description 定义首页桌面端的完整UI结构，包括主题切换、系统介绍、功能入口和环境保障政策弹窗
-->
<template>
	<!-- 首页根容器 -->
	<div class="home-container">
		<!-- 主题切换容器:固定在页面右上角 -->
		<div class="theme-toggle-container">
			<!-- 系统Logo:点击切换明暗主题 -->
			<img
				src="@/assets/AiWorkShop_icon.png"
				alt="AI坊"
				class="theme-toggle-icon"
				title="切换主题模式"
				@click="toggleTheme"
			/>
		</div>

		<!-- 主要内容区域:包含系统介绍和功能入口 -->
		<div class="hero-section">
			<div class="hero-content">
				<!-- 左侧内容区:系统介绍和操作按钮 -->
				<div class="hero-left">
					<!-- Logo和标题区域 -->
					<div class="logo-section">
						<!-- Logo容器:带发光效果 -->
						<div class="logo-container">
							<div class="logo-glow"/>
						</div>
						<!-- 主标题:系统名称 -->
						<h1 class="main-title">厦门工学院人工智能创作坊</h1>
						<!-- 副标题:系统类型 -->
						<p class="main-subtitle">学生管理系统</p>
						<!-- 标语:品牌口号 -->
						<p class="tagline">世界很大 AI无限</p>
					</div>

					<!-- 系统介绍区域 -->
					<div class="description-section">
						<!-- 介绍标题 -->
						<h2 class="section-title">欢迎使用AI坊学生管理系统</h2>
						<!-- 第一段介绍:AI坊的定位和功能 -->
						<p class="description">
							&nbsp;&nbsp;&nbsp;&nbsp;厦门工学院人工智能创作坊（
							<strong style="color: #ff6b6b;">AI坊</strong>）是学校根据智能学科发展特点，
							结合社会实际需求，依托人工智能学院雄厚师资力量而成立的实践创作基地。
							<strong style="color: #ff6b6b;">AI坊</strong>面向人工智能学院专业学生，
							构建了一个集<strong style="color: #4ecdc4;">学习</strong>、
							<strong style="color: #45b7d1;">研发</strong>、
							<strong style="color: #96ceb4;">展示推广</strong>于一体的创新平台。
						</p>
						<!-- 第二段介绍:AI坊的培养目标和愿景 -->
						<p class="description">
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
					<div class="action-section">
						<!-- 立即体验按钮:跳转到登录页 -->
						<el-button type="primary" class="action-button" @click="goToLogin">
							<el-icon><arrow-right /></el-icon>
							&nbsp;立即体验
						</el-button>

						<!-- 环境保障机制按钮:显示政策说明弹窗 -->
						<el-button class="environment-policy-button" @click="showEnvironmentPolicy">
							<el-icon><office-building /></el-icon>
							&nbsp;环境保障机制
						</el-button>
					</div>
				</div>

				<!-- 右侧内容区:功能卡片展示 -->
				<div class="hero-right">
					<div class="features-showcase">
						<!-- 数据看板功能卡片:点击跳转到数据看板页面 -->
						<div class="feature-card primary" title="点击查看数据看板" @click="goToDashboard">
							<div class="feature-icon">
								<el-icon><trend-charts /></el-icon>
							</div>
							<h3>数据看板</h3>
							<p>实时展示签到排行、考勤统计、成员数据</p>
						</div>

						<!-- 考勤分析功能卡片:点击跳转到考勤分析页面 -->
						<div class="feature-card secondary" title="点击查看考勤分析" @click="goToAttendanceAnalysis">
							<div class="feature-icon">
								<el-icon><calendar /></el-icon>
							</div>
							<h3>签到分析</h3>
							<p>可视化展示签到趋势、出勤率统计</p>
						</div>

						<!-- 积分看板功能卡片:点击跳转到积分看板页面 -->
						<div class="feature-card tertiary" title = "点击查看积分看板" @click="goToPointsDashboard">
							<div class="feature-icon">
								<el-icon><star /></el-icon>
							</div>
							<h3>积分看板</h3>
							<p>展示成员积分排行和优秀成员信息</p>
						</div>

						<!-- 全部成员功能卡片:点击跳转到所有成员页面 -->
						<div class="feature-card quaternary" title = "点击查看全部成员" @click="goToAllMembers">
							<div class="feature-icon">
								<el-icon><user /></el-icon>
							</div>
							<h3>全部成员</h3>
							<p>查看所有成员信息和积分排名</p>
						</div>
					</div>
				</div>
			</div>
		</div>


		<!-- 页脚区域:作者信息和联系方式 -->
		<div class="footer">
			<div class="footer-content">
				<div class="author-info">
					<!-- 作者名称 -->
					<p>项目作者：郑恩赐</p>
					<!-- 作者联系方式:邮箱和社交媒体链接 -->
					<div class="author-links">
						<span class="author-contact">📧 zheng_enci@qq.com</span>
						<a href="https://gitee.com/zheng-enci050704" target="_blank" class="author-link">🔗 Gitee</a>
						<a href="https://juejin.cn/user/2883382090934252" target="_blank" class="author-link">📝 掘金</a>
					</div>
				</div>
			</div>
		</div>

		<!-- 环境保障机制弹窗:显示AI坊的日常环境保障政策 -->
		<el-dialog
			v-if="environmentPolicyVisible"
			v-model="environmentPolicyVisible"
			title="厦门工学院人工智能创作坊日常环境保障机制"
			width="80%"
			:before-close="closeEnvironmentPolicy"
			:close-on-click-modal="false"
			:destroy-on-close="true"
			:append-to-body="true"
			:teleported="true"
			modal-class="environment-policy-overlay"
			class="environment-policy-dialog"
		>
			<div class="environment-policy-content">
				<div class="policy-section">
					<h3 class="section-title">
						<el-icon><office-building /></el-icon>
						第一章 总则
					</h3>
					<div class="policy-content">
						<p>
							<strong>第一条 目的：</strong>
							为保障厦门工学院人工智能创作坊（以下简称"创作坊"）拥有整洁、舒适、安全、高效的工作与学习环境，
							维护设备安全，培养使用者良好习惯，提升空间利用效率，特制定本保障机制。
						</p>
						<p><strong>第二条 适用范围：</strong>本机制适用于所有进入并使用创作坊的师生。</p>
						<p><strong>第三条 核心原则：</strong>“谁使用，谁负责；人走场清，物归原位；共同维护，持续改进”。</p>
					</div>
				</div>

				<div class="policy-section">
					<h3 class="section-title">
						<el-icon><office-building /></el-icon>
						第二章 日常行为规范
					</h3>
					<div class="policy-content">
						<p><strong>第四条 个人工位区域（桌椅）管理：</strong></p>
						<ol>
							<li><strong>人走椅归：</strong>使用者离开工位时，必须将座椅完全推入桌下，保持整齐划一，不得阻碍通道。</li>
							<li>
								<strong>桌面整洁：</strong>
								<ul>
									<li>
										<strong>物品精简：</strong>
										桌面仅限放置与当前工作/学习直接相关的设备（如电脑、开发板）、资料、必要文具及饮用水杯。
										严禁堆放食物、零食等无关杂物。
									</li>
									<li><strong>资料规整：</strong>文件、书籍、笔记本、科研设备等应整齐摆放或及时收纳，避免杂乱无章。</li>
									<li><strong>桌面整洁：</strong>离开前需清理桌面灰尘、碎屑、水渍、污迹，保持桌面清洁。</li>
								</ul>
							</li>
							<li>
								<strong>垃圾自清：</strong>
								个人产生的废纸、饮料瓶、零食包装等垃圾，必须自行投入指定垃圾桶内，
								不得遗留在桌面或地面。垃圾桶内垃圾超过3/4时，应将垃圾打包带走，换上新的垃圾袋。
							</li>
						</ol>

						<p><strong>第五条 公共区域及地面卫生：</strong></p>
						<ol>
							<li><strong>公共责任：</strong>所有使用者均有责任维护公共区域（如过道、讨论区、设备陈列区周边）的整洁。</li>
							<li><strong>地面无杂物：</strong>不得随意丢弃任何物品（包括纸屑、线缆、工具、个人物品等）在地面。发现地面有垃圾或杂物，人人有责随手捡起投入垃圾桶。</li>
							<li><strong>液体防护：</strong>小心取用液体（水、饮料），如有泼洒，需立即清理干净，防止滑倒及损坏设备或地面。</li>
							<li><strong>设备线缆：</strong>使用公共设备（如显示器、打印机、排插）时，线缆应尽量整理，避免缠绕绊脚。使用完毕应恢复原状。</li>
							<li><strong>使用后复原：</strong>使用公共设备（如机械臂、实验小车、VR设备等）后，必须将其关闭、线缆整理归位、相关配件放回原处，恢复设备区初始整洁状态。</li>
						</ol>

						<p><strong>第六条 节能与安全：</strong></p>
						<ol>
							<li><strong>人走灯灭：</strong>最后离开创作坊（或创作坊内独立区域/房间）的人员，有责任检查并关闭该区域所有照明灯具（包括主灯、氛围灯、台灯等）。</li>
							<li><strong>空调/风扇管理：</strong>夏季空调温度设定建议不低于22℃。最后离开者需确认关闭空调或风扇。避免无人时长时间运行。</li>
							<li><strong>门窗管理：</strong>最后离开创作坊者，需确认关闭所有门窗，做好防盗措施。</li>
							<li>
								<strong>断电检查：</strong>
								对于非24小时运行的公共设备（如公用电脑、显示屏、饮水机、部分实验设备），
								最后离开者或设备使用者有责任确认其已关闭或处于安全待机状态（符合设备要求）。
							</li>
							<li><strong>消防安全：</strong>保持所有消防通道、灭火器及电箱前畅通无阻，严禁遮挡。</li>
						</ol>
					</div>
				</div>

				<div class="policy-section">
					<h3 class="section-title">
						<el-icon><office-building /></el-icon>
						第三章 责任分工与监督机制
					</h3>
					<div class="policy-content">
						<p><strong>第七条 使用者责任：</strong>每位使用者是自身使用区域（工位及周边）和所使用公共设备的第一卫生责任人，必须严格遵守第二章各项规范。</p>
						<p><strong>第八条 值日制度：</strong>由常驻团队按日排班，督促当日使用者遵守规范。检查并确保照明、空调关闭，门窗锁好，卫生情况整洁。</p>
						<p><strong>第九条 定期深度清洁：</strong>每周定期进行地面拖洗、桌面深度擦拭、设备除尘等。</p>
						<p><strong>第十条 管理员巡查：</strong>创作坊负责老师进行不定期巡查，检查卫生状况、设备归位以及安全情况。</p>
						<p><strong>第十一条 相互监督与提醒：</strong>鼓励使用者之间相互友好提醒，共同维护良好环境。发现严重或反复违规行为，可向管理员反映。</p>
						<p>
							<strong>第十二条 处理措施：</strong>
							对于屡教不改或造成设备损坏、安全隐患的严重违规行为：
							暂停其使用创作坊权限一定期限。并且通报其所在院系或指导老师。需承担清洁或维修责任。
						</p>
					</div>
				</div>

				<div class="policy-section">
					<h3 class="section-title">
						<el-icon><office-building /></el-icon>
						第四章 附则
					</h3>
					<div class="policy-content">
						<p>
							<strong>第十三条 温馨提醒：</strong>
							请爱惜创作坊内所有设施设备。保持环境整洁不仅关乎形象，更能提升专注力、减少干扰、
							预防事故、延长设备寿命，最终惠及每一位使用者。
						</p>
						<p><strong>第十四条 宣传与教育：</strong>本机制后续张贴于创作坊醒目位置。所有新进入者需在首次使用前阅读并知晓本规定。创作坊定期通过会议、通知等方式进行宣贯。</p>
						<p><strong>第十五条 修订：</strong>本机制将根据实际运行情况和反馈进行定期评估和修订。</p>
						<p><strong>第十六条 生效日期：</strong>本机制自发布之日起生效。</p>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<style scoped>
/* 这里应该导入外部CSS文件中的样式 */

/* 但由于我们已经在script中导入了CSS文件，这里可以保持为空或者添加一些组件特有的样式 */
</style>

