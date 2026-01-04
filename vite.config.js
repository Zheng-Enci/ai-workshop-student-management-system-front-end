import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import stylelint from 'vite-plugin-stylelint'
import eslint from 'vite-plugin-eslint'
import { cssAnalyzerPlugin } from './code-quality/vite-plugins/vite-plugin-css-analyzer.js'
import { depcheckPlugin } from './code-quality/vite-plugins/vite-plugin-depcheck.js'
import { auditPlugin } from './code-quality/vite-plugins/vite-plugin-audit.js'
import { commentCoveragePlugin } from './code-quality/vite-plugins/vite-plugin-comment-coverage.js'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

/**
 * 为插件添加检查提示信息
 * @param {Object} plugin - Vite 插件对象
 * @param {string} checkName - 检查名称
 * @returns {Object} 包装后的插件
 */
function withCheckLogging(plugin, checkName) {
  if (!plugin || typeof plugin !== 'object') {
    return plugin
  }

  const originalBuildStart = plugin.buildStart
  const originalName = plugin.name || 'unknown-plugin'
  const startTime = Symbol('startTime')

  return {
    ...plugin,
    name: originalName,
    buildStart(pluginContext) {
      // 输出检查开始提示信息
      const logger = pluginContext?.logger || console
      const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false })
      
      if (logger.info) {
        logger.info(`🔍 [${timestamp}] 正在运行 ${checkName} 检查...`, { timestamp: true })
      } else {
        console.log(`🔍 [${timestamp}] 正在运行 ${checkName} 检查...`)
      }

      // 记录开始时间
      this[startTime] = Date.now()

      // 调用原始的 buildStart 钩子
      if (originalBuildStart) {
        const result = originalBuildStart.call(this, pluginContext)
        
        // 如果是 Promise，在完成后输出提示
        if (result && typeof result.then === 'function') {
          result
            .then(() => {
              const duration = ((Date.now() - this[startTime]) / 1000).toFixed(2)
              const endTime = new Date().toLocaleTimeString('zh-CN', { hour12: false })
              if (logger.info) {
                logger.info(`✅ [${endTime}] ${checkName} 检查完成 (耗时 ${duration}s)`, { timestamp: true })
              } else {
                console.log(`✅ [${endTime}] ${checkName} 检查完成 (耗时 ${duration}s)`)
              }
            })
            .catch(() => {
              // 错误由插件自己处理，这里不输出
            })
        } else {
          // 同步完成，立即输出提示
          const duration = ((Date.now() - this[startTime]) / 1000).toFixed(2)
          const endTime = new Date().toLocaleTimeString('zh-CN', { hour12: false })
          // 延迟一点输出，让检查有时间执行
          setTimeout(() => {
            if (logger.info) {
              logger.info(`✅ [${endTime}] ${checkName} 检查完成 (耗时 ${duration}s)`, { timestamp: true })
            } else {
              console.log(`✅ [${endTime}] ${checkName} 检查完成 (耗时 ${duration}s)`)
            }
          }, 100)
        }
        
        return result
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 代码质量检查提示插件
    {
      name: 'code-quality-logger',
      apply: 'serve',
      buildStart(pluginContext) {
        const logger = pluginContext?.logger || console
        if (logger.info) {
          logger.info('\n📋 开始代码质量检查...', { timestamp: true })
        } else {
          console.log('\n📋 开始代码质量检查...')
        }
      }
    },
    // ESLint 检查
    (() => {
      const eslintPlugin = eslint({
        overrideConfigFile: 'code-quality/code-quality-config/.eslintrc.js',
        ignorePath: 'code-quality/code-quality-config/.eslintignore',
        include: ['src/**/*.{js,vue}'],
        exclude: ['node_modules', 'dist'],
        cache: false,
        fix: true,
        failOnWarning: false,
        failOnError: true
      })
      return withCheckLogging(eslintPlugin, 'ESLint 代码规范')
    })(),
    // Stylelint 检查
    (() => {
      const stylelintPlugin = stylelint({
        configFile: 'code-quality/code-quality-config/.stylelintrc.js',
        include: ['src/**/*.{css,scss,sass,less,styl,vue}'],
        exclude: ['node_modules', 'dist'],
        cache: false,
        fix: true
      })
      return withCheckLogging(stylelintPlugin, 'Stylelint 样式规范')
    })(),
    // CSS 分析
    (() => {
      const cssAnalyzer = cssAnalyzerPlugin({
        enabled: true,
        threshold: 0,
        concurrency: 5,
        cacheEnabled: true,
        blockOnUnused: false
      })
      return withCheckLogging(cssAnalyzer, 'CSS 使用情况分析')
    })(),
    // 依赖检查
    (() => {
      const depcheck = depcheckPlugin({
        enabled: true,
        configPath: 'code-quality/code-quality-config/.depcheckrc.json',
        skipOnError: true
      })
      return withCheckLogging(depcheck, '依赖完整性检查')
    })(),
    // 安全审计
    (() => {
      const audit = auditPlugin({
        enabled: true,
        auditLevel: 'moderate',
        skipOnError: true
      })
      return withCheckLogging(audit, '安全漏洞审计')
    })(),
    // 注释覆盖率检查
    (() => {
      const commentCoverage = commentCoveragePlugin({
        enabled: true,
        srcDir: 'src',
        extensions: ['.js', '.vue'],
        minCoverage: 0,
        warnThreshold: 10,
        showDetails: false,
        skipOnError: true
      })
      return withCheckLogging(commentCoverage, '代码注释覆盖率')
    })(),
    (process.env.ANALYZE === 'true' || process.env.NODE_ENV === 'production') &&
      visualizer({
        open: false,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
        title: 'Bundle Analysis',
        emitFile: true
      })
  ].filter(Boolean),
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
    strictPort: false,
    proxy: {
      // 如果有API代理需求，可以在这里配置
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          elementPlus: ['element-plus'],
          echarts: ['echarts', 'echarts-wordcloud']
        }
      }
    }
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@fullcalendar/core/internal.js': path.resolve(__dirname, 'node_modules/@fullcalendar/core/internal.js'),
      '@fullcalendar/core/internal': path.resolve(__dirname, 'node_modules/@fullcalendar/core/internal.js')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/theme.css";`
      }
    }
  }
})
