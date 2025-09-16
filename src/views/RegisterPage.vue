<script setup>
import { ref, onMounted } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElIcon, ElSelect, ElOption } from "element-plus";
import { User, Lock, Phone, School, Collection } from "@element-plus/icons-vue";
import { useRouter } from 'vue-router';
import { register, login } from '@/api/user';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  name: "",
  studentId: "",
  gender: "",
  phoneNumber: "",
  college: "",
  major: "",
  grade: null,
  classNum: null,
  password: "",
  confirmPassword: ""
});

const rules = {
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" }
  ],
  studentId: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学号必须为 10 位数字", trigger: "blur" }
  ],
  gender: [
    { required: true, message: "请选择性别", trigger: "change" }
  ],
  phoneNumber: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" }
  ],
  college: [
    { required: true, message: "请输入学院", trigger: "blur" }
  ],
  major: [
    { required: true, message: "请输入专业", trigger: "blur" }
  ],
  grade: [
    { required: true, message: "请输入年级", trigger: "blur" },
    { type: "number", min: 1, max: 5, message: "年级必须在1-5之间", trigger: "blur" }
  ],
  classNum: [
    { required: true, message: "请输入班级", trigger: "blur" },
    { type: "number", min: 1, max: 100, message: "班级必须在1-100之间", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度至少 6 位", trigger: "blur" },
    { max: 16, message: "密码长度不能超过 16 位", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" }
  ]
};

function validateConfirmPassword(rule, value, callback) {
  if (value !== form.value.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
}

const handleRegister = async () => {
  try {
    const registerData = {
      name: form.value.name,
      studentId: form.value.studentId,
      gender: form.value.gender,
      phoneNumber: form.value.phoneNumber,
      college: form.value.college,
      major: form.value.major,
      grade: form.value.grade,
      classNum: form.value.classNum,
      password: form.value.password
    };
    
    await register(registerData);
    ElMessage.success('注册成功，正在登录...');
    
    const loginResponse = await login({
      studentId: form.value.studentId,
      password: form.value.password
    });
    
    const userInfo = {
      ...loginResponse.data,
      studentId: form.value.studentId
    };
    userStore.setUserInfo(userInfo, loginResponse.data.token);
    
    ElMessage.success('登录成功');
    router.push('/navigation');
    
  } catch (error) {
    ElMessage.error(error.message || '操作失败');
  }
};

const goToLogin = () => {
  router.push('/login');
};

onMounted(() => {
});
</script>

<template>
  <div class="register-container">
    <div class="register-form-wrapper">
      <div class="logo-container">
        <img src="@/assets/AiWorkShop_icon.png" alt="学生管理系统" class="logo">
        <h2>学生注册</h2>
        <p class="tagline">加入我们，开启AI学习之旅</p>
      </div>
      <ElForm :model="form" :rules="rules" label-width="0px" class="custom-form">
        <ElFormItem prop="name">
          <div class="input-wrapper">
            <span class="input-icon">
              <ElIcon><User /></ElIcon>
            </span>
            <ElInput v-model="form.name" placeholder="请输入真实姓名（必填）" class="custom-input" />
          </div>
        </ElFormItem>
        
        <ElFormItem prop="studentId">
          <div class="input-wrapper">
            <span class="input-icon">
              <ElIcon><User /></ElIcon>
            </span>
            <ElInput v-model="form.studentId" placeholder="请输入10位数字学号" class="custom-input" />
          </div>
        </ElFormItem>
        
        <ElFormItem prop="gender">
          <div class="input-wrapper">
            <span class="input-icon">
              <ElIcon><User /></ElIcon>
            </span>
            <ElSelect v-model="form.gender" placeholder="请选择性别（男/女）" class="custom-input">
              <ElOption label="男" value="男" />
              <ElOption label="女" value="女" />
            </ElSelect>
          </div>
        </ElFormItem>
        
        <ElFormItem prop="phoneNumber">
          <div class="input-wrapper">
            <span class="input-icon">
              <ElIcon><Phone /></ElIcon>
            </span>
            <ElInput v-model="form.phoneNumber" placeholder="请输入11位手机号" class="custom-input" />
          </div>
        </ElFormItem>
        
        <ElFormItem prop="college">
          <div class="input-wrapper">
            <span class="input-icon">
              <ElIcon><School /></ElIcon>
            </span>
            <ElSelect v-model="form.college" placeholder="请选择学院" class="custom-input">
              <ElOption label="融新学院" value="融新学院" />
              <ElOption label="人工智能学院" value="人工智能学院" />
              <ElOption label="外国语学院" value="外国语学院" />
              <ElOption label="机械电气与信息工程学院" value="机械电气与信息工程学院" />
              <ElOption label="商学院" value="商学院" />
              <ElOption label="建筑科学与土木工程学院" value="建筑科学与土木工程学院" />
              <ElOption label="博雅教育与艺术传媒学院" value="博雅教育与艺术传媒学院" />
            </ElSelect>
          </div>
        </ElFormItem>
        
        <ElFormItem prop="major">
          <div class="input-wrapper">
            <span class="input-icon">
              <ElIcon><Collection /></ElIcon>
            </span>
            <ElInput v-model="form.major" placeholder="请输入专业名称（如：软件工程）" class="custom-input" />
          </div>
        </ElFormItem>
        
        <ElFormItem prop="grade">
          <div class="input-wrapper">
            <span class="input-icon">
              <ElIcon><School /></ElIcon>
            </span>
            <ElInput v-model.number="form.grade" placeholder="请输入年级（1-5之间的数字）" class="custom-input" />
          </div>
        </ElFormItem>
        
        <ElFormItem prop="classNum">
          <div class="input-wrapper">
            <span class="input-icon">
              <ElIcon><School /></ElIcon>
            </span>
            <ElInput v-model.number="form.classNum" placeholder="请输入班级（1-100之间的数字）" class="custom-input" />
          </div>
        </ElFormItem>
        
        <ElFormItem prop="password">
          <div class="input-wrapper">
            <span class="input-icon">
              <ElIcon><Lock /></ElIcon>
            </span>
            <ElInput type="password" v-model="form.password" placeholder="请输入密码（6-16位字符）" class="custom-input" show-password />
          </div>
        </ElFormItem>
        
        <ElFormItem prop="confirmPassword">
          <div class="input-wrapper">
            <span class="input-icon">
              <ElIcon><Lock /></ElIcon>
            </span>
            <ElInput type="password" v-model="form.confirmPassword" placeholder="请再次输入密码确认" class="custom-input" show-password />
          </div>
        </ElFormItem>
        
        <ElFormItem>
          <ElButton type="primary" @click="handleRegister" style="width: 100%" class="custom-button">
            <span class="button-text">注册</span>
          </ElButton>
        </ElFormItem>
        <div class="login-link">
          已有账号？<a @click="goToLogin" class="login-link-text">立即登录</a>
        </div>
      </ElForm>
    </div>
    <div class="register-footer">
      <p>© 2023 学生管理系统 版权所有</p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  padding: 15px;
  box-sizing: border-box;
  overflow-y: auto;
}

.register-form-wrapper {
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

.custom-button {
  height: 42px !important;
  border-radius: 21px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  background: linear-gradient(135deg, #4ca1af 0%, #2c3e50 100%) !important;
  border: none !important;
  width: 100% !important;
}

.login-link {
  text-align: center;
  margin-top: 15px;
  color: #7f8c8d;
  font-size: 13px;
}

.login-link-text {
  color: #4ca1af;
  cursor: pointer;
  text-decoration: underline;
}

.register-footer {
  display: none;
}
</style>