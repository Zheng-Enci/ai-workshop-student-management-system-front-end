const { defineConfig } = require('@vue/cli-service')
const path = require('path')
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
            webSocketURL: {
                hostname: '0.0.0.0',
                pathname: '/ws',
                port: 8083,
                protocol: 'ws'
            },
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
            extensions: ['.js', '.vue', '.json'],
            alias: {
                '@fullcalendar/core/internal.js': path.resolve(__dirname, 'node_modules/@fullcalendar/core/internal.js'),
                '@fullcalendar/core/internal': path.resolve(__dirname, 'node_modules/@fullcalendar/core/internal.js')
            }
        }
    }
})
