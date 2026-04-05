<template>
	<!-- 加载蒙版 -->
	<div v-if="loadingMaskStore.isShowLoadingMask" class="loading-mask">
		<img src="@/assets/loading.gif" alt="加载中...">
		<p>{{ loadingMaskStore.loadingMaskText }}</p>
	</div>

</template>

<script setup lang="ts">
import {useLoadingMaskStore} from '../stores/loading'
import type {LoadingMaskStore} from '../stores/loading'

const loadingMaskStore: LoadingMaskStore = useLoadingMaskStore()
</script>

<style scoped>
/**
 * 加载蒙版容器样式
 * 固定定位覆盖整个页面，确保加载蒙版始终在最上层
 */
.loading-mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center; /* 垂直居中：让内容在垂直方向上居中显示 */
	justify-content: center; /* 水平居中：让内容在水平方向上居中显示 */
	z-index: 9999; /* 确保蒙版在最上层：设置极高的z-index值，确保蒙版覆盖所有其他元素 */
	animation: loading-mask-fade-in 0.8s ease-in-out; /* 入场动画：淡入效果，持续0.8秒，使用缓入缓出动画函数 */
	background-color: rgba(0, 0, 0, 0.2); /* 日间模式：半透明黑色背景，透明度为0.2，提供轻微的遮罩效果 */
}

/**
 * 加载GIF图片样式
 * 设置loading动画图片的尺寸，在电脑端和移动端有不同的显示大小
 */
.loading-mask img {
	width: 8%; /* 电脑端：图片宽度占视口宽度的8%，适合桌面设备显示 */
	height: auto; /* 高度自适应：根据图片原始比例自动计算，保持图片不变形 */
}

/**
 * 手机端适配样式
 * 当屏幕宽度小于等于768px时，应用以下样式
 * 768px是移动端和桌面端的常见断点
 */
@media (max-width: 768px) {
	.loading-mask img {
		width: 16%; /* 手机端：图片宽度占视口宽度的16%，适合移动设备显示，比桌面端更大以提高可见性 */
	}
}

/**
 * 加载文字样式
 * 设置加载提示文字的字体大小和基本样式
 */
.loading-mask p {
	font-size: 2vh; /* 字体大小：使用视口高度单位，确保文字大小随屏幕尺寸自适应变化 */
}

/**
 * 夜间模式下的加载蒙版背景色
 * 当html元素有.dark类时应用此样式（夜间模式由主题切换功能控制）
 */
html.dark .loading-mask {
	background-color: rgba(255, 255, 255, 0.08); /* 夜间模式：半透明白色背景，透明度为0.2，提供轻微的遮罩效果 */
}

/**
 * 加载蒙版入场动画关键帧
 * 定义从完全透明到完全不透明的渐变过程
 */
@keyframes loading-mask-fade-in {
	from {
		opacity: 0; /* 动画开始状态：完全透明，不可见 */
	}
	to {
		opacity: 1; /* 动画结束状态：完全不透明，完全可见 */
	}
}

</style>
