const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        port: 8083,
        host: '0.0.0.0',
        open: true,
        allowedHosts: 'all',
        hot: true,
        liveReload: true,
        client: {
            webSocketURL: 'auto://0.0.0.0:0/ws',
            overlay: {
                runtimeErrors: (error) => {
                    const ignoreErrors = [
                        'ResizeObserver loop completed with undelivered notifications.'
                    ]
                    return !ignoreErrors.includes(error.message)
                }
            }
        }
    },
    publicPath: '/',
    pages: {
        index: {
            entry: 'src/main.js',
        }
    },
    configureWebpack: {
        resolve: {
            extensions: ['.js', '.vue', '.json']
        }
    }
})
