const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: 'src/main.js', // 明确指定入口文件为main.js
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'] // 确保能正确解析.js文件
    }
  }
})
