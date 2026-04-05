### 修复 AdminPageDesktop.vue 模板结构错误

- 修复 AdminPageDesktop.vue 第732行缺少 `<div ` 前缀导致的 HTML 标签无效错误
- 修复模板结构错误：删除 `</template>` 标签后多余的 `</template>` 和 HTML 代码片段
- 删除 AdminPageDesktop.vue 和 AdminPageMobile.vue 中内联的弹窗表单代码，统一使用 forms 目录下的独立组件
