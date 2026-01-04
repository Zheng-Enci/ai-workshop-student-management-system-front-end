import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'fs'
import { join, extname, relative, basename } from 'path'
import { createHash } from 'crypto'

let isAnalyzing = false
let cachedResults = null
let lastContentHash = null

/**
 * 获取内容文件的哈希值，用于检测文件变化
 */
function getContentHash(contentFiles) {
	const hash = createHash('md5')
	contentFiles.forEach(file => {
		try {
			const content = readFileSync(file, 'utf-8')
			const stat = statSync(file)
			hash.update(`${file}:${stat.mtimeMs}:${content.length}`)
		} catch (error) {
			// 忽略无法读取的文件
		}
	})
	return hash.digest('hex')
}

/**
 * 获取 CSS 文件的哈希值
 */
function getCssFileHash(cssFile) {
	try {
		const content = readFileSync(cssFile, 'utf-8')
		const stat = statSync(cssFile)
		return createHash('md5').update(`${cssFile}:${stat.mtimeMs}:${content.length}`).digest('hex')
	} catch (error) {
		return null
	}
}

/**
 * 获取缓存键
 */
function getCacheKey(cssFile, contentFiles) {
	const fileHash = getCssFileHash(cssFile)
	const contentHash = getContentHash(contentFiles)
	return `${basename(cssFile)}-${fileHash}-${contentHash}`
}

/**
 * 读取缓存结果
 */
function getCachedResult(cacheKey, cacheDir) {
	if (!cacheDir || !existsSync(cacheDir)) return null
	const cacheFile = join(cacheDir, `${cacheKey}.json`)
	if (existsSync(cacheFile)) {
		try {
			const cached = JSON.parse(readFileSync(cacheFile, 'utf-8'))
			// 缓存有效期 24 小时
			if (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
				return cached.data
			}
		} catch (error) {
			// 缓存读取失败，忽略
		}
	}
	return null
}

/**
 * 保存缓存结果
 */
function setCachedResult(cacheKey, data, cacheDir) {
	if (!cacheDir) return
	if (!existsSync(cacheDir)) {
		mkdirSync(cacheDir, { recursive: true })
	}
	const cacheFile = join(cacheDir, `${cacheKey}.json`)
	try {
		writeFileSync(cacheFile, JSON.stringify({
			timestamp: Date.now(),
			data
		}), 'utf-8')
	} catch (error) {
		// 缓存写入失败，忽略
	}
}

/**
 * 获取所有内容文件
 */
function getContentFiles(projectRoot, srcDir) {
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
					// 忽略无法访问的文件
				}
			})
		} catch (error) {
			// 忽略无法访问的目录
		}
	}
	scanDir(srcDir)
	if (existsSync(join(projectRoot, 'index.html'))) {
		contentFiles.push(join(projectRoot, 'index.html'))
	}
	return contentFiles
}

/**
 * 获取所有 CSS 文件
 */
function getAllCssFiles(dir, fileList = []) {
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
						getAllCssFiles(filePath, fileList)
					}
				} else if (extname(file) === '.css' || extname(file) === '.scss') {
					fileList.push(filePath)
				}
			} catch (error) {
				// 忽略无法访问的文件
			}
		})
	} catch (error) {
		// 忽略无法访问的目录
	}
	return fileList
}

/**
 * 分析单个 CSS 文件
 */
async function analyzeFile(cssFile, contentFiles, projectRoot, cacheDir, threshold) {
	const cacheKey = getCacheKey(cssFile, contentFiles)
	const cached = getCachedResult(cacheKey, cacheDir)
	if (cached) {
		return cached
	}

	try {
		const { PurgeCSS } = await import('purgecss')
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
					/^el-(button|input|select|table|dialog|message|notification|loading|popover|tooltip|dropdown|menu|form|form-item|card|tabs|tab-pane|pagination|date-picker|time-picker|upload|progress|tag|badge|alert|breadcrumb|steps|carousel|collapse|timeline|tree|transfer|cascader|color-picker|rate|slider|switch|radio|checkbox|divider|link|backtop|page-header|avatar|skeleton|empty|result|descriptions|statistic|anchor|affix|space|image|image-viewer|drawer|popconfirm|calendar)/,
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
		const unusedPercent = originalSize > 0 ? ((unusedSize / originalSize) * 100) : 0

		const result = {
			file: relative(projectRoot, cssFile),
			originalSize,
			purgedSize,
			unusedSize,
			unusedPercent: parseFloat(unusedPercent.toFixed(2)),
			usedSize: purgedSize,
			status: unusedSize > 0 && unusedPercent > threshold ? 'has-unused' : 'all-used',
			rejected: purgeCSSResult[0].rejected || purgeCSSResult[0].rejectedCss || [],
			timestamp: new Date().toISOString()
		}

		setCachedResult(cacheKey, result, cacheDir)
		return result
	} catch (error) {
		return {
			file: relative(projectRoot, cssFile),
			error: error.message,
			status: 'error',
			timestamp: new Date().toISOString()
		}
	}
}

/**
 * 执行完整的 CSS 分析
 */
async function performCSSAnalysis(projectRoot, threshold = 0, concurrency = 5, cacheDir) {
	const srcDir = join(projectRoot, 'src')
	const startTime = Date.now()

	// 获取内容文件和 CSS 文件
	const contentFiles = getContentFiles(projectRoot, srcDir)
	const cssFiles = getAllCssFiles(srcDir)

	if (cssFiles.length === 0) {
		return {
			totalFiles: 0,
			checkedFiles: 0,
			issues: [],
			stats: {
				totalSize: 0,
				unusedSize: 0,
				usedSize: 0,
				duration: 0
			}
		}
	}

	// 检查内容文件是否有变化
	const currentContentHash = getContentHash(contentFiles)
	if (cachedResults && lastContentHash === currentContentHash) {
		// 内容文件未变化，使用缓存结果
		return cachedResults
	}

	// 并发分析文件
	const results = []
	const chunks = []
	for (let i = 0; i < cssFiles.length; i += concurrency) {
		chunks.push(cssFiles.slice(i, i + concurrency))
	}

	for (const chunk of chunks) {
		const chunkResults = await Promise.all(
			chunk.map(file => analyzeFile(file, contentFiles, projectRoot, cacheDir, threshold))
		)
		results.push(...chunkResults)
	}

	// 计算统计信息
	const stats = {
		totalSize: results.reduce((sum, r) => sum + (r.originalSize || 0), 0),
		unusedSize: results.reduce((sum, r) => sum + (r.unusedSize || 0), 0),
		usedSize: results.reduce((sum, r) => sum + (r.usedSize || 0), 0),
		duration: ((Date.now() - startTime) / 1000).toFixed(2)
	}

	// 过滤出有问题的文件
	const issues = results.filter(r => 
		r.status === 'has-unused' && (r.unusedSize || 0) > 0
	)

	const analysisResult = {
		totalFiles: cssFiles.length,
		checkedFiles: results.length,
		issues,
		allResults: results,
		stats
	}

	// 缓存结果
	cachedResults = analysisResult
	lastContentHash = currentContentHash

	return analysisResult
}

/**
 * 生成详细的 Markdown 报告
 */
function generateMarkdownReport(result) {
	const { allResults, totalFiles, checkedFiles, stats } = result
	const { totalSize, unusedSize, usedSize, duration } = stats

	const totalUnusedKB = (unusedSize / 1024).toFixed(2)
	const totalOriginalKB = (totalSize / 1024).toFixed(2)
	const totalUnusedPercent = totalSize > 0
		? ((unusedSize / totalSize) * 100).toFixed(2)
		: 0

	const hasUnused = allResults.filter(r => r.status === 'has-unused' && (r.unusedSize || 0) > 0)
	const allUsed = allResults.filter(r => r.status === 'all-used')
	const errors = allResults.filter(r => r.status === 'error')
	const criticalIssues = hasUnused.filter(issue => 
		issue.rejected && issue.rejected.length > 0
	)

	let report = `# CSS 使用情况分析报告\n\n`
	report += `**生成时间**: ${new Date().toLocaleString('zh-CN')}\n`
	report += `**分析工具**: CSS Analyzer (Vite Plugin)\n\n`

	report += `## 📊 总体统计\n\n`
	report += `| 指标 | 数值 |\n`
	report += `|------|------|\n`
	report += `| 总CSS文件数 | ${totalFiles} |\n`
	report += `| 成功分析 | ${checkedFiles} |\n`
	report += `| 分析失败 | ${errors.length} |\n`
	report += `| 总CSS大小 | ${totalOriginalKB} KB |\n`
	report += `| 未使用大小 | ${totalUnusedKB} KB |\n`
	report += `| 未使用比例 | ${totalUnusedPercent}% |\n`
	report += `| 分析耗时 | ${duration} 秒 |\n\n`

	if (criticalIssues.length > 0) {
		report += `## ⚠️ 严重问题（包含未使用的 CSS 选择器）\n\n`
		report += `发现 ${criticalIssues.length} 个文件包含明确未使用的 CSS 选择器。\n\n`
		
		criticalIssues.forEach((issue, index) => {
			report += `### ${index + 1}. ${issue.file}\n\n`
			report += `- **原始大小**: ${(issue.originalSize / 1024).toFixed(2)} KB\n`
			report += `- **未使用**: ${(issue.unusedSize / 1024).toFixed(2)} KB (${issue.unusedPercent}%)\n`
			report += `- **使用中**: ${(issue.usedSize / 1024).toFixed(2)} KB\n`
			if (issue.rejected && issue.rejected.length > 0) {
				report += `- **未使用的选择器数量**: ${issue.rejected.length}\n\n`
				report += `**未使用的选择器列表**:\n\n`
				issue.rejected.forEach(selector => {
					report += `- \`${selector}\`\n`
				})
			}
			report += `\n`
		})
	}

	if (hasUnused.length > 0) {
		report += `## ⚠️ 存在未使用CSS的文件 (${hasUnused.length}个)\n\n`
		report += `| 文件路径 | 原始大小 | 未使用大小 | 未使用比例 | 状态 |\n`
		report += `|---------|---------|-----------|-----------|------|\n`
		hasUnused.forEach(r => {
			const originalKB = (r.originalSize / 1024).toFixed(2)
			const unusedKB = (r.unusedSize / 1024).toFixed(2)
			report += `| \`${r.file}\` | ${originalKB} KB | ${unusedKB} KB | ${r.unusedPercent}% | ⚠️ |\n`
		})
		report += `\n`
	}

	if (allUsed.length > 0) {
		report += `## ✅ 所有CSS都在使用中的文件 (${allUsed.length}个)\n\n`
		allUsed.forEach(r => {
			const originalKB = (r.originalSize / 1024).toFixed(2)
			report += `- \`${r.file}\` (${originalKB} KB)\n`
		})
		report += `\n`
	}

	if (errors.length > 0) {
		report += `## ❌ 分析失败的文件 (${errors.length}个)\n\n`
		errors.forEach(r => {
			report += `- \`${r.file}\`: ${r.error}\n`
		})
		report += `\n`
	}

	report += `## 💡 优化建议\n\n`
	if (parseFloat(totalUnusedPercent) > 10) {
		report += `- ⚠️ 未使用CSS比例较高 (${totalUnusedPercent}%)，建议清理未使用的样式\n`
	} else if (parseFloat(totalUnusedPercent) > 5) {
		report += `- 💡 存在少量未使用的CSS (${totalUnusedPercent}%)，可以考虑清理\n`
	} else {
		report += `- ✅ CSS使用情况良好，未使用比例仅 ${totalUnusedPercent}%\n`
	}
	report += `- 📝 建议定期检查，保持代码库整洁\n`
	report += `- 🔍 对于未使用的CSS，请确认是否为动态生成或第三方库所需后再删除\n\n`

	report += `---\n\n`
	report += `*报告生成时间: ${new Date().toLocaleString('zh-CN')}*\n`

	return report
}

export function cssAnalyzerPlugin(options = {}) {
	const {
		enabled = process.env.NODE_ENV === 'development',
		threshold = 0,
		concurrency = 5,
		cacheEnabled = true,
		blockOnUnused = false
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
				const cacheDir = cacheEnabled ? join(projectRoot, '.css-analysis', 'cache') : null
				
				try {
					const result = await performCSSAnalysis(projectRoot, 0, concurrency, cacheDir)
					
					// 生成并保存报告
					const reportsDir = join(projectRoot, 'code-quality/code-quality-reports')
					if (!existsSync(reportsDir)) {
						mkdirSync(reportsDir, { recursive: true })
					}
					
					const markdownReport = generateMarkdownReport(result)
					const reportPath = join(reportsDir, 'css-analysis-report.md')
					writeFileSync(reportPath, markdownReport, 'utf-8')
					
					// 只检查有明确未使用选择器的文件（rejected 列表不为空）
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
				// 异步执行，不阻塞开发服务器启动
				setImmediate(async () => {
					try {
						const projectRoot = process.cwd()
						const cacheDir = cacheEnabled ? join(projectRoot, '.css-analysis', 'cache') : null
						const reportsDir = join(projectRoot, 'code-quality/code-quality-reports')
						
						if (!existsSync(reportsDir)) {
							mkdirSync(reportsDir, { recursive: true })
						}
						
						const result = await performCSSAnalysis(projectRoot, threshold, concurrency, cacheDir)
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
						const cacheDir = cacheEnabled ? join(projectRoot, '.css-analysis', 'cache') : null
						const result = await performCSSAnalysis(projectRoot, threshold, concurrency, cacheDir)

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
