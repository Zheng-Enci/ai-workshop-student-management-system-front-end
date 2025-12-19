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
            <p class="tagline">世界很大 AI无限</p>
          </div>

			<div class="description-section">
				<h2 class="section-title">欢迎使用AI坊学生管理系统</h2>
				<p class="description">
					&nbsp;&nbsp;&nbsp;&nbsp;厦门工学院人工智能创作坊（<strong style="color: #ff6b6b;">AI坊</strong>）是学校根据智能学科发展特点，结合社会实际需求，依托人工智能学院雄厚师资力量而成立的实践创作基地。<strong style="color: #ff6b6b;">AI坊</strong>面向人工智能学院专业学生，构建了一个集<strong style="color: #4ecdc4;">学习</strong>、<strong style="color: #45b7d1;">研发</strong>、<strong style="color: #96ceb4;">展示推广</strong>于一体的创新平台。
				</p>
				<p class="description">
					&nbsp;&nbsp;&nbsp;&nbsp;我们以前沿特色项目实践为导向，着重培养学生的<strong style="color: #f39c12;">AI实践应用能力</strong>与<strong style="color: #9b59b6;">学科综合素养</strong>。同时，<strong style="color: #ff6b6b;">AI坊</strong>也诚挚邀请全校师生将此平台作为教学实践的沃土，共同实现<strong style="color: #27ae60;">教学相长</strong>与<strong style="color: #e67e22;">产学研深度融合</strong>的目标，最终提升学生的<strong style="color: #3498db;">综合实践能力</strong>与<strong style="color: #e74c3c;">创新竞争力</strong>，产出具有实用价值的创新成果。
				</p>
			</div>

          <div class="action-section">
            <el-button type="primary" size="large" @click="goToLogin" class="action-button">
              <el-icon><ArrowRight /></el-icon>
              立即体验
            </el-button>
            <el-button size="large" @click="goToRegister" class="secondary-button">
              注册账号
            </el-button>
            <el-button size="large" @click="showUpdateLog" class="update-log-button">
              <el-icon><Document /></el-icon>
              更新日志
            </el-button>
            <el-button size="large" @click="showContactForm" class="contact-form-button">
              <el-icon><User /></el-icon>
              联系我们
            </el-button>
            <el-button size="large" @click="showEnvironmentPolicy" class="environment-policy-button">
              <el-icon><OfficeBuilding /></el-icon>
              环境保障机制
            </el-button>
          </div>
        </div>

        <div class="hero-right">
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

    <div class="info-section">
      <div class="info-content">

        <div class="contact-info">
          <h3>联系我们</h3>
          <p>如有问题或建议，请联系开发团队</p>
          <div class="qr-codes">
            <div class="qr-item">
              <img src="@/assets/ShouJiDuanQianDanRuKou.png" alt="手机端签到入口" class="qr-image">
              <p>手机端签到入口</p>
            </div>
            <div class="qr-item">
              <img src="@/assets/ErWeiMa.png" alt="公众号" class="qr-image">
              <p>扫码关注</p>
            </div>
          </div>
        </div>
        
        <div class="documentation-section">
          <h3>本项目作者</h3>
          <p>查看作者的技术文章和经验分享</p>
          <div class="documentation-layout">
            <div class="developer-profile-large">
              <div class="profile-avatar-large">
                <img :src="developerAvatar" alt="开发者头像" class="avatar-image-large" @error="handleAvatarError">
              </div>
              <div class="profile-info-large">
                <h4>郑恩赐</h4>
                <p>AI全栈应用开发工程师</p>
                <p>联系邮箱: <a href="mailto:zheng_enci@qq.com" class="author-email">zheng_enci@qq.com</a></p>
              </div>
            </div>
            <div class="doc-links-right">
              <div class="doc-item-right">
                <div class="doc-icon">
                  <el-icon><Reading /></el-icon>
                </div>
                <div class="doc-content">
                  <h4>掘金技术专栏</h4>
                  <p>技术文章和专栏分享</p>
                  <a href="https://juejin.cn/user/2883382090934252" target="_blank" class="doc-link">
                    <el-icon><Link /></el-icon>
                    访问专栏
                  </a>
                </div>
              </div>
              <div class="doc-item-right">
                <div class="doc-icon">
                  <el-icon><DocumentCopy /></el-icon>
                </div>
                <div class="doc-content">
                  <h4>Gitee 仓库</h4>
                  <p>项目代码和开源作品</p>
                  <a href="https://gitee.com/zheng-enci050704" target="_blank" class="doc-link">
                    <el-icon><Link /></el-icon>
                    访问仓库
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-content">
        <p>&copy; 2024 厦门工学院人工智能创作坊学生管理系统. All rights reserved.</p>
        <p>群策群力，创新共行</p>
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
      v-model="contactFormVisible"
      title="联系我们"
      width="500px"
      :close-on-click-modal="true"
      :destroy-on-close="true"
      :append-to-body="true"
      :teleported="true"
      class="contact-dialog"
    >
      <div class="contact-form">
        <div class="contact-info-item">
          <h4>开发团队</h4>
          <p>厦门工学院人工智能创作坊</p>
        </div>
        <div class="contact-info-item">
          <h4>联系人</h4>
          <p>郑恩赐</p>
        </div>
        <div class="contact-info-item">
          <h4>邮箱</h4>
          <p><a href="mailto:zheng_enci@qq.com">zheng_enci@qq.com</a></p>
        </div>
        <div class="contact-info-item">
          <h4>GitHub</h4>
          <p><a href="https://gitee.com/zheng-enci050704" target="_blank">访问我的Gitee仓库</a></p>
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
  User, Calendar, TrendCharts, Setting, ArrowRight, Document, Reading, Link,
  Star, Trophy
} from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'
import { onMounted } from 'vue'
import { getAvatarUrl } from '@/api/student'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const updateLogVisible = ref(false)
const contactFormVisible = ref(false)
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

const showContactForm = () => {
  contactFormVisible.value = true
}

const handleClose = () => {
  updateLogVisible.value = false
}
</script>

