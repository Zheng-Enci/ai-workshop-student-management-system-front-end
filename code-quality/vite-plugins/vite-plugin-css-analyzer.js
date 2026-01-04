import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'fs'
import { join, extname } from 'path'

let isAnalyzing = false
let lastAnalysisTime = 0
const ANALYSIS_INTERVAL = 5 * 60 * 1000

// 执行 CSS 检查的通用函数
async function performCSSAnalysis(projectRoot, threshold = 0, checkAllFiles = false) {
  const { PurgeCSS } = await import('purgecss')
  const srcDir = join(projectRoot, 'src')

  const getContentFiles = () => {
    const contentFiles = []
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
                  !filePath.includes('.git')) {
                scanDir(filePath)
              }
            } else if (/\.(vue|js|jsx|ts|tsx|html)$/.test(file)) {
              contentFiles.push(filePath)
            }
          } catch (error) {
          }
        })
      } catch (error) {
      }
    }
    scanDir(srcDir)
    if (existsSync(join(projectRoot, 'index.html'))) {
      contentFiles.push(join(projectRoot, 'index.html'))
    }
    return contentFiles
  }

  const getAllCssFiles = (dir, fileList = []) => {
    try {
      const files = readdirSync(dir)
      files.forEach(file => {
        const filePath = join(dir, file)
        try {
          const stat = statSync(filePath)
          if (stat.isDirectory()) {
            if (!filePath.includes('node_modules') && 
                !filePath.includes('dist') && 
                !filePath.includes('.git')) {
              getAllCssFiles(filePath, fileList)
            }
          } else if (extname(file) === '.css' || extname(file) === '.scss') {
            fileList.push(filePath)
          }
        } catch (error) {
        }
      })
    } catch (error) {
    }
    return fileList
  }

  const contentFiles = getContentFiles()
  const cssFiles = getAllCssFiles(srcDir)
  const issues = []
  const filesToCheck = checkAllFiles ? cssFiles : cssFiles.slice(0, 10)

  for (const cssFile of filesToCheck) {
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
      const unusedPercent = originalSize > 0 ? ((unusedSize / originalSize) * 100) : 0

      if (unusedSize > 0 && unusedPercent > threshold) {
        const relativePath = cssFile.replace(projectRoot + '\\', '').replace(projectRoot + '/', '')
        const result = purgeCSSResult[0]
        issues.push({
          file: relativePath,
          unusedPercent: unusedPercent.toFixed(2),
          unusedSize: (unusedSize / 1024).toFixed(2) + ' KB',
          originalSize: (originalSize / 1024).toFixed(2) + ' KB',
          usedSize: (purgedSize / 1024).toFixed(2) + ' KB',
          rejected: result.rejected || result.rejectedCss || []
        })
      }
    } catch (error) {
    }
  }

  return {
    totalFiles: cssFiles.length,
    checkedFiles: filesToCheck.length,
    issues
  }
}

export function cssAnalyzerPlugin(options = {}) {
  const {
    enabled = process.env.CSS_ANALYZER_ENABLED === 'true',
    interval = ANALYSIS_INTERVAL,
    threshold = 20,
    blockOnUnused = false, // 新增：是否在发现未使用CSS时阻止运行
    onWarning = null
  } = options

  if (!enabled && !blockOnUnused) {
    return {
      name: 'css-analyzer',
      apply: 'serve'
    }
  }

  /**
   * 生成 Markdown 格式的 CSS 分析报告
   * @param {Object} result - 分析结果
   * @returns {string}
   */
  function generateMarkdownReport(result) {
    const { issues, totalFiles, checkedFiles } = result
    const criticalIssues = issues.filter(issue => 
      issue.rejected && issue.rejected.length > 0
    )

    let report = `# CSS 使用情况分析报告\n\n`
    
    report += `## 📊 总体统计\n\n`
    report += `| 指标 | 数值 |\n`
    report += `|------|------|\n`
    report += `| 总文件数 | ${totalFiles} |\n`
    report += `| 已检查文件数 | ${checkedFiles} |\n`
    report += `| 发现问题文件数 | ${issues.length} |\n`
    report += `| 严重问题文件数 | ${criticalIssues.length} |\n\n`

    if (criticalIssues.length > 0) {
      report += `## ⚠️ 严重问题（包含未使用的 CSS 选择器）\n\n`
      report += `发现 ${criticalIssues.length} 个文件包含明确未使用的 CSS 选择器。\n\n`
      
      criticalIssues.forEach((issue, index) => {
        report += `### ${index + 1}. ${issue.file}\n\n`
        report += `- **原始大小**: ${issue.originalSize}\n`
        report += `- **未使用**: ${issue.unusedSize} (${issue.unusedPercent}%)\n`
        report += `- **使用中**: ${issue.usedSize}\n`
        if (issue.rejected && issue.rejected.length > 0) {
          report += `- **未使用的选择器数量**: ${issue.rejected.length}\n\n`
          report += `**未使用的选择器示例**:\n\n`
          issue.rejected.slice(0, 10).forEach(selector => {
            report += `- \`${selector}\`\n`
          })
          if (issue.rejected.length > 10) {
            report += `\n*还有 ${issue.rejected.length - 10} 个未使用的选择器...*\n`
          }
        }
        report += `\n`
      })

      report += `## 💡 解决方案\n\n`
      report += `1. 删除未使用的 CSS 规则\n`
      report += `2. 或者确认这些 CSS 确实需要（动态生成、第三方库等）\n`
      report += `3. 如果确认需要，可以添加到安全列表配置中\n`
      report += `4. 运行 \`npm run analyze:css\` 查看完整详细报告\n\n`
    } else if (issues.length > 0) {
      report += `## ℹ️ 提示\n\n`
      report += `发现 ${issues.length} 个文件有未使用的 CSS（可能是伪类、变量、关键帧等），但无明确未使用的选择器。\n\n`
      report += `这些通常是可接受的，因为：\n`
      report += `- CSS 变量可能被 JavaScript 动态使用\n`
      report += `- 伪类选择器（如 \`:hover\`, \`:focus\`）在静态分析中可能被误判\n`
      report += `- 关键帧动画可能被动态添加的类使用\n\n`
    } else {
      report += `## ✅ 检查结果\n\n`
      report += `所有 CSS 都在使用中，未发现未使用的 CSS 选择器。\n\n`
    }

    report += `---\n\n`
    report += `*报告生成时间: ${new Date().toLocaleString('zh-CN')}*\n`

    return report
  }

  return {
    name: 'css-analyzer',
    apply: 'serve',
    async buildStart() {
      // 如果启用了阻止模式，在启动时检查
      if (blockOnUnused) {
        const projectRoot = process.cwd()
        
        try {
          const result = await performCSSAnalysis(projectRoot, 0, true)
          
          // 生成并保存报告
          const reportsDir = join(projectRoot, 'code-quality/code-quality-reports')
          if (!existsSync(reportsDir)) {
            mkdirSync(reportsDir, { recursive: true })
          }
          
          const markdownReport = generateMarkdownReport(result)
          const reportPath = join(reportsDir, 'css-analysis-report.md')
          writeFileSync(reportPath, markdownReport, 'utf-8')
          
          // 只检查有明确未使用选择器的文件（rejected 列表不为空）
          // rejected 列表为空的情况通常是伪类、变量、关键帧等，这些是可以接受的
          const criticalIssues = result.issues.filter(issue => 
            issue.rejected && issue.rejected.length > 0
          )
          
          if (criticalIssues.length > 0) {
            throw new Error('存在未使用的 CSS，开发服务器启动被阻止')
          }
        } catch (error) {
          if (error.message.includes('存在未使用的 CSS')) {
            throw error
          }
          // 其他错误静默处理
        }
      } else {
        // 即使不阻止，也生成报告
        setImmediate(async () => {
          try {
            const projectRoot = process.cwd()
            const reportsDir = join(projectRoot, 'code-quality/code-quality-reports')
            if (!existsSync(reportsDir)) {
              mkdirSync(reportsDir, { recursive: true })
            }
            
            const result = await performCSSAnalysis(projectRoot, threshold, false)
            const markdownReport = generateMarkdownReport(result)
            const reportPath = join(reportsDir, 'css-analysis-report.md')
            writeFileSync(reportPath, markdownReport, 'utf-8')
          } catch (error) {
            // 静默失败
          }
        })
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/__css_analyzer_check' && req.method === 'GET') {
          const now = Date.now()
          if (now - lastAnalysisTime < interval && !isAnalyzing) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ 
              message: '分析间隔未到，使用缓存结果',
              lastCheck: new Date(lastAnalysisTime).toISOString()
            }))
            return
          }

          if (isAnalyzing) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ 
              message: '正在分析中，请稍候...'
            }))
            return
          }

          isAnalyzing = true
          try {
            const projectRoot = server.config.root || process.cwd()
            const result = await performCSSAnalysis(projectRoot, threshold, false)

            lastAnalysisTime = Date.now()
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
              timestamp: new Date().toISOString(),
              totalFiles: result.totalFiles,
              checkedFiles: result.checkedFiles,
              issues: result.issues.length,
              details: result.issues
            }))
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: error.message }))
          } finally {
            isAnalyzing = false
          }
        } else {
          next()
        }
      })
    }
  }
}

