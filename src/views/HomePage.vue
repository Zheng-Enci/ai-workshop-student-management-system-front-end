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
            <h1 class="main-title">人工智能创作坊</h1>
            <p class="main-subtitle">学生管理系统</p>
            <p class="tagline">世界很大 AI无限</p>
          </div>
          
          <div class="description-section">
            <h2 class="section-title">欢迎使用AI坊学生管理系统</h2>
            <p class="description">
              基于Vue3和Spring Boot构建的现代化学生管理系统，
              提供智能化的学生信息管理、考勤统计、数据分析等功能。
              让教育管理更加高效、便捷、智能。
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
          </div>
        </div>

        <div class="hero-right">
          <div class="features-showcase">
            <div class="feature-card primary">
              <div class="feature-icon">
                <el-icon><User /></el-icon>
              </div>
              <h3>学生管理</h3>
              <p>完善的学生信息管理，支持注册、登录、信息更新</p>
            </div>
            
            <div class="feature-card secondary">
              <div class="feature-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <h3>智能考勤</h3>
              <p>分时段签到系统，实时统计考勤数据</p>
            </div>
            
            <div class="feature-card tertiary">
              <div class="feature-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <h3>数据分析</h3>
              <p>多维度数据统计，可视化图表展示</p>
            </div>
            
            <div class="feature-card quaternary">
              <div class="feature-icon">
                <el-icon><Setting /></el-icon>
              </div>
              <h3>权限管理</h3>
              <p>多级权限控制，安全可靠的管理体系</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <div class="info-content">
        <div class="tech-stack">
          <h3>技术栈</h3>
          <div class="tech-tags">
            <span class="tech-tag">Vue 3</span>
            <span class="tech-tag">Element Plus</span>
            <span class="tech-tag">Spring Boot</span>
            <span class="tech-tag">MySQL</span>
            <span class="tech-tag">Redis</span>
            <span class="tech-tag">JWT</span>
          </div>
        </div>
        
        <div class="contact-info">
          <h3>联系我们</h3>
          <p>如有问题或建议，请联系开发团队</p>
          <div class="qr-codes">
            <div class="qr-item">
              <img src="@/assets/WangZhanRuKouErWeiMa.png" alt="网站入口" class="qr-image">
              <p>网站入口</p>
            </div>
            <div class="qr-item">
              <img src="@/assets/ErWeiMa.png" alt="公众号" class="qr-image">
              <p>扫码关注</p>
            </div>
          </div>
        </div>
        
        <div class="documentation-section">
          <h3>技术文档</h3>
          <p>查看开发者的技术文章和经验分享</p>
          <div class="documentation-layout">
            <div class="developer-profile-large">
              <div class="profile-avatar-large">
                <img src="https://p3-passport.byteacctimg.com/img/user-avatar/835c1120c7584cc5fc44606adacd40b0~200x200.awebp" alt="开发者头像" class="avatar-image-large">
              </div>
              <div class="profile-info-large">
                <h4>郑恩赐</h4>
                <p>计算机视觉与深度学习工程师 | AI算法工程师 | 全栈开发工程师</p>
              </div>
            </div>
            <div class="doc-links-right">
              <div class="doc-item-right">
                <div class="doc-icon">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="doc-content">
                  <h4>CSDN技术博客</h4>
                  <p>分享技术文章和开发经验</p>
                  <a href="https://blog.csdn.net/2301_79239314" target="_blank" class="doc-link">
                    <el-icon><Link /></el-icon>
                    访问博客
                  </a>
                </div>
              </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-content">
        <p>&copy; 2024 人工智能创作坊学生管理系统. All rights reserved.</p>
        <p>群策群力，创新共行</p>
      </div>
    </div>

    <el-dialog
      v-model="updateLogVisible"
      title="系统更新日志"
      width="80%"
      :before-close="handleClose"
      class="update-log-dialog"
    >
      <div class="update-log-content">
        <div class="update-section">
          <h3 class="section-title">
            <el-icon><Star /></el-icon>
            核心架构升级
          </h3>
          <div class="update-items">
            <div class="update-item">
              <div class="update-icon primary">
                <el-icon><FolderOpened /></el-icon>
              </div>
              <div class="update-content">
                <h4>系统架构优化</h4>
                <p>重新优化了系统内部结构，让各个功能模块更加清晰，提升了系统的稳定性和运行效率</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon secondary">
                <el-icon><Monitor /></el-icon>
              </div>
              <div class="update-content">
                <h4>多端适配系统</h4>
                <p>完美支持手机、平板、电脑等各种设备，无论您使用什么设备都能获得最佳的使用体验</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon tertiary">
                <el-icon><Setting /></el-icon>
              </div>
              <div class="update-content">
                <h4>状态管理升级</h4>
                <p>优化了系统内部的数据管理机制，让系统运行更加流畅，响应速度更快</p>
              </div>
            </div>
          </div>
        </div>

        <div class="update-section">
          <h3 class="section-title">
            <el-icon><MagicStick /></el-icon>
            用户体验升级
          </h3>
          <div class="update-items">
            <div class="update-item">
              <div class="update-icon quaternary">
                <el-icon><Moon /></el-icon>
              </div>
              <div class="update-content">
                <h4>智能主题系统</h4>
                <p>新增智能主题切换功能，系统会根据时间自动切换白天和夜间模式，保护您的眼睛，同时记住您的个人偏好</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon primary">
                <el-icon><View /></el-icon>
              </div>
              <div class="update-content">
                <h4>全新首页</h4>
                <p>新增了独立的首页，采用现代化的玻璃质感设计，让您一眼就能了解系统的主要功能和特色</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon secondary">
                <el-icon><Cpu /></el-icon>
              </div>
              <div class="update-content">
                <h4>主题样式系统</h4>
                <p>新增了完整的主题样式系统，支持白天夜间模式无缝切换，所有页面都有一致的视觉效果</p>
              </div>
            </div>
          </div>
        </div>

        <div class="update-section">
          <h3 class="section-title">
            <el-icon><Lock /></el-icon>
            路由系统改进
          </h3>
          <div class="update-items">
            <div class="update-item">
              <div class="update-icon tertiary">
                <el-icon><Key /></el-icon>
              </div>
              <div class="update-content">
                <h4>管理员路由重构</h4>
                <p>重新设计了管理员功能页面，增加了更严格的安全验证流程，确保系统数据的安全性和隐私保护</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon quaternary">
                <el-icon><Monitor /></el-icon>
              </div>
              <div class="update-content">
                <h4>多端路由支持</h4>
                <p>优化了页面跳转逻辑，增强了用户身份验证，让您在系统内的导航更加安全和便捷</p>
              </div>
            </div>
          </div>
        </div>

        <div class="update-section">
          <h3 class="section-title">
            <el-icon><TrendCharts /></el-icon>
            数据看板升级
          </h3>
          <div class="update-items">
            <div class="update-item">
              <div class="update-icon primary">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="update-content">
                <h4>多时间段排行榜</h4>
                <p>新增9种时间段选择：今日、本周、本月、本季度、本学期、本年度、最近7天、最近30天、自定义时间范围，让您灵活查看不同时期的签到排行</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon secondary">
                <el-icon><Setting /></el-icon>
              </div>
              <div class="update-content">
                <h4>个性化排行设置</h4>
                <p>支持自定义显示前N名（1-100名可调），系统会记住您的选择偏好，下次访问时自动恢复设置，让数据查看更加个性化</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon tertiary">
                <el-icon><DataAnalysis /></el-icon>
              </div>
              <div class="update-content">
                <h4>智能统计指标</h4>
                <p>优化统计指标，将"本月签到总人数"改为"本月工作日日均签到人数"，排除节假日和周末，更准确地反映签到活跃度</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon quaternary">
                <el-icon><Monitor /></el-icon>
              </div>
              <div class="update-content">
                <h4>多端适配优化</h4>
                <p>排行榜页面支持桌面版、平板版、移动版三种设备适配，确保每个设备都有最佳的使用体验和视觉效果</p>
              </div>
            </div>
          </div>
        </div>

        <div class="update-section">
          <h3 class="section-title">
            <el-icon><PieChart /></el-icon>
            热力图与趋势图升级
          </h3>
          <div class="update-items">
            <div class="update-item">
              <div class="update-icon primary">
                <el-icon><PieChart /></el-icon>
              </div>
              <div class="update-content">
                <h4>考勤热力图升级</h4>
                <p>全新的考勤分析页面，新增热力图功能，通过颜色深浅直观显示不同时段的签到活跃度，让您一眼就能看出签到高峰时段和规律</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon secondary">
                <el-icon><Clock /></el-icon>
              </div>
              <div class="update-content">
                <h4>智能时间线图表</h4>
                <p>新增时间线图表功能，支持今日、本周、本月、昨月、本年度、全部和自定义时间范围选择，结合散点图和趋势线双重展示，让您灵活分析不同时期的签到规律</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon tertiary">
                <el-icon><Histogram /></el-icon>
              </div>
              <div class="update-content">
                <h4>考勤热力图功能</h4>
                <p>新增考勤热力图展示，通过颜色深浅直观显示不同时段的签到活跃度，让您一眼就能看出签到高峰时段和规律</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon tertiary">
                <el-icon><Moon /></el-icon>
              </div>
              <div class="update-content">
                <h4>图表主题适配</h4>
                <p>所有图表完美支持暗色/亮色主题切换，图表颜色、文字、背景都会根据当前主题自动适配，确保在任何模式下都有最佳的视觉效果</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon quaternary">
                <el-icon><Grid /></el-icon>
              </div>
              <div class="update-content">
                <h4>自适应图表显示</h4>
                <p>图表会根据屏幕大小自动调整，无论是手机、平板还是电脑，都能获得最佳的查看体验</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon primary">
                <el-icon><DataBoard /></el-icon>
              </div>
              <div class="update-content">
                <h4>AI坊文明公约</h4>
                <p>新增AI坊文明公约展示模块，详细说明环境保障机制和使用规范，让所有用户了解并遵守坊内管理规则</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon secondary">
                <el-icon><Picture /></el-icon>
              </div>
              <div class="update-content">
                <h4>二维码切换功能</h4>
                <p>新增网站入口和公众号二维码切换功能，用户可以方便地在两种二维码之间切换，提升用户体验</p>
              </div>
            </div>
          </div>
        </div>

        <div class="update-section">
          <h3 class="section-title">
            <el-icon><Document /></el-icon>
            新增页面
          </h3>
          <div class="update-items">
            <div class="update-item">
              <div class="update-icon primary">
                <el-icon><View /></el-icon>
              </div>
              <div class="update-content">
                <h4>独立首页</h4>
                <p>新增了独立的首页，作为系统的入口页面，展示系统介绍和功能特色，让新用户更好地了解系统</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon secondary">
                <el-icon><Monitor /></el-icon>
              </div>
              <div class="update-content">
                <h4>多端适配页面</h4>
                <p>为签到页面和个人资料页面新增了专门的移动端、平板端、电脑端页面，确保每个设备都有最佳的使用体验</p>
              </div>
            </div>
            <div class="update-item">
              <div class="update-icon tertiary">
                <el-icon><Lock /></el-icon>
              </div>
              <div class="update-content">
                <h4>管理员认证页面</h4>
                <p>新增了管理员认证页面和控制台页面，分离了认证和管理功能，让管理员操作更加安全便捷</p>
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
            <p>本次更新带来了全新的使用体验，让系统更加智能、美观、易用。我们专注于提升您的使用感受，让每一次操作都更加流畅和愉悦。</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, Calendar, TrendCharts, Setting, ArrowRight, Document, Reading, Link,
  Star, FolderOpened, Monitor, MagicStick, Moon, View, Cpu, Lock, Key,
  Trophy, DataAnalysis, PieChart, Clock, Grid, DataBoard, Picture, Histogram
} from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const updateLogVisible = ref(false)

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const showUpdateLog = () => {
  updateLogVisible.value = true
}

const handleClose = () => {
  updateLogVisible.value = false
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: var(--text-primary);
  position: relative;
  overflow-x: hidden;
}

.theme-toggle-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
}

.theme-toggle-icon {
  width: 48px;
  height: 48px;
  cursor: pointer;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 2px solid var(--glass-border);
  padding: 8px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px var(--shadow-color);
}

.theme-toggle-icon:hover {
  transform: scale(1.1) rotate(180deg);
  box-shadow: 0 12px 40px var(--shadow-hover);
  border-color: var(--primary-color);
}

.theme-toggle-icon:active {
  transform: scale(0.95);
}

.hero-section {
  padding: 40px 20px 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.hero-content {
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: center;
}

.hero-left {
  text-align: center;
}

.hero-right {
  display: none;
}

.logo-section {
  margin-bottom: 40px;
}

.logo-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.main-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.main-subtitle {
  font-size: 18px;
  margin: 0 0 15px 0;
  color: var(--text-secondary);
  font-weight: 500;
}

.tagline {
  font-size: 16px;
  margin: 0;
  color: var(--text-tertiary);
  font-style: italic;
}

.description-section {
  margin-bottom: 50px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.description {
  font-size: 16px;
  line-height: 1.7;
  margin: 0;
  color: var(--text-secondary);
}

.action-section {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 50px;
}

.action-button {
  background: var(--primary-gradient);
  border: none;
  padding: 16px 36px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 32px;
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.action-button:hover::before {
  left: 100%;
}

.action-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(102, 126, 234, 0.4);
}

.secondary-button {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 2px solid var(--glass-border);
  color: var(--text-secondary);
  padding: 16px 36px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.secondary-button:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px var(--shadow-hover);
}

.update-log-button {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  border: none;
  color: white;
  padding: 16px 36px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.update-log-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.update-log-button:hover::before {
  left: 100%;
}

.update-log-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(67, 233, 123, 0.4);
}

.features-showcase {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.feature-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px 28px;
  border: 1px solid var(--glass-border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 48px var(--shadow-hover);
  background: var(--glass-bg);
}

.feature-card.primary .feature-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.feature-card.secondary .feature-icon {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.feature-card.tertiary .feature-icon {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.feature-card.quaternary .feature-icon {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 24px;
  color: white;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--text-primary);
  text-align: center;
}

.feature-card p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  color: var(--text-secondary);
  text-align: center;
}

.info-section {
  background: var(--bg-secondary);
  padding: 50px 20px;
}

.info-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: start;
}

.tech-stack h3,
.contact-info h3,
.documentation-section h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-tag {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.contact-info p {
  font-size: 14px;
  color: var(--text-tertiary);
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.qr-codes {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.qr-item {
  text-align: center;
}

.qr-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
}

.qr-item p {
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0;
}

.documentation-section {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px 28px;
  border: 1px solid var(--glass-border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.documentation-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px var(--shadow-hover);
}

.documentation-section p {
  font-size: 14px;
  color: var(--text-tertiary);
  margin: 0 0 25px 0;
  line-height: 1.6;
}

.documentation-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.developer-profile-large {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px;
  background: var(--bg-primary);
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.developer-profile-large:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px var(--shadow-hover);
}

.profile-avatar-large {
  margin-bottom: 20px;
}

.avatar-image-large {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid var(--primary-color);
  box-shadow: 0 8px 24px var(--shadow-color);
  transition: all 0.3s ease;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  object-fit: cover;
}

.avatar-image-large:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px var(--shadow-hover);
}

.profile-info-large h4 {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-info-large p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

.doc-links-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.doc-item-right {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: var(--bg-primary);
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.doc-item-right:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
  transform: translateX(8px);
}

.doc-icon {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: white;
  flex-shrink: 0;
}

.doc-content {
  flex: 1;
}

.doc-content h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: var(--text-primary);
}

.doc-content p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 14px 0;
  line-height: 1.5;
}

.doc-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.doc-link:hover {
  color: var(--primary-color);
  transform: translateX(4px);
}

.doc-link .el-icon {
  font-size: 16px;
}

.footer {
  background: #2c3e50;
  color: white;
  padding: 30px 20px;
  text-align: center;
}

.footer-content p {
  margin: 5px 0;
  opacity: 0.8;
}

.footer-content p:first-child {
  font-size: 12px;
}

.footer-content p:last-child {
  font-size: 14px;
  font-weight: 600;
}

@media (min-width: 768px) {
  .hero-section {
    padding: 60px 40px 80px;
  }
  
  .hero-content {
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }
  
  .hero-left {
    text-align: left;
  }
  
  .hero-right {
    display: block;
  }
  
  .theme-toggle-icon {
    width: 56px;
    height: 56px;
    top: 32px;
    right: 32px;
  }
  
  .logo-glow {
    width: 140px;
    height: 140px;
  }
  
  .main-title {
    font-size: 42px;
  }
  
  .main-subtitle {
    font-size: 22px;
  }
  
  .tagline {
    font-size: 18px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .description {
    font-size: 18px;
  }
  
  .action-section {
    justify-content: flex-start;
    gap: 20px;
  }
  
  .action-button,
  .secondary-button {
    padding: 16px 36px;
    font-size: 18px;
  }
  
  .features-showcase {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
  
  .feature-card {
    padding: 35px 30px;
  }
  
  .feature-icon {
    width: 70px;
    height: 70px;
    font-size: 28px;
  }
  
  .feature-card h3 {
    font-size: 22px;
  }
  
  .feature-card p {
    font-size: 15px;
  }
  
  .info-content {
    grid-template-columns: 1fr 1fr;
    gap: 60px;
  }
  
  .documentation-section {
    grid-column: 1 / -1;
    margin-top: 20px;
  }
  
  .tech-stack h3,
  .contact-info h3,
  .documentation-section h3 {
    font-size: 24px;
  }
  
  .tech-tag {
    font-size: 14px;
    padding: 10px 18px;
  }
  
  .contact-info p,
  .documentation-section p {
    font-size: 16px;
  }
  
  .doc-links {
    flex-direction: row;
    gap: 25px;
  }
  
  .doc-item {
    flex-direction: column;
    text-align: center;
    padding: 25px 20px;
  }
  
  .doc-item:hover {
    transform: translateY(-4px);
  }
  
  .doc-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
    margin: 0 auto 16px;
  }
  
  .doc-content h4 {
    font-size: 18px;
  }
  
  .doc-content p {
    font-size: 14px;
  }
  
  .documentation-layout {
    gap: 25px;
  }
  
  .developer-profile-large {
    padding: 25px;
  }
  
  .avatar-image-large {
    width: 130px;
    height: 130px;
  }
  
  .profile-info-large h4 {
    font-size: 20px;
  }
  
  .profile-info-large p {
    font-size: 15px;
  }
  
  .doc-item-right {
    padding: 20px;
  }
  
  .doc-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  .doc-content h4 {
    font-size: 16px;
  }
  
  .doc-content p {
    font-size: 13px;
  }
  
  .qr-image {
    width: 120px;
    height: 120px;
  }
  
  .qr-item p {
    font-size: 14px;
  }
  
  .footer {
    padding: 40px 20px;
  }
  
  .footer-content p:first-child {
    font-size: 14px;
  }
  
  .footer-content p:last-child {
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .hero-content {
    gap: 80px;
  }
  
  .main-title {
    font-size: 48px;
  }
  
  .main-subtitle {
    font-size: 24px;
  }
  
  .section-title {
    font-size: 36px;
  }
  
  .description {
    font-size: 20px;
  }
  
  .features-showcase {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
  
  .feature-card {
    padding: 40px 35px;
  }
  
  .action-section {
    gap: 25px;
  }
  
  .qr-codes {
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 30px 15px 50px;
  }
  
  .theme-toggle-icon {
    width: 40px;
    height: 40px;
    top: 16px;
    right: 16px;
  }
  
  .logo-glow {
    width: 100px;
    height: 100px;
  }
  
  .main-title {
    font-size: 24px;
  }
  
  .main-subtitle {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .description {
    font-size: 14px;
  }
  
  .action-section {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button,
  .secondary-button,
  .update-log-button {
    width: 100%;
    max-width: 280px;
  }
}

.update-log-dialog {
  border-radius: 24px;
  overflow: hidden;
}

.update-log-dialog :deep(.el-dialog) {
  border-radius: 24px;
  background: var(--bg-primary);
  border: 1px solid var(--glass-border);
}

.update-log-dialog :deep(.el-dialog__header) {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  padding: 24px 32px;
}

.update-log-dialog :deep(.el-dialog__title) {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.update-log-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: var(--bg-primary);
}

.update-log-content {
  padding: 32px;
  max-height: 70vh;
  overflow-y: auto;
}

.update-section {
  margin-bottom: 40px;
}

.update-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 24px 0;
  color: var(--text-primary);
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary-color);
}

.section-title .el-icon {
  font-size: 24px;
  color: var(--primary-color);
}

.update-items {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.update-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.update-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px var(--shadow-hover);
  border-color: var(--primary-color);
}

.update-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.update-icon.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.update-icon.secondary {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.update-icon.tertiary {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.update-icon.quaternary {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.update-content {
  flex: 1;
}

.update-content h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.update-content p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  color: var(--text-secondary);
}

.update-summary {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 2px solid var(--glass-border);
}

.summary-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid var(--glass-border);
  text-align: center;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px var(--shadow-hover);
  border-color: var(--primary-color);
}

.summary-card h3 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.summary-card h3 .el-icon {
  font-size: 24px;
  color: var(--primary-color);
}

.summary-card p {
  font-size: 16px;
  line-height: 1.7;
  margin: 0;
  color: var(--text-secondary);
}

@media (min-width: 768px) {
  .update-items {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .update-log-content {
    padding: 40px;
  }
  
  .section-title {
    font-size: 22px;
  }
  
  .update-content h4 {
    font-size: 20px;
  }
  
  .update-content p {
    font-size: 15px;
  }
  
  .summary-card h3 {
    font-size: 24px;
  }
  
  .summary-card p {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .update-log-dialog :deep(.el-dialog) {
    width: 95% !important;
    margin: 0 auto;
  }
  
  .update-log-content {
    padding: 20px;
  }
  
  .update-item {
    padding: 16px;
  }
  
  .update-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .update-content h4 {
    font-size: 16px;
  }
  
  .update-content p {
    font-size: 13px;
  }
  
  .summary-card {
    padding: 24px;
  }
  
  .summary-card h3 {
    font-size: 20px;
  }
  
  .summary-card p {
    font-size: 14px;
  }
}
</style>
