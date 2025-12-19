<template>
  <div class="home-container">
    <div class="theme-toggle-container">
      <img 
        src="@/assets/AiWorkShop_icon.png" 
        alt="AI坊" 
        class="theme-toggle-icon" 
        @click="toggleTheme" 
        title="切换主题模式"
      >
    </div>

    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-left">
          <div class="logo-section">
            <div class="logo-container">
              <div class="logo-glow"></div>
            </div>
            <h1 class="main-title">厦门工学院人工智能创作坊</h1>
            <p class="main-subtitle">学生管理系统</p>
            <p class="tagline">-- 世界很大 AI无限</p>
          </div>

			<div class="description-section">
				<h2 class="section-title">欢迎使用AI坊学生管理系统</h2>
				<p class="description">
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;厦门工学院人工智能创作坊（<strong style="color: #ff6b6b;">AI坊</strong>）是学校根据智能学科发展特点，结合社会实际需求，依托人工智能学院雄厚师资力量而成立的实践创作基地。<strong style="color: #ff6b6b;">AI坊</strong>面向人工智能学院专业学生，构建了一个集<strong style="color: #4ecdc4;">学习</strong>、<strong style="color: #45b7d1;">研发</strong>、<strong style="color: #96ceb4;">展示推广</strong>于一体的创新平台。
				</p>
				<p class="description">
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们以前沿特色项目实践为导向，着重培养学生的<strong style="color: #f39c12;">AI实践应用能力</strong>与<strong style="color: #9b59b6;">学科综合素养</strong>。同时，<strong style="color: #ff6b6b;">AI坊</strong>也诚挚邀请全校师生将此平台作为教学实践的沃土，共同实现<strong style="color: #27ae60;">教学相长</strong>与<strong style="color: #e67e22;">产学研深度融合</strong>的目标，最终提升学生的<strong style="color: #3498db;">综合实践能力</strong>与<strong style="color: #e74c3c;">创新竞争力</strong>，产出具有实用价值的创新成果。
				</p>
			</div>

          <div class="action-section">
            <el-button type="primary" size="large" @click="goToLogin" class="action-button">
              <el-icon><ArrowRight /></el-icon>
              立即体验
            </el-button>
            <el-button size="large" @click="showEnvironmentPolicy" class="environment-policy-button">
              <el-icon><OfficeBuilding /></el-icon>
              环境保障机制
            </el-button>
          </div>
        </div>

        <div class="hero-right">
          <div class="quick-access-label">快捷入口</div>
          <div class="features-showcase">
            <div class="feature-card primary" @click="goToDashboard">
              <div class="feature-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <h3>数据看板</h3>
              <p>实时展示积分排行、考勤统计、成员数据</p>
            </div>
            
            <div class="feature-card secondary" @click="goToAttendanceAnalysis">
              <div class="feature-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <h3>签到分析</h3>
              <p>可视化展示签到趋势、出勤率统计</p>
            </div>
            
            <div class="feature-card tertiary" @click="goToPointsDashboard">
              <div class="feature-icon">
                <el-icon><Star /></el-icon>
              </div>
              <h3>积分看板</h3>
              <p>展示成员积分排行和优秀成员信息</p>
            </div>
            
            <div class="feature-card quaternary" @click="goToAllMembers">
              <div class="feature-icon">
                <el-icon><User /></el-icon>
              </div>
              <h3>全部成员</h3>
              <p>查看所有成员信息和积分排名</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-content">
        <div class="author-info">
          <p>项目作者：郑恩赐</p>
          <div class="author-links">
            <span class="author-contact">📧 zheng_enci@qq.com</span>
            <a href="https://gitee.com/zheng-enci050704" target="_blank" class="author-link">🔗 Gitee</a>
            <a href="https://juejin.cn/user/2883382090934252" target="_blank" class="author-link">📝 掘金</a>
          </div>
        </div>
      </div>
    </div>



    <el-dialog
      v-model="updateLogVisible"
      title="系统更新日志"
      width="95%"
      :before-close="handleClose"
      class="update-log-dialog"
    >
      <div class="update-log-content">
        <div class="update-section">
          <h3 class="section-title">
            <el-icon><Trophy /></el-icon>
            积分看板功能
          </h3>
          <div class="update-items">
            <div class="update-item">
              <div class="update-icon primary">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="update-content">
                <h4>增加了积分看板页面</h4>
                <p>新增积分看板页面，展示学生积分排行榜和优秀成员信息，支持签到积分、活动积分和总积分三种排行榜查看，提供数据可视化图表展示</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon secondary">
                <el-icon><Star /></el-icon>
              </div>
              <div class="update-content">
                <h4>增加积分功能</h4>
                <p>实现完整的积分系统，包括签到积分计算、活动积分记录、总积分统计等功能，支持积分排行榜展示和优秀成员展示</p>
              </div>
            </div>
          </div>
        </div>

        <div class="update-summary">
          <div class="summary-card">
            <h3>
              <el-icon><Trophy /></el-icon>
              更新总结
            </h3>
            <p>本次更新新增积分看板页面和积分功能，为学生提供更全面的数据展示和激励体系。积分看板支持签到积分、活动积分和总积分三种排行榜查看，展示优秀成员信息，提供数据可视化图表展示，让教育管理更加高效、便捷、智能。</p>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-if="environmentPolicyVisible"
      v-model="environmentPolicyVisible"
      title="厦门工学院人工智能创作坊日常环境保障机制"
      width="95%"
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
            <el-icon><OfficeBuilding /></el-icon>
            第一章 总则
          </h3>
          <div class="policy-content">
            <p><strong>第一条 目的：</strong>为保障厦门工学院人工智能创作坊（以下简称"创作坊"）拥有整洁、舒适、安全、高效的工作与学习环境，维护设备安全，培养使用者良好习惯，提升空间利用效率，特制定本保障机制。</p>
            <p><strong>第二条 适用范围：</strong>本机制适用于所有进入并使用创作坊的师生。</p>
            <p><strong>第三条 核心原则：</strong>"谁使用，谁负责；人走场清，物归原位；共同维护，持续改进"。</p>
          </div>
        </div>

        <div class="policy-section">
          <h3 class="section-title">
            <el-icon><OfficeBuilding /></el-icon>
            第二章 日常行为规范
          </h3>
          <div class="policy-content">
            <p><strong>第四条 个人工位区域（桌椅）管理：</strong></p>
            <ol>
              <li><strong>人走椅归：</strong>使用者离开工位时，必须将座椅完全推入桌下，保持整齐划一，不得阻碍通道。</li>
              <li><strong>桌面整洁：</strong>
                <ul>
                  <li><strong>物品精简：</strong>桌面仅限放置与当前工作/学习直接相关的设备（如电脑、开发板）、资料、必要文具及饮用水杯。严禁堆放食物、零食等无关杂物。</li>
                  <li><strong>资料规整：</strong>文件、书籍、笔记本、科研设备等应整齐摆放或及时收纳，避免杂乱无章。</li>
                  <li><strong>桌面整洁：</strong>离开前需清理桌面灰尘、碎屑、水渍、污迹，保持桌面清洁。</li>
                </ul>
              </li>
              <li><strong>垃圾自清：</strong>个人产生的废纸、饮料瓶、零食包装等垃圾，必须自行投入指定垃圾桶内，不得遗留在桌面或地面。垃圾桶内垃圾超过3/4时，应将垃圾打包带走，换上新的垃圾袋。</li>
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
              <li><strong>断电检查：</strong>对于非24小时运行的公共设备（如公用电脑、显示屏、饮水机、部分实验设备），最后离开者或设备使用者有责任确认其已关闭或处于安全待机状态（符合设备要求）。</li>
              <li><strong>消防安全：</strong>保持所有消防通道、灭火器及电箱前畅通无阻，严禁遮挡。</li>
            </ol>
          </div>
        </div>

        <div class="policy-section">
          <h3 class="section-title">
            <el-icon><OfficeBuilding /></el-icon>
            第三章 责任分工与监督机制
          </h3>
          <div class="policy-content">
            <p><strong>第七条 使用者责任：</strong>每位使用者是自身使用区域（工位及周边）和所使用公共设备的第一卫生责任人，必须严格遵守第二章各项规范。</p>
            <p><strong>第八条 值日制度：</strong>由常驻团队按日排班，督促当日使用者遵守规范。检查并确保照明、空调关闭，门窗锁好，卫生情况整洁。</p>
            <p><strong>第九条 定期深度清洁：</strong>每周定期进行地面拖洗、桌面深度擦拭、设备除尘等。</p>
            <p><strong>第十条 管理员巡查：</strong>创作坊负责老师进行不定期巡查，检查卫生状况、设备归位以及安全情况。</p>
            <p><strong>第十一条 相互监督与提醒：</strong>鼓励使用者之间相互友好提醒，共同维护良好环境。发现严重或反复违规行为，可向管理员反映。</p>
            <p><strong>第十二条 处理措施：</strong>对于屡教不改或造成设备损坏、安全隐患的严重违规行为：暂停其使用创作坊权限一定期限。并且通报其所在院系或指导老师。需承担清洁或维修责任。</p>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import './HomePageMobile.css'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElIcon, ElDialog } from 'element-plus'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-dialog.css'
import {
  User, Calendar, TrendCharts,  ArrowRight,  Reading, Link,
  Star, Trophy
} from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'
import { onMounted } from 'vue'
import { getAvatarUrl } from '@/api/student'
import {  OfficeBuilding} from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const updateLogVisible = ref(false)
const environmentPolicyVisible = ref(false)
const developerAvatar = ref('')

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToAttendanceAnalysis = () => {
  router.push('/attendance-analysis')
}

const goToPointsDashboard = () => {
  router.push('/points-dashboard')
}

const goToAllMembers = () => {
  router.push('/all-members')
}

const loadDeveloperAvatar = () => {
  // 使用项目统一的getAvatarUrl函数获取id为1的头像
  const avatarUrl = getAvatarUrl(1)
  if (avatarUrl) {
    developerAvatar.value = avatarUrl
  } else {
    // 如果获取失败，使用默认头像
    developerAvatar.value = 'https://p3-passport.byteacctimg.com/img/user-avatar/835c1120c7584cc5fc44606adacd40b0~200x200.awebp'
  }
}

const handleAvatarError = () => {
  // 图片加载失败时使用默认头像
  developerAvatar.value = 'https://p3-passport.byteacctimg.com/img/user-avatar/835c1120c7584cc5fc44606adacd40b0~200x200.awebp'
}

onMounted(() => {
  loadDeveloperAvatar()
})

const showUpdateLog = () => {
  updateLogVisible.value = true
}

const showEnvironmentPolicy = () => {
  environmentPolicyVisible.value = true
}

const closeEnvironmentPolicy = () => {
  environmentPolicyVisible.value = false
}



const handleClose = () => {
  updateLogVisible.value = false
}
</script>

