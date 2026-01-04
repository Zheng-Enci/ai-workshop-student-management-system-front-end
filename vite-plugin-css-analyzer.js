import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
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

  return {
    name: 'css-analyzer',
    apply: 'serve',
    async buildStart() {
      // 如果启用了阻止模式，在启动时检查
      if (blockOnUnused) {
        const projectRoot = process.cwd()
        console.log('\n🔍 开发模式：检查未使用的 CSS...')
        
        try {
          const result = await performCSSAnalysis(projectRoot, 0, true)
          
          // 只检查有明确未使用选择器的文件（rejected 列表不为空）
          // rejected 列表为空的情况通常是伪类、变量、关键帧等，这些是可以接受的
          const criticalIssues = result.issues.filter(issue => 
            issue.rejected && issue.rejected.length > 0
          )
          
          if (criticalIssues.length > 0) {
            console.error('\n' + '='.repeat(80))
            console.error('❌ CSS 检查失败 - 开发服务器启动被阻止！')
            console.error('='.repeat(80))
            console.error(`\n发现 ${criticalIssues.length} 个文件包含未使用的 CSS 选择器\n`)
            
            criticalIssues.forEach((issue, index) => {
              console.error(`${index + 1}. 文件: ${issue.file}`)
              console.error(`   原始大小: ${issue.originalSize}`)
              console.error(`   未使用: ${issue.unusedSize} (${issue.unusedPercent}%)`)
              console.error(`   使用中: ${issue.usedSize}`)
              if (issue.rejected && issue.rejected.length > 0) {
                console.error(`   未使用的选择器数量: ${issue.rejected.length}`)
                const sampleSelectors = issue.rejected.slice(0, 5)
                if (sampleSelectors.length > 0) {
                  console.error(`   未使用的选择器示例:`)
                  sampleSelectors.forEach(selector => {
                    console.error(`     - ${selector}`)
                  })
                }
              }
              console.error('')
            })
            
            console.error('💡 解决方案:')
            console.error('   1. 删除未使用的 CSS 规则')
            console.error('   2. 或者确认这些 CSS 确实需要（动态生成、第三方库等）')
            console.error('   3. 如果确认需要，可以添加到安全列表配置中')
            console.error('   4. 运行 npm run analyze:css 查看完整详细报告\n')
            console.error('='.repeat(80) + '\n')
            
            throw new Error('存在未使用的 CSS，开发服务器启动被阻止')
          } else {
            const totalIssues = result.issues.length
            if (totalIssues > 0) {
              console.log(`⚠️  发现 ${totalIssues} 个文件有未使用的 CSS（可能是伪类、变量等），但无明确未使用的选择器`)
              console.log('✅ CSS 检查通过，开发服务器可以启动\n')
            } else {
              console.log('✅ CSS 检查通过，所有 CSS 都在使用中\n')
            }
          }
        } catch (error) {
          if (error.message.includes('存在未使用的 CSS')) {
            throw error
          }
          console.warn(`⚠️  CSS 检查过程出错: ${error.message}`)
          console.warn('   继续启动开发服务器...\n')
        }
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

