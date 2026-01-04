#!/usr/bin/env node

import { PurgeCSS } from 'purgecss'
import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')

class QuickCSSAnalyzer {
  constructor() {
    this.projectRoot = PROJECT_ROOT
    this.srcDir = join(PROJECT_ROOT, 'src')
    this.threshold = 0
    this.strictMode = true
  }

  getContentFiles() {
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
                  !filePath.includes('.git') &&
                  !filePath.includes('.css-analysis')) {
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
    scanDir(this.srcDir)
    if (existsSync(join(this.projectRoot, 'index.html'))) {
      contentFiles.push(join(this.projectRoot, 'index.html'))
    }
    return contentFiles
  }

  async quickCheck() {
    try {
      const cssFiles = []
      const scanCss = (dir) => {
        try {
          if (!existsSync(dir)) return
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
                  scanCss(filePath)
                }
              } else if (extname(file) === '.css' || extname(file) === '.scss') {
                cssFiles.push(filePath)
              }
            } catch (error) {
            }
          })
        } catch (error) {
        }
      }
      scanCss(this.srcDir)

      if (cssFiles.length === 0) {
        return { passed: true, message: '未找到CSS文件' }
      }

      const contentFiles = this.getContentFiles()
      let hasUnused = false
      const issues = []

      console.log(`\n🔍 开始严格检查 ${cssFiles.length} 个CSS文件...`)
      console.log(`📋 检查标准: 不允许存在任何未使用的CSS (阈值: ${this.threshold}%)\n`)

      for (const cssFile of cssFiles) {
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

          if (unusedSize > 0) {
            hasUnused = true
            const relativePath = cssFile.replace(this.projectRoot + '\\', '').replace(this.projectRoot + '/', '')
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

      if (hasUnused) {
        return {
          passed: false,
          message: `❌ 发现 ${issues.length} 个文件包含未使用的CSS，构建被阻止！`,
          issues
        }
      }

      return { passed: true, message: '✅ 所有CSS都在使用中，检查通过' }
    } catch (error) {
      return { 
        passed: false, 
        message: `检查过程出错: ${error.message}`,
        error: error.message
      }
    }
  }
}

const analyzer = new QuickCSSAnalyzer()
const result = await analyzer.quickCheck()

if (!result.passed) {
  console.error('\n' + '='.repeat(80))
  console.error('❌ CSS严格检查失败 - 构建被阻止！')
  console.error('='.repeat(80))
  console.error(`\n${result.message}\n`)
  
  if (result.issues && result.issues.length > 0) {
    console.error('📋 发现未使用CSS的文件详情:\n')
    result.issues.forEach((issue, index) => {
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
  }
  
  if (result.error) {
    console.error(`\n错误信息: ${result.error}\n`)
  }
  
  console.error('💡 解决方案:')
  console.error('   1. 删除未使用的CSS规则')
  console.error('   2. 或者确认这些CSS确实需要（动态生成、第三方库等）')
  console.error('   3. 如果确认需要，可以添加到安全列表配置中')
  console.error('   4. 运行 npm run analyze:css 查看完整详细报告\n')
  console.error('='.repeat(80) + '\n')
  
  process.exit(1)
} else {
  console.log('\n' + '='.repeat(80))
  console.log('✅ CSS严格检查通过')
  console.log('='.repeat(80))
  console.log(`\n${result.message}\n`)
  console.log('所有CSS都在使用中，可以继续构建。\n')
}

