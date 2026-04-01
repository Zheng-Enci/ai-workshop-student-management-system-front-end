<template>
  <div class="mobile-only-notice">
    <div class="notice-content">
      <el-icon :size="48" color="#909399"><Monitor /></el-icon>
      <h2>本功能只支持电脑端</h2>
      <p>请使用电脑访问以查看考勤分析数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Monitor } from '@element-plus/icons-vue'
</script>

<style scoped>
.mobile-only-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.notice-content {
  text-align: center;
  color: #fff;
  padding: 40px;
}

.notice-content h2 {
  margin: 20px 0 10px;
  font-size: 24px;
}

.notice-content p {
  font-size: 14px;
  opacity: 0.8;
}
</style>
