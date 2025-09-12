const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        port: 8083, // 指定端口为8083
        host: '0.0.0.0', // 允许外部访问
        open: true, // 自动打开浏览器
        allowedHosts: 'all', // 允许所有主机访问
        hot: true, // 启用热模块替换
        liveReload: true, // 启用实时重载
        client: {
            webSocketURL: 'auto://0.0.0.0:0/ws' // 修复WebSocket连接问题
        }
    },
    publicPath: '/', // 确保publicPath正确
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
