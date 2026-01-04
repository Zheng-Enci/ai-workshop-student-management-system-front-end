<script>
export default {
	name: 'App'
}
</script>

<template>
	<div class="app-container">
		<router-view/>
	</div>
</template>

<style>
.app-container {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
    Arial, sans-serif;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

body {
  width: 100%;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  background-color: var(--bg-primary);
}
</style>
