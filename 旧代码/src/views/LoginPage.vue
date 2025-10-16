<script setup>
import { ref, onMounted } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElCheckbox, ElIcon } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";
import { useRouter } from 'vue-router';
import { login } from '@/api/user';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const form = ref({
  studentId: "",
  password: ""
});
const rememberMe = ref(false);

const rules = {
  studentId: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学号必须为 10 位数字", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度至少 6 位", trigger: "blur" },
    { max: 16, message: "密码长度不能超过 16 位", trigger: "blur" }
  ]
};

const handleLogin = async () => {
  try {
    const response = await login(form.value);
    const userInfo = {
      ...response.data,
      studentId: form.value.studentId
    };
    userStore.setUserInfo(userInfo, response.data.token);
    
    if (rememberMe.value) {
      localStorage.setItem('rememberedUser', JSON.stringify({
        studentId: form.value.studentId,
        password: form.value.password
      }));
    } else {
      localStorage.removeItem('rememberedUser');
    }
    
    ElMessage.success('登录成功');
    router.push('/navigation');
  } catch (error) {
    ElMessage.error(error.message || '登录失败，请检查您的学号和密码');
  }
};

onMounted(() => {
  const rememberedUser = localStorage.getItem('rememberedUser');
  if (rememberedUser) {
    try {
      const userData = JSON.parse(rememberedUser);
      form.value.studentId = userData.studentId;
      form.value.password = userData.password;
      rememberMe.value = true;
    } catch (error) {
      localStorage.removeItem('rememberedUser');
    }
  }
});
</script>

<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="logo-container">
        <img src="@/assets/AiWorkShop_icon.png" alt="学生管理系统" class="logo">
        <h2>学生管理系统</h2>
        <p class="tagline">世界很大 AI无限</p>
      </div>
      <ElForm :model="form" :rules="rules" label-width="0px" class="custom-form">
        <ElFormItem prop="studentId">
          <div class="input-wrapper">
            <span class="input-icon">
              <ElIcon><User /></ElIcon>
            </span>
            <ElInput v-model="form.studentId" placeholder="请输入学号" class="custom-input" />
          </div>
        </ElFormItem>
        <ElFormItem prop="password">
          <div class="input-wrapper">
            <span class="input-icon">
              <ElIcon><Lock /></ElIcon>
            </span>
            <ElInput type="password" v-model="form.password" placeholder="请输入密码" class="custom-input" show-password />
          </div>
        </ElFormItem>
        <ElFormItem class="remember-me">
          <ElCheckbox v-model="rememberMe" class="custom-checkbox">记住我</ElCheckbox>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="handleLogin" style="width: 100%" class="custom-button">
            <span class="button-text">登录</span>
          </ElButton>
        </ElFormItem>
        <div class="register-link">
          还没有账号？<router-link to="/register">立即注册</router-link>
        </div>
      </ElForm>
    </div>
    <div class="login-footer">
      <p>© 2023 学生管理系统 版权所有</p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  padding: 15px;
  box-sizing: border-box;
  overflow-y: auto;
}

.login-form-wrapper {
  width: 100%;
  max-width: 320px;
  padding: 20px 15px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 15px;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

h2 {
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
}

.tagline {
  margin-top: 3px;
  font-size: 12px;
  color: #7f8c8d;
}

.input-wrapper {
  position: relative;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 12px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.custom-input {
  border-radius: 8px !important;
  height: 40px !important;
  padding-left: 40px !important;
  font-size: 14px !important;
  flex-grow: 1;
  text-align: left;
}

.remember-me {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

.custom-checkbox {
  color: #4ca1af;
  font-size: 14px;
}

.custom-button {
  height: 42px !important;
  border-radius: 21px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  background: linear-gradient(135deg, #4ca1af 0%, #2c3e50 100%) !important;
  border: none !important;
  width: 100% !important;
}

.register-link {
  text-align: center;
  margin-top: 15px;
  color: #7f8c8d;
  font-size: 13px;
}

.login-footer {
  display: none;
}
</style>