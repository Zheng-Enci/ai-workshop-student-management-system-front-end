import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import stylelint from 'vite-plugin-stylelint'
import eslint from 'vite-plugin-eslint'
import { cssAnalyzerPlugin } from './code-quality/vite-plugins/vite-plugin-css-analyzer.js'
import { depcheckPlugin } from './code-quality/vite-plugins/vite-plugin-depcheck.js'
import { auditPlugin } from './code-quality/vite-plugins/vite-plugin-audit.js'
import { commentCoveragePlugin } from './code-quality/vite-plugins/vite-plugin-comment-coverage.js'
import { eslintReportPlugin } from './code-quality/vite-plugins/vite-plugin-eslint-report.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
        logger.info(`🔍 [${timestamp}] 正在运行 ${checkName} 检查...`)
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
                logger.info(`✅ [${endTime}] ${checkName} 检查完成 (耗时 ${duration}s)`)
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
              logger.info(`✅ [${endTime}] ${checkName} 检查完成 (耗时 ${duration}s)`)
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

// 专门用于代码质量检查的 Vite 配置
export default defineConfig({
  plugins: [
    vue(),
    // 代码质量检查提示插件
    {
      name: 'code-quality-logger',
      buildStart(pluginContext) {
        const logger = pluginContext?.logger || console
        if (logger.info) {
          logger.info('\n📋 开始代码质量检查...')
        } else {
          console.log('\n📋 开始代码质量检查...')
        }
      }
    },
    // ESLint 检查
    withCheckLogging(
      eslint({
        eslintPath: 'eslint',
        overrideConfigFile: 'code-quality/code-quality-config/.eslintrc.js',
        ignorePath: 'code-quality/code-quality-config/.eslintignore',
        include: ['src/**/*.{js,vue}'],
        exclude: ['node_modules', 'dist'],
        cache: false,
        fix: true,
        failOnWarning: false,
        failOnError: false
      }),
      'ESLint 代码规范'
    ),
    // ESLint 报告生成
    withCheckLogging(
      eslintReportPlugin({
        enabled: true,
        configFile: 'code-quality/code-quality-config/.eslintrc.js',
        ignorePath: 'code-quality/code-quality-config/.eslintignore',
        include: ['src/**/*.{js,vue}'],
        exclude: ['node_modules', 'dist'],
        skipOnError: true
      }),
      'ESLint 报告生成'
    ),
    // Stylelint 检查
    withCheckLogging(
      stylelint({
        configFile: 'code-quality/code-quality-config/.stylelintrc.js',
        include: ['src/**/*.{css,scss,sass,less,styl,vue}'],
        exclude: ['node_modules', 'dist'],
        cache: false,
        fix: true
      }),
      'Stylelint 样式规范'
    ),
    // CSS 分析
    withCheckLogging(
      cssAnalyzerPlugin({
        enabled: true,
        threshold: 0,
        concurrency: 5,
        cacheEnabled: true,
        blockOnUnused: false
      }),
      'CSS 使用情况分析'
    ),
    // 依赖检查
    withCheckLogging(
      depcheckPlugin({
        enabled: true,
        configPath: 'code-quality/code-quality-config/.depcheckrc.json',
        skipOnError: true
      }),
      '依赖完整性检查'
    ),
    // 安全审计
    withCheckLogging(
      auditPlugin({
        enabled: true,
        auditLevel: 'moderate',
        skipOnError: true
      }),
      '安全漏洞审计'
    ),
    // 注释覆盖率检查
    withCheckLogging(
      commentCoveragePlugin({
        enabled: true,
        srcDir: 'src',
        extensions: ['.js', '.vue', '.css', '.scss'],
        minCoverage: 32, // 默认最低要求（用于未配置的文件类型）
        minCoverageByExtension: {
          '.js': 32,    // JavaScript 文件最低要求 32%
          '.vue': 32,   // Vue 文件最低要求 32%
          '.css': 16,   // CSS 文件最低要求 16%
          '.scss': 16   // SCSS 文件最低要求 16%
        },
        warnThreshold: 10,
        showDetails: false,
        skipOnError: true
      }),
      '代码注释覆盖率'
    )
  ],
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

