<!--
  应用根组件
  提供应用的基础布局和全局样式设置

  @component App
  @description 作为Vue应用的根组件,定义全局样式和路由视图容器
-->
<script>
/**
 * 应用根组件
 * 作为整个应用的入口组件,包含路由视图容器和全局样式
 */
export default {
	name: 'App'
}
</script>

<template>
	<!-- 应用主容器,包含路由视图 -->
	<div class="app-container">
		<!-- 路由视图:根据当前路由动态渲染对应的页面组件 -->
		<router-view/>
	</div>
</template>

<style>
/* 应用主容器样式 */
.app-container {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  margin: 0;

  /* 设置字体族,优先使用系统字体 */
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
    Arial, sans-serif;

  /* 使用CSS变量设置文本和背景颜色,支持主题切换 */
  color: var(--text-primary);
  background-color: var(--bg-primary);

  /* 字体平滑渲染,提升显示效果 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 全局盒模型设置,确保padding和border包含在宽度内 */
* {
  box-sizing: border-box;
}

/* 全局body样式 */
body {
  width: 100%;
  padding: 0;
  margin: 0;

  /* 隐藏横向滚动条,防止页面出现水平滚动条 */
  overflow-x: hidden;
  background-color: var(--bg-primary);
}
</style>
