<!--
  应用根组件
  提供应用的基础布局和全局样式设置

  @component App
  @description 作为Vue应用的根组件,定义全局样式和路由视图容器
-->
<script>
/**
 * 应用根组件
 *
 * @component App
 * @description 作为整个Vue应用的入口根组件,负责以下功能:
 * 1. 提供路由视图容器,根据路由动态渲染页面组件
 * 2. 定义全局样式和基础布局
 * 3. 设置全局字体、颜色主题变量等基础配置
 * 4. 确保应用全屏显示和响应式布局
 *
 * @author 前端开发团队
 * @version 1.0.0
 */
export default {
	/**
	 * 组件名称
	 * @type {string}
	 */
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
/**
 * 应用主容器样式
 * @description 定义应用根容器的布局和基础样式
 */
.app-container {
  /* 宽度占满父容器 */
  width: 100%;

  /* 最小高度为视口高度,确保内容不足时也能全屏显示 */
  min-height: 100vh;

  /* 清除默认内边距和外边距 */
  padding: 0;
  margin: 0;

  /**
   * 字体族设置
   * @description 优先使用系统字体,提供跨平台一致的字体体验
   * 顺序: macOS/iOS系统字体 → Windows系统字体 → 中文字体 → 通用无衬线字体
   */
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
    Arial, sans-serif;

  /**
   * 文本和背景颜色
   * @description 使用CSS变量实现主题切换功能,支持亮色/暗色模式
   */
  color: var(--text-primary);
  background-color: var(--bg-primary);

  /**
   * 字体平滑渲染
   * @description 在不同操作系统上优化字体显示效果,提升可读性
   */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/**
 * 全局盒模型设置
 * @description 统一所有元素的盒模型计算方式,确保padding和border包含在元素宽度内
 */
* {
  box-sizing: border-box;
}

/**
 * 全局body样式
 * @description 设置body元素的基础样式,确保页面布局正常
 */
body {
  /* 宽度占满视口 */
  width: 100%;

  /* 清除默认内边距和外边距 */
  padding: 0;
  margin: 0;

  /**
   * 横向滚动条控制
   * @description 隐藏横向滚动条,防止页面出现不必要的水平滚动
   */
  overflow-x: hidden;

  /* 背景颜色使用主题变量,支持主题切换 */
  background-color: var(--bg-primary);
}
</style>
