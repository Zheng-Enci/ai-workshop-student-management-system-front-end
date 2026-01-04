#!/usr/bin/env node

import { PurgeCSS } from 'purgecss'
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs'
import { join, extname, dirname, relative, basename } from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
}

class Logger {
  constructor(level = LOG_LEVELS.INFO) {
    this.level = level
    this.logs = []
  }

  error(message, ...args) {
    if (this.level >= LOG_LEVELS.ERROR) {
      const log = `[ERROR] ${message}`
      console.error(`\x1b[31m${log}\x1b[0m`, ...args)
      this.logs.push({ level: 'ERROR', message, args, timestamp: new Date().toISOString() })
    }
  }

  warn(message, ...args) {
    if (this.level >= LOG_LEVELS.WARN) {
      const log = `[WARN] ${message}`
      console.warn(`\x1b[33m${log}\x1b[0m`, ...args)
      this.logs.push({ level: 'WARN', message, args, timestamp: new Date().toISOString() })
    }
  }

  info(message, ...args) {
    if (this.level >= LOG_LEVELS.INFO) {
      const log = `[INFO] ${message}`
      console.log(`\x1b[36m${log}\x1b[0m`, ...args)
      this.logs.push({ level: 'INFO', message, args, timestamp: new Date().toISOString() })
    }
  }

  debug(message, ...args) {
    if (this.level >= LOG_LEVELS.DEBUG) {
      const log = `[DEBUG] ${message}`
      console.log(`\x1b[90m${log}\x1b[0m`, ...args)
      this.logs.push({ level: 'DEBUG', message, args, timestamp: new Date().toISOString() })
    }
  }

  success(message, ...args) {
    if (this.level >= LOG_LEVELS.INFO) {
      const log = `[SUCCESS] ${message}`
      console.log(`\x1b[32m${log}\x1b[0m`, ...args)
      this.logs.push({ level: 'SUCCESS', message, args, timestamp: new Date().toISOString() })
    }
  }

  getLogs() {
    return this.logs
  }
}

class CSSAnalyzer {
  constructor(options = {}) {
    this.options = {
      projectRoot: PROJECT_ROOT,
      srcDir: join(PROJECT_ROOT, 'src'),
      outputDir: join(PROJECT_ROOT, '.css-analysis'),
      concurrency: options.concurrency || 5,
      cacheEnabled: options.cache !== false,
      cacheDir: join(PROJECT_ROOT, '.css-analysis', 'cache'),
      logLevel: options.debug ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO,
      formats: options.formats || ['json', 'markdown'],
      threshold: options.threshold || 0,
      ...options
    }
    this.logger = new Logger(this.options.logLevel)
    this.cache = new Map()
    this.stats = {
      totalFiles: 0,
      analyzedFiles: 0,
      errorFiles: 0,
      totalSize: 0,
      unusedSize: 0,
      usedSize: 0,
      startTime: null,
      endTime: null
    }
  }

  ensureOutputDir() {
    if (!existsSync(this.options.outputDir)) {
      mkdirSync(this.options.outputDir, { recursive: true })
    }
    if (this.options.cacheEnabled && !existsSync(this.options.cacheDir)) {
      mkdirSync(this.options.cacheDir, { recursive: true })
    }
  }

  getCacheKey(filePath, contentFiles) {
    const fileContent = readFileSync(filePath, 'utf-8')
    const contentHash = createHash('md5')
      .update(JSON.stringify(contentFiles.sort()))
      .digest('hex')
    const fileHash = createHash('md5')
      .update(fileContent)
      .digest('hex')
    return `${basename(filePath)}-${fileHash}-${contentHash}`
  }

  getCachedResult(cacheKey) {
    if (!this.options.cacheEnabled) return null
    const cacheFile = join(this.options.cacheDir, `${cacheKey}.json`)
    if (existsSync(cacheFile)) {
      try {
        const cached = JSON.parse(readFileSync(cacheFile, 'utf-8'))
        if (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
          return cached.data
        }
      } catch (error) {
        this.logger.debug(`缓存读取失败: ${cacheFile}`, error.message)
      }
    }
    return null
  }

  setCachedResult(cacheKey, data) {
    if (!this.options.cacheEnabled) return
    const cacheFile = join(this.options.cacheDir, `${cacheKey}.json`)
    try {
      writeFileSync(cacheFile, JSON.stringify({
        timestamp: Date.now(),
        data
      }), 'utf-8')
    } catch (error) {
      this.logger.debug(`缓存写入失败: ${cacheFile}`, error.message)
    }
  }

  getAllCssFiles(dir, fileList = []) {
    try {
      const files = readdirSync(dir)
      files.forEach(file => {
        const filePath = join(dir, file)
        try {
          const stat = statSync(filePath)
          if (stat.isDirectory()) {
            if (!filePath.includes('node_modules') && 
                !filePath.includes('dist') && 
                !filePath.includes('.git') &&
                !filePath.includes('.css-analysis')) {
              this.getAllCssFiles(filePath, fileList)
            }
          } else if (extname(file) === '.css' || extname(file) === '.scss') {
            fileList.push(filePath)
          }
        } catch (error) {
          this.logger.debug(`无法访问文件: ${filePath}`, error.message)
        }
      })
    } catch (error) {
      this.logger.warn(`无法读取目录: ${dir}`, error.message)
    }
    return fileList
  }

  getContentFiles() {
    const contentFiles = []
    const scanDirs = [
      join(this.options.srcDir),
      join(this.options.projectRoot, 'index.html')
    ]

    const scanDir = (dir) => {
      try {
        if (!existsSync(dir)) return
        const stat = statSync(dir)
        if (!stat.isDirectory()) {
          if (/\.(vue|js|jsx|ts|tsx|html)$/.test(dir)) {
            contentFiles.push(dir)
          }
          return
        }
        const files = readdirSync(dir)
        files.forEach(file => {
          const filePath = join(dir, file)
          try {
            const stat = statSync(filePath)
            if (stat.isDirectory()) {
              if (!filePath.includes('node_modules') && 
                  !filePath.includes('dist') && 
                  !filePath.includes('.git') &&
                  !filePath.includes('.css-analysis')) {
                scanDir(filePath)
              }
            } else if (/\.(vue|js|jsx|ts|tsx|html)$/.test(file)) {
              contentFiles.push(filePath)
            }
          } catch (error) {
            this.logger.debug(`无法访问文件: ${filePath}`, error.message)
          }
        })
      } catch (error) {
        this.logger.debug(`无法读取目录: ${dir}`, error.message)
      }
    }

    scanDirs.forEach(dir => scanDir(dir))
    return contentFiles
  }

  async analyzeFile(cssFile, contentFiles) {
    const cacheKey = this.getCacheKey(cssFile, contentFiles)
    const cached = this.getCachedResult(cacheKey)
    if (cached) {
      this.logger.debug(`使用缓存: ${cssFile}`)
      return cached
    }

    try {
      const cssContent = readFileSync(cssFile, 'utf-8')
      const purgeCSSResult = await new PurgeCSS().purge({
        content: contentFiles.map(file => ({
          raw: readFileSync(file, 'utf-8'),
          extension: extname(file).slice(1)
        })),
        css: [{ raw: cssContent, name: cssFile }],
        defaultExtractor: (content) => {
          const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
          const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
          return broadMatches.concat(innerMatches)
        },
        safelist: {
          standard: [
            /^el-/,
            /^dark$/,
            /^light$/,
            /^theme-toggle/,
            /data-v-/,
            /^v-/,
            /^is-/,
            /^has-/,
            /^echarts/,
            /^fullcalendar/,
          ],
          deep: [
            /^el-(button|input|select|table|dialog|message|notification|loading|popover|tooltip|dropdown|menu|form|form-item|card|tabs|tab-pane|pagination|date-picker|time-picker|upload|progress|tag|badge|alert|breadcrumb|steps|carousel|collapse|timeline|tree|transfer|cascader|color-picker|rate|slider|switch|radio|checkbox|divider|link|backtop|page-header|avatar|skeleton|empty|result|descriptions|statistic|anchor|affix|space|image|image-viewer|drawer|popconfirm|calendar|card|container|header|aside|main|footer|row|col|scrollbar|infinite-scroll|loading|message-box|notification|message|popover|tooltip|dropdown|menu|menu-item|submenu|menu-item-group|breadcrumb|breadcrumb-item|page-header|tabs|tab-pane|steps|step|carousel|carousel-item|collapse|collapse-item|timeline|timeline-item|tree|tree-node|transfer|cascader|cascader-panel|cascader-node|color-picker|rate|slider|switch|radio|radio-group|radio-button|checkbox|checkbox-group|checkbox-button|divider|link|backtop|page-header|avatar|skeleton|skeleton-item|empty|result|descriptions|descriptions-item|statistic|anchor|anchor-link|affix|space|space-item|image|image-viewer|drawer|popconfirm|calendar)/,
          ],
          greedy: [
            /^el-/,
            /^echarts/,
            /^fullcalendar/,
          ]
        },
        variables: true,
        keyframes: true,
        fontFace: true,
        rejected: true,
        rejectedCss: true,
      })

      const originalSize = cssContent.length
      const purgedSize = purgeCSSResult[0].css.length
      const unusedSize = originalSize - purgedSize
      const unusedPercent = originalSize > 0 ? ((unusedSize / originalSize) * 100).toFixed(2) : 0

      const result = {
        file: relative(this.options.projectRoot, cssFile),
        originalSize,
        purgedSize,
        unusedSize,
        unusedPercent: parseFloat(unusedPercent),
        usedSize: purgedSize,
        status: unusedSize > 0 ? 'has-unused' : 'all-used',
        rejected: purgeCSSResult[0].rejected || [],
        timestamp: new Date().toISOString()
      }

      this.setCachedResult(cacheKey, result)
      return result
    } catch (error) {
      this.logger.error(`分析文件失败: ${cssFile}`, error.message)
      this.stats.errorFiles++
      return {
        file: relative(this.options.projectRoot, cssFile),
        error: error.message,
        status: 'error',
        timestamp: new Date().toISOString()
      }
    }
  }

  async analyzeFiles(cssFiles, contentFiles) {
    const results = []
    const chunks = []
    for (let i = 0; i < cssFiles.length; i += this.options.concurrency) {
      chunks.push(cssFiles.slice(i, i + this.options.concurrency))
    }

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(file => this.analyzeFile(file, contentFiles))
      )
      results.push(...chunkResults)
      this.stats.analyzedFiles += chunkResults.length
      this.logger.info(`进度: ${this.stats.analyzedFiles}/${this.stats.totalFiles} 文件已分析`)
    }

    return results
  }

  generateJSONReport(results) {
    const report = {
      metadata: {
        project: 'AI坊学生管理系统',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        analyzer: 'CSS Analyzer Enterprise Edition',
        options: {
          ...this.options,
          cacheDir: undefined,
          projectRoot: undefined,
          srcDir: undefined,
          outputDir: undefined
        }
      },
      statistics: {
        ...this.stats,
        duration: this.stats.endTime - this.stats.startTime,
        averageUnusedPercent: results.length > 0
          ? (results.reduce((sum, r) => sum + (r.unusedPercent || 0), 0) / results.length).toFixed(2)
          : 0
      },
      results: results.sort((a, b) => (b.unusedSize || 0) - (a.unusedSize || 0)),
      logs: this.logger.getLogs()
    }
    return report
  }

  generateMarkdownReport(results) {
    const stats = this.stats
    const duration = ((stats.endTime - stats.startTime) / 1000).toFixed(2)
    const totalUnusedKB = (stats.unusedSize / 1024).toFixed(2)
    const totalOriginalKB = (stats.totalSize / 1024).toFixed(2)
    const totalUnusedPercent = stats.totalSize > 0
      ? ((stats.unusedSize / stats.totalSize) * 100).toFixed(2)
      : 0

    let markdown = `# CSS 使用情况分析报告\n\n`
    markdown += `**生成时间**: ${new Date().toLocaleString('zh-CN')}\n`
    markdown += `**分析工具**: CSS Analyzer Enterprise Edition\n`
    markdown += `**项目**: AI坊学生管理系统\n\n`
    markdown += `## 📊 总体统计\n\n`
    markdown += `| 指标 | 数值 |\n`
    markdown += `|------|------|\n`
    markdown += `| 总CSS文件数 | ${stats.totalFiles} |\n`
    markdown += `| 成功分析 | ${stats.analyzedFiles} |\n`
    markdown += `| 分析失败 | ${stats.errorFiles} |\n`
    markdown += `| 总CSS大小 | ${totalOriginalKB} KB |\n`
    markdown += `| 未使用大小 | ${totalUnusedKB} KB |\n`
    markdown += `| 未使用比例 | ${totalUnusedPercent}% |\n`
    markdown += `| 分析耗时 | ${duration} 秒 |\n\n`

    const hasUnused = results.filter(r => r.status === 'has-unused' && (r.unusedSize || 0) > 0)
    if (hasUnused.length > 0) {
      markdown += `## ⚠️ 存在未使用CSS的文件 (${hasUnused.length}个)\n\n`
      markdown += `| 文件路径 | 原始大小 | 未使用大小 | 未使用比例 | 状态 |\n`
      markdown += `|---------|---------|-----------|-----------|------|\n`
      hasUnused.forEach(r => {
        const originalKB = (r.originalSize / 1024).toFixed(2)
        const unusedKB = (r.unusedSize / 1024).toFixed(2)
        markdown += `| \`${r.file}\` | ${originalKB} KB | ${unusedKB} KB | ${r.unusedPercent}% | ⚠️ |\n`
      })
      markdown += `\n`
    }

    const allUsed = results.filter(r => r.status === 'all-used')
    if (allUsed.length > 0) {
      markdown += `## ✅ 所有CSS都在使用中的文件 (${allUsed.length}个)\n\n`
      allUsed.forEach(r => {
        const originalKB = (r.originalSize / 1024).toFixed(2)
        markdown += `- \`${r.file}\` (${originalKB} KB)\n`
      })
      markdown += `\n`
    }

    const errors = results.filter(r => r.status === 'error')
    if (errors.length > 0) {
      markdown += `## ❌ 分析失败的文件 (${errors.length}个)\n\n`
      errors.forEach(r => {
        markdown += `- \`${r.file}\`: ${r.error}\n`
      })
      markdown += `\n`
    }

    markdown += `## 💡 优化建议\n\n`
    if (parseFloat(totalUnusedPercent) > 10) {
      markdown += `- ⚠️ 未使用CSS比例较高 (${totalUnusedPercent}%)，建议清理未使用的样式\n`
    } else if (parseFloat(totalUnusedPercent) > 5) {
      markdown += `- 💡 存在少量未使用的CSS (${totalUnusedPercent}%)，可以考虑清理\n`
    } else {
      markdown += `- ✅ CSS使用情况良好，未使用比例仅 ${totalUnusedPercent}%\n`
    }
    markdown += `- 📝 建议定期运行此工具，保持代码库整洁\n`
    markdown += `- 🔍 对于未使用的CSS，请确认是否为动态生成或第三方库所需后再删除\n\n`

    return markdown
  }

  generateHTMLReport(results) {
    const stats = this.stats
    const duration = ((stats.endTime - stats.startTime) / 1000).toFixed(2)
    const totalUnusedKB = (stats.unusedSize / 1024).toFixed(2)
    const totalOriginalKB = (stats.totalSize / 1024).toFixed(2)
    const totalUnusedPercent = stats.totalSize > 0
      ? ((stats.unusedSize / stats.totalSize) * 100).toFixed(2)
      : 0

    const hasUnused = results.filter(r => r.status === 'has-unused' && (r.unusedSize || 0) > 0)
    const allUsed = results.filter(r => r.status === 'all-used')
    const errors = results.filter(r => r.status === 'error')

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS 使用情况分析报告</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-bottom: 10px; }
    .meta { color: #666; margin-bottom: 30px; font-size: 14px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
    .stat-card h3 { font-size: 14px; opacity: 0.9; margin-bottom: 10px; }
    .stat-card .value { font-size: 32px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; font-weight: 600; color: #333; }
    .status-warning { color: #e6a23c; }
    .status-success { color: #67c23a; }
    .status-error { color: #f56c6c; }
    .file-path { font-family: 'Courier New', monospace; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>CSS 使用情况分析报告</h1>
    <div class="meta">
      <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
      <p>分析工具: CSS Analyzer Enterprise Edition</p>
      <p>项目: AI坊学生管理系统</p>
    </div>
    <div class="stats">
      <div class="stat-card">
        <h3>总CSS文件数</h3>
        <div class="value">${stats.totalFiles}</div>
      </div>
      <div class="stat-card">
        <h3>总CSS大小</h3>
        <div class="value">${totalOriginalKB} KB</div>
      </div>
      <div class="stat-card">
        <h3>未使用大小</h3>
        <div class="value">${totalUnusedKB} KB</div>
      </div>
      <div class="stat-card">
        <h3>未使用比例</h3>
        <div class="value">${totalUnusedPercent}%</div>
      </div>
      <div class="stat-card">
        <h3>分析耗时</h3>
        <div class="value">${duration}s</div>
      </div>
    </div>
    ${hasUnused.length > 0 ? `
    <h2>⚠️ 存在未使用CSS的文件 (${hasUnused.length}个)</h2>
    <table>
      <thead>
        <tr>
          <th>文件路径</th>
          <th>原始大小</th>
          <th>未使用大小</th>
          <th>未使用比例</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        ${hasUnused.map(r => `
        <tr>
          <td class="file-path">${r.file}</td>
          <td>${(r.originalSize / 1024).toFixed(2)} KB</td>
          <td>${(r.unusedSize / 1024).toFixed(2)} KB</td>
          <td>${r.unusedPercent}%</td>
          <td class="status-warning">⚠️</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    ` : ''}
    ${allUsed.length > 0 ? `
    <h2>✅ 所有CSS都在使用中的文件 (${allUsed.length}个)</h2>
    <ul>
      ${allUsed.map(r => `<li class="file-path">${r.file} (${(r.originalSize / 1024).toFixed(2)} KB)</li>`).join('')}
    </ul>
    ` : ''}
    ${errors.length > 0 ? `
    <h2>❌ 分析失败的文件 (${errors.length}个)</h2>
    <ul>
      ${errors.map(r => `<li class="file-path status-error">${r.file}: ${r.error}</li>`).join('')}
    </ul>
    ` : ''}
  </div>
</body>
</html>`
  }

  async analyze(options = {}) {
    this.stats.startTime = Date.now()
    this.ensureOutputDir()

    this.logger.info('开始CSS使用情况分析...')
    this.logger.info(`项目根目录: ${this.options.projectRoot}`)

    const contentFiles = this.getContentFiles()
    this.logger.info(`扫描了 ${contentFiles.length} 个内容文件`)

    const cssFiles = options.file
      ? [join(this.options.projectRoot, options.file)]
      : this.getAllCssFiles(this.options.srcDir)

    if (cssFiles.length === 0) {
      this.logger.warn('未找到CSS文件')
      return null
    }

    this.stats.totalFiles = cssFiles.length
    this.logger.info(`找到 ${cssFiles.length} 个CSS文件，开始分析...`)

    const results = await this.analyzeFiles(cssFiles, contentFiles)

    results.forEach(r => {
      if (r.originalSize) {
        this.stats.totalSize += r.originalSize
        this.stats.unusedSize += r.unusedSize || 0
        this.stats.usedSize += r.usedSize || 0
      }
    })

    this.stats.endTime = Date.now()

    const report = {
      json: this.generateJSONReport(results),
      markdown: this.generateMarkdownReport(results),
      html: this.generateHTMLReport(results)
    }

    this.options.formats.forEach(format => {
      if (report[format]) {
        const ext = format === 'json' ? 'json' : format === 'html' ? 'html' : 'md'
        const filename = `css-analysis-report.${ext}`
        const filepath = join(this.options.outputDir, filename)
        const content = format === 'json' ? JSON.stringify(report[format], null, 2) : report[format]
        writeFileSync(filepath, content, 'utf-8')
        this.logger.success(`报告已生成: ${filepath}`)
      }
    })

    this.logger.info(`\n分析完成！`)
    this.logger.info(`总文件数: ${this.stats.totalFiles}`)
    this.logger.info(`总大小: ${(this.stats.totalSize / 1024).toFixed(2)} KB`)
    this.logger.info(`未使用: ${(this.stats.unusedSize / 1024).toFixed(2)} KB`)
    this.logger.info(`耗时: ${((this.stats.endTime - this.stats.startTime) / 1000).toFixed(2)} 秒`)

    return report
  }
}

function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    file: null,
    all: false,
    formats: ['json', 'markdown'],
    debug: false,
    concurrency: 5,
    threshold: 0,
    cache: true
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--file' && args[i + 1]) {
      options.file = args[++i]
    } else if (arg === '--all') {
      options.all = true
    } else if (arg === '--formats' && args[i + 1]) {
      options.formats = args[++i].split(',').map(f => f.trim())
    } else if (arg === '--debug') {
      options.debug = true
    } else if (arg === '--concurrency' && args[i + 1]) {
      options.concurrency = parseInt(args[++i], 10)
    } else if (arg === '--threshold' && args[i + 1]) {
      options.threshold = parseFloat(args[++i])
    } else if (arg === '--no-cache') {
      options.cache = false
    } else if (arg === '--html') {
      if (!options.formats.includes('html')) {
        options.formats.push('html')
      }
    }
  }

  return options
}

const options = parseArgs()
const analyzer = new CSSAnalyzer(options)

analyzer.analyze(options).catch(error => {
  console.error('分析过程出错:', error)
  process.exit(1)
})

