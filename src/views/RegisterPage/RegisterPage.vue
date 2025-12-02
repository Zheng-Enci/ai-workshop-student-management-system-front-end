<script setup>
import { ref, onMounted } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElIcon, ElSelect, ElOption } from "element-plus";
import { User, Lock, Phone, School, Collection, House } from "@element-plus/icons-vue";
import { useRouter } from 'vue-router';
import { register, login } from '@/api/student';
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';

const router = useRouter();
const userStore = useUserStore();
const themeStore = useThemeStore();
const { toggleTheme } = themeStore;

const collegeOptions = [
  "融新学院",
  "机械电气与信息工程学院",
  "建筑科学与土木工程学院",
  "人工智能学院",
  "商 学 院",
  "博雅教育与艺术传媒学院",
  "外国语学院",
  "国 学 院",
  "思想政治理论课教学部",
  "教师进修学院",
  "体 育 部",
  "国际教育学院",
  "继续教育学院",
  "学研产企业学院",
  "研究生辅考学院"
];

const form = ref({
  name: "",
  studentId: "",
  gender: "",
  phoneNumber: "",
  college: "",
  major: "",
  grade: "",
  classNum: null,
  password: "",
  confirmPassword: ""
});

const formRef = ref(null);

const rules = {
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" }
  ],
  studentId: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { 
      pattern: /^(20|21|22|23|24|25|26|27|28|29|30)\d{8}$/, 
      message: "学号必须为10位数字，且以20-30开头", 
      trigger: "blur" 
    }
  ],
  gender: [
    { required: true, message: "请选择性别", trigger: "change" }
  ],
  phoneNumber: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" }
  ],
  college: [
    { required: true, message: "请选择学院", trigger: "change" }
  ],
  major: [
    { required: true, message: "请输入专业", trigger: "blur" }
  ],
  grade: [
    { required: true, message: "请选择年级", trigger: "change" },
    { 
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择年级'));
        } else if (!['1', '2', '3', '4', '5'].includes(value)) {
          callback(new Error('年级必须在 1-5 之间'));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ],
  classNum: [
    { required: true, message: "请输入班级", trigger: "blur" },
    { type: "number", min: 1, max: 100, message: "班级必须在 1-100 之间", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度至少 6 位", trigger: "blur" },
    { max: 16, message: "密码长度不能超过 16 位", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

const isLoading = ref(false);

const handleRegister = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
  } catch (error) {
    return;
  }

  isLoading.value = true;
  try {
    const registerData = {
      ...form.value,
      grade: form.value.grade ? Number(form.value.grade) : null,
      classNum: form.value.classNum ? Number(form.value.classNum) : null
    };
    await register(registerData);
    ElMessage.success('注册成功！正在为您登录...');
    
    const loginData = {
      studentId: form.value.studentId,
      password: form.value.password
    };
    
    const response = await login(loginData);
    const userInfo = {
      ...response.data,
      studentId: form.value.studentId
    };
    userStore.setUserInfo(userInfo, response.data.token);
    
    router.push('/navigation');
  } catch (error) {
    ElMessage.error(error.message || '注册失败，请检查您的信息');
  } finally {
    isLoading.value = false;
  }
};

const goToHome = () => {
  router.push('/');
};

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    router.push('/navigation');
  }
});
</script>

<template>
  <div class="register-container">
    <div class="background-effects">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <el-button @click="goToHome" class="home-btn" type="primary" :icon="House" circle></el-button>
    
    <div class="register-content">
      <div class="register-card">
        <div class="card-header">
          <img src="@/assets/AiWorkShop_icon.png" alt="AI坊学生管理系统" class="logo" @click="toggleTheme" title="切换主题模式">
          <h1>AI坊学生管理系统</h1>
          <p class="subtitle">人工智能创作坊</p>
        </div>
        
        <ElForm ref="formRef" :model="form" :rules="rules" label-width="0px" class="register-form">
          <div class="form-row">
            <ElFormItem prop="name" class="form-item-half">
              <div class="input-group">
                <div class="input-icon">
                  <ElIcon><User /></ElIcon>
                </div>
                <ElInput 
                  v-model="form.name" 
                  placeholder="请输入姓名" 
                  class="custom-input"
                  size="large"
                />
              </div>
            </ElFormItem>
            
            <ElFormItem prop="studentId" class="form-item-half">
              <div class="input-group">
                <div class="input-icon">
                  <ElIcon><Collection /></ElIcon>
                </div>
                <ElInput 
                  v-model="form.studentId" 
                  placeholder="请输入学号" 
                  class="custom-input"
                  size="large"
                />
              </div>
            </ElFormItem>
          </div>
          
          <div class="form-row">
            <ElFormItem prop="gender" class="form-item-half">
              <div class="input-group">
                <div class="input-icon">
                  <ElIcon><User /></ElIcon>
                </div>
                <ElSelect 
                  v-model="form.gender" 
                  placeholder="请选择性别" 
                  class="custom-select"
                  size="large"
                  popper-class="gender-select-dropdown"
                >
                  <ElOption label="男" value="男" />
                  <ElOption label="女" value="女" />
                </ElSelect>
              </div>
            </ElFormItem>
            
            <ElFormItem prop="phoneNumber" class="form-item-half">
              <div class="input-group">
                <div class="input-icon">
                  <ElIcon><Phone /></ElIcon>
                </div>
                <ElInput 
                  v-model="form.phoneNumber" 
                  placeholder="请输入手机号" 
                  class="custom-input"
                  size="large"
                />
              </div>
            </ElFormItem>
          </div>
          
          <div class="form-row">
            <ElFormItem prop="college" class="form-item-half">
              <div class="input-group">
                <div class="input-icon">
                  <ElIcon><School /></ElIcon>
                </div>
                <ElSelect 
                  v-model="form.college" 
                  placeholder="请选择学院" 
                  class="custom-select"
                  size="large"
                  popper-class="college-select-dropdown"
                >
                  <ElOption 
                    v-for="college in collegeOptions" 
                    :key="college" 
                    :label="college" 
                    :value="college" 
                  />
                </ElSelect>
              </div>
            </ElFormItem>
            
            <ElFormItem prop="major" class="form-item-half">
              <div class="input-group">
                <div class="input-icon">
                  <ElIcon><School /></ElIcon>
                </div>
                <ElInput 
                  v-model="form.major" 
                  placeholder="请输入专业" 
                  class="custom-input"
                  size="large"
                />
              </div>
            </ElFormItem>
          </div>
          
          <div class="form-row">
            <ElFormItem prop="grade" class="form-item-half">
              <div class="input-group">
                <div class="input-icon">
                  <ElIcon><School /></ElIcon>
                </div>
                <ElSelect 
                  v-model="form.grade" 
                  placeholder="请选择年级" 
                  class="custom-select"
                  size="large"
                  popper-class="grade-select-dropdown"
                >
                  <ElOption label="1年级" value="1" />
                  <ElOption label="2年级" value="2" />
                  <ElOption label="3年级" value="3" />
                  <ElOption label="4年级" value="4" />
                  <ElOption label="5年级" value="5" />
                </ElSelect>
              </div>
            </ElFormItem>
            
            <ElFormItem prop="classNum" class="form-item-half">
              <div class="input-group">
                <div class="input-icon">
                  <ElIcon><School /></ElIcon>
                </div>
                <ElInput 
                  v-model.number="form.classNum" 
                  placeholder="请输入班级" 
                  class="custom-input"
                  size="large"
                  type="number"
                  :min="1"
                  :max="100"
                />
              </div>
            </ElFormItem>
          </div>
          
          <ElFormItem prop="password">
            <div class="input-group">
              <div class="input-icon">
                <ElIcon><Lock /></ElIcon>
              </div>
              <ElInput 
                type="password" 
                v-model="form.password" 
                placeholder="请输入密码" 
                class="custom-input"
                size="large"
                show-password 
              />
            </div>
          </ElFormItem>
          
          <ElFormItem prop="confirmPassword">
            <div class="input-group">
              <div class="input-icon">
                <ElIcon><Lock /></ElIcon>
              </div>
              <ElInput 
                type="password" 
                v-model="form.confirmPassword" 
                placeholder="请确认密码" 
                class="custom-input"
                size="large"
                show-password 
              />
            </div>
          </ElFormItem>
          
          <ElButton 
            type="primary" 
            @click="handleRegister" 
            class="register-button"
            size="large"
            :loading="isLoading"
            :disabled="isLoading"
          >
            {{ isLoading ? '注册中...' : '注册' }}
          </ElButton>
        </ElForm>
        
        <div class="card-footer">
          <p class="login-link">
            已有账号？
            <router-link to="/login" class="link">立即登录</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.background-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #667eea, var(--secondary-color));
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  top: 60%;
  right: 10%;
  animation-delay: -7s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  bottom: 20%;
  left: 50%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(30px) rotate(240deg); }
}

.home-btn {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 48px;
  height: 48px;
  background: var(--primary-color);
  border: none;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  z-index: 10;
}

.register-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 600px;
  padding: 20px;
}

.register-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.register-card:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  margin-bottom: 20px;
}

.logo:hover {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.2);
}

.card-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea, var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

.register-form {
  margin-bottom: 24px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.form-item-half {
  flex: 1;
}

.input-group {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  z-index: 2;
  font-size: 18px;
  pointer-events: none;
}

.custom-input {
  width: 100%;
}

.custom-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding-left: 48px;
  box-shadow: none;
  transition: all 0.3s ease;
}

.custom-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.custom-input :deep(.el-input__inner) {
  color: var(--text-primary);
  background: transparent;
  border: none;
  font-size: 16px;
}

.custom-input :deep(.el-input__inner::placeholder) {
  color: var(--text-tertiary);
}

.custom-select {
  width: 100%;
  position: relative;
  z-index: 1;
}

.custom-select :deep(.el-select__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding-left: 48px;
  padding-right: 40px;
  box-shadow: none;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  position: relative;
}

.custom-select :deep(.el-select__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.custom-select :deep(.el-select__wrapper.is-focus) {
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.custom-select :deep(.el-select__selection) {
  width: 100%;
  display: flex;
  align-items: center;
  flex: 1;
  padding-right: 0;
  margin-right: 0;
  overflow: hidden;
  min-width: 0;
  height: 100%;
}

.custom-select :deep(.el-select__placeholder) {
  color: var(--text-tertiary);
  opacity: 1;
  font-size: 16px;
  margin-left: 0;
  padding-left: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  display: flex;
  align-items: center;
  height: 100%;
}

.custom-select :deep(.el-select__selected-item.is-hidden) {
  display: none;
}

.custom-select :deep(.el-select__selected-item:not(.is-hidden)) {
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.5;
  margin-left: 0;
  padding-left: 0;
  opacity: 1;
  visibility: visible;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  z-index: 0;
  height: 100%;
}

.custom-select :deep(.el-select__input-wrapper) {
  display: none;
}

.custom-select :deep(.el-select__input) {
  display: none;
}

.custom-select :deep(.el-select__tags) {
  margin-left: 0;
  padding-left: 0;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.custom-select :deep(.el-select__tags-text) {
  color: var(--text-primary);
  font-size: 16px;
  opacity: 1;
  visibility: visible;
}

.custom-select :deep(.el-select__suffix) {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  z-index: 1;
  flex-shrink: 0;
}

.custom-select :deep(.el-select__caret) {
  color: var(--text-tertiary);
  font-size: 14px;
  transition: transform 0.3s ease;
}

.custom-select :deep(.el-select__wrapper.is-focus .el-select__caret) {
  transform: rotate(180deg);
}

.register-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #667eea, var(--secondary-color));
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
}

.register-button:active {
  transform: translateY(0);
}

.card-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.login-link {
  color: var(--text-secondary);
  margin: 0;
  font-size: 14px;
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.link:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .home-btn {
    top: 20px;
    left: 20px;
    width: 44px;
    height: 44px;
  }
  
  .register-content {
    padding: 16px;
  }
  
  .register-card {
    padding: 32px 24px;
    border-radius: 20px;
  }
  
  .card-header h1 {
    font-size: 24px;
  }
  
  .logo {
    width: 70px;
    height: 70px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-item-half {
    margin-bottom: 20px;
  }
  
  .custom-input :deep(.el-input__inner) {
    font-size: 16px;
  }
  
  .register-button {
    height: 44px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .register-card {
    padding: 24px 20px;
    border-radius: 16px;
  }
  
  .card-header h1 {
    font-size: 22px;
  }
  
  .logo {
    width: 60px;
    height: 60px;
  }
  
  .subtitle {
    font-size: 14px;
  }
}
</style>

<style>
.gender-select-dropdown {
  z-index: 3000 !important;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: var(--bg-primary);
  backdrop-filter: blur(20px);
  padding: 8px 0;
}

.gender-select-dropdown .el-select-dropdown__item {
  color: var(--text-primary);
  padding: 12px 16px;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 2px 8px;
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
  line-height: 1.5;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
}

.gender-select-dropdown .el-select-dropdown__item:hover {
  background-color: rgba(102, 126, 234, 0.15);
  color: var(--primary-color);
}

.gender-select-dropdown .el-select-dropdown__item.selected {
  color: var(--primary-color);
  font-weight: 600;
  background-color: rgba(102, 126, 234, 0.2);
}

.college-select-dropdown {
  z-index: 3000 !important;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: var(--bg-primary);
  backdrop-filter: blur(20px);
  min-width: auto;
}

.college-select-dropdown .el-select-dropdown__item {
  color: var(--text-primary);
  padding: 12px 16px;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
  width: auto;
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
}

.college-select-dropdown .el-select-dropdown__item span {
  display: block;
  width: 100%;
  overflow: visible;
  white-space: nowrap;
  text-overflow: clip;
}

.college-select-dropdown .el-select-dropdown__item:hover {
  background-color: rgba(102, 126, 234, 0.15);
  color: var(--primary-color);
  transform: translateX(4px);
}

.college-select-dropdown .el-select-dropdown__item.selected {
  color: var(--primary-color);
  font-weight: 600;
  background-color: rgba(102, 126, 234, 0.2);
}

.college-select-dropdown .el-select-dropdown__item.selected:hover {
  background-color: rgba(102, 126, 234, 0.25);
}

.grade-select-dropdown {
  z-index: 3000 !important;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: var(--bg-primary);
  backdrop-filter: blur(20px);
  min-width: auto;
}

.grade-select-dropdown .el-select-dropdown__item {
  color: var(--text-primary);
  padding: 12px 16px;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
  width: auto;
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
}

.grade-select-dropdown .el-select-dropdown__item span {
  display: block;
  width: 100%;
  overflow: visible;
  white-space: nowrap;
  text-overflow: clip;
}

.grade-select-dropdown .el-select-dropdown__item:hover {
  background-color: rgba(102, 126, 234, 0.15);
  color: var(--primary-color);
  transform: translateX(4px);
}

.grade-select-dropdown .el-select-dropdown__item.selected {
  color: var(--primary-color);
  font-weight: 600;
  background-color: rgba(102, 126, 234, 0.2);
}

.grade-select-dropdown .el-select-dropdown__item.selected:hover {
  background-color: rgba(102, 126, 234, 0.25);
}
</style>
