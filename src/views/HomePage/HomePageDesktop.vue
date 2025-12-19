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
          <h3>技术文档</h3>
          <p>查看开发者的技术文章和经验分享</p>
          <div class="documentation-layout">
            <div class="developer-profile-large">
              <div class="profile-avatar-large">
                <img :src="developerAvatar" alt="开发者头像" class="avatar-image-large" @error="handleAvatarError">
              </div>
              <div class="profile-info-large">
                <h4>郑恩赐</h4>
                <p>计算机视觉与深度学习工程师 | AI算法工程师 | 全栈开发工程师</p>
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
            <el-icon><OfficeBuilding /></el-icon>
            第一章 总则
          </h3>
          <div class="policy-content">
            <p><strong>第一条 目的：</strong>为保障厦门工学院人工智能创作坊（以下简称“创作坊”）拥有整洁、舒适、安全、高效的工作与学习环境，维护设备安全，培养使用者良好习惯，提升空间利用效率，特制定本保障机制。</p>
            <p><strong>第二条 适用范围：</strong>本机制适用于所有进入并使用创作坊的师生。</p>
            <p><strong>第三条 核心原则：</strong>“谁使用，谁负责；人走场清，物归原位；共同维护，持续改进”。</p>
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

        <div class="policy-section">
          <h3 class="section-title">
            <el-icon><OfficeBuilding /></el-icon>
            第四章 附则
          </h3>
          <div class="policy-content">
            <p><strong>第十三条 温馨提醒：</strong>请爱惜创作坊内所有设施设备。保持环境整洁不仅关乎形象，更能提升专注力、减少干扰、预防事故、延长设备寿命，最终惠及每一位使用者。</p>
            <p><strong>第十四条 宣传与教育：</strong>本机制后续张贴于创作坊醒目位置。所有新进入者需在首次使用前阅读并知晓本规定。创作坊定期通过会议、通知等方式进行宣贯。</p>
            <p><strong>第十五条 修订：</strong>本机制将根据实际运行情况和反馈进行定期评估和修订。</p>
            <p><strong>第十六条 生效日期：</strong>本机制自发布之日起生效。</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElIcon, ElDialog } from 'element-plus'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-dialog.css'
import { 
  User, Calendar, TrendCharts, Setting, ArrowRight, Document, Reading, Link,
  Star, Trophy, OfficeBuilding
} from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'
import { onMounted } from 'vue'
import { getAvatarUrl } from '@/api/student'

const router = useRouter()
const themeStore = useThemeStore()
const { toggleTheme } = themeStore

const environmentPolicyVisible = ref(false)
const isClosingEnvironmentPolicy = ref(false)
const developerAvatar = ref('')

const goToLogin = () => {
  router.push('/login')
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

const showEnvironmentPolicy = () => {
  environmentPolicyVisible.value = true
}

const closeEnvironmentPolicy = () => {
  // 防止重复关闭
  if (isClosingEnvironmentPolicy.value) return
  isClosingEnvironmentPolicy.value = true
  
  // 先手动隐藏遮罩层，避免视觉闪烁
  const dialogWrapper = document.querySelector('.environment-policy-overlay')
  if (dialogWrapper) {
    dialogWrapper.style.display = 'none'
    dialogWrapper.style.visibility = 'hidden'
    dialogWrapper.style.opacity = '0'
  }
  
  // 关闭弹窗
  environmentPolicyVisible.value = false
  
  // 重置关闭状态
  setTimeout(() => {
    isClosingEnvironmentPolicy.value = false
  }, 0)
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
  border-radius: 0;
  background: transparent;
  backdrop-filter: blur(20px);
  border: none;
  padding: 8px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: none;
}

.theme-toggle-icon:hover {
  transform: scale(1.15);
}

.theme-toggle-icon:active {
  transform: scale(1.1);
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
  border-radius: 8px;
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

.contact-info h3,
.documentation-section h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: var(--text-primary);
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
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  padding: 40px 36px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.documentation-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.documentation-section:hover::before {
  opacity: 1;
}

.documentation-section:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 48px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.documentation-section h3 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.documentation-section p {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0 0 32px 0;
  line-height: 1.7;
  font-weight: 500;
}

.documentation-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.developer-profile-large {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 36px 32px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  border-radius: 24px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.developer-profile-large::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.developer-profile-large:hover::after {
  opacity: 1;
}

.developer-profile-large:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 40px rgba(102, 126, 234, 0.2);
}

.profile-avatar-large {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.avatar-image-large {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 5px solid transparent;
  background: linear-gradient(135deg, #667eea, #764ba2) padding-box,
              linear-gradient(135deg, #667eea, #764ba2) border-box;
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.25),
              0 0 0 8px rgba(102, 126, 234, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  object-fit: cover;
  position: relative;
  z-index: 1;
}

.avatar-image-large:hover {
  transform: scale(1.08) rotate(2deg);
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.35),
              0 0 0 12px rgba(102, 126, 234, 0.15);
}

.profile-info-large {
  position: relative;
  z-index: 1;
}

.profile-info-large h4 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.3px;
}

.profile-info-large p {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.8;
  font-weight: 500;
}

.doc-links-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.doc-item-right {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 28px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.doc-item-right::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #667eea, #764ba2);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.doc-item-right:hover::before {
  transform: scaleY(1);
}

.doc-item-right:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateX(12px) translateY(-2px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
}

.doc-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.doc-item-right:hover .doc-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.doc-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.doc-content h4 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}

.doc-content p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.6;
  font-weight: 500;
}

.doc-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.08);
  position: relative;
  overflow: hidden;
}

.doc-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.doc-link:hover::before {
  left: 100%;
}

.doc-link:hover {
  color: white;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.doc-link .el-icon {
  transition: transform 0.3s ease;
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
  
  .contact-info h3,
  .documentation-section h3 {
    font-size: 24px;
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

html.dark .documentation-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-color: rgba(102, 126, 234, 0.3);
}

html.dark .documentation-section h3 {
  background: linear-gradient(135deg, #8b9eff, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

html.dark .documentation-section p {
  color: var(--text-secondary);
}

html.dark .developer-profile-large {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%);
  border-color: rgba(102, 126, 234, 0.25);
}

html.dark .developer-profile-large:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-color: rgba(102, 126, 234, 0.4);
}

html.dark .avatar-image-large {
  border: 5px solid transparent;
  background: linear-gradient(135deg, #8b9eff, #a78bfa) padding-box,
              linear-gradient(135deg, #8b9eff, #a78bfa) border-box;
  box-shadow: 0 12px 32px rgba(139, 158, 255, 0.3),
              0 0 0 8px rgba(139, 158, 255, 0.15);
}

html.dark .avatar-image-large:hover {
  box-shadow: 0 16px 48px rgba(139, 158, 255, 0.4),
              0 0 0 12px rgba(139, 158, 255, 0.2);
}

html.dark .profile-info-large h4 {
  background: linear-gradient(135deg, #8b9eff, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

html.dark .profile-info-large p {
  color: var(--text-secondary);
}

html.dark .doc-item-right {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%);
  border-color: rgba(102, 126, 234, 0.25);
}

html.dark .doc-item-right:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-color: rgba(102, 126, 234, 0.4);
}

html.dark .doc-item-right::before {
  background: linear-gradient(180deg, #8b9eff, #a78bfa);
}

html.dark .doc-icon {
  background: linear-gradient(135deg, #8b9eff 0%, #a78bfa 100%);
  box-shadow: 0 6px 20px rgba(139, 158, 255, 0.35);
}

html.dark .doc-item-right:hover .doc-icon {
  box-shadow: 0 8px 24px rgba(139, 158, 255, 0.45);
}

html.dark .doc-content h4 {
  color: var(--text-primary);
}

html.dark .doc-content p {
  color: var(--text-secondary);
}

html.dark .doc-link {
  color: #8b9eff;
  background: rgba(139, 158, 255, 0.12);
}

html.dark .doc-link:hover {
  color: white;
  background: linear-gradient(135deg, #8b9eff, #a78bfa);
  box-shadow: 0 4px 12px rgba(139, 158, 255, 0.35);
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

.environment-policy-dialog {
  border-radius: 24px;
  overflow: hidden;
}

/* 禁用环境保障机制弹窗过渡动画，避免闪烁 */
.environment-policy-dialog :deep(.el-dialog__wrapper) {
  transition: none !important;
  animation: none !important;
}

.environment-policy-dialog :deep(.el-dialog) {
  transition: none !important;
  animation: none !important;
  transform: none !important;
  border-radius: 24px;
  background: var(--bg-primary);
  border: 1px solid var(--glass-border);
}

.environment-policy-dialog :deep(.el-dialog__header) {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  padding: 24px 32px;
}

.environment-policy-dialog :deep(.el-dialog__title) {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.environment-policy-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: var(--bg-primary);
}

.environment-policy-content {
  padding: 32px;
  max-height: 70vh;
  overflow-y: auto;
}

.policy-section {
  margin-bottom: 40px;
}

.policy-section:last-child {
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

.policy-content {
  padding-left: 24px;
}

.policy-content p {
  font-size: 16px;
  line-height: 1.8;
  margin: 0 0 16px 0;
  color: var(--text-secondary);
}

.policy-content ol {
  font-size: 16px;
  line-height: 1.8;
  margin: 0 0 16px 0;
  color: var(--text-secondary);
  padding-left: 24px;
}

.policy-content ul {
  font-size: 16px;
  line-height: 1.8;
  margin: 8px 0 16px 0;
  color: var(--text-secondary);
  padding-left: 24px;
}

.policy-content li {
  margin-bottom: 8px;
}

.policy-content strong {
  color: var(--text-primary);
}

@media (min-width: 768px) {
  .environment-policy-content {
    padding: 40px;
  }
  
  .section-title {
    font-size: 22px;
  }
  
  .policy-content p,
  .policy-content ol,
  .policy-content ul {
    font-size: 17px;
  }
}

@media (max-width: 480px) {
  .environment-policy-dialog :deep(.el-dialog) {
    width: 95% !important;
    margin: 0 auto;
  }
  
  .environment-policy-content {
    padding: 20px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .policy-content p,
  .policy-content ol,
  .policy-content ul {
    font-size: 14px;
  }
  
  .policy-content {
    padding-left: 16px;
  }
}

.environment-policy-button {
  background: rgba(64, 158, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid var(--glass-border);
  border-radius: 8px;
  box-shadow: 0 8px 32px var(--shadow-color);
  transition: all 0.3s ease;
  color: var(--text-secondary);
  font-weight: 500;
}

[data-theme="dark"] .environment-policy-button {
  background: var(--glass-bg);
}

.environment-policy-button:hover {
  background: var(--glass-bg-hover);
  border-color: var(--primary-color);
  box-shadow: 0 12px 40px var(--shadow-hover);
  transform: translateY(-2px);
  color: var(--primary-color);
}

.environment-policy-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 20px var(--shadow-color);
}
</style>
