import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import stylelint from 'vite-plugin-stylelint'
import eslint from 'vite-plugin-eslint'
import { cssAnalyzerPlugin } from './vite-plugin-css-analyzer.js'
import { depcheckPlugin } from './vite-plugin-depcheck.js'
import { auditPlugin } from './vite-plugin-audit.js'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslint({
      include: ['src/**/*.{js,vue}'],
      exclude: ['node_modules', 'dist'],
      cache: false,
      fix: true,
      failOnWarning: false,
      failOnError: true
    }),
    stylelint({
      include: ['src/**/*.{css,scss,sass,less,styl,vue}'],
      exclude: ['node_modules', 'dist'],
      cache: false,
      fix: true
    }),
    cssAnalyzerPlugin({
      enabled: process.env.CSS_ANALYZER_ENABLED === 'true',
      interval: 5 * 60 * 1000,
      threshold: 20,
      blockOnUnused: true
    }),
    depcheckPlugin({
      enabled: true,
      configPath: '.depcheckrc.json',
      skipOnError: true
    }),
    auditPlugin({
      enabled: true,
      auditLevel: 'moderate',
      skipOnError: true
    }),
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
