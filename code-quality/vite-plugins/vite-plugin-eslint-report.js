import { execSync } from 'child_process'
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs'
import { join, resolve, relative } from 'path'

/**
 * 生成 Markdown 格式的 ESLint 报告
 * @param {Object} eslintData - ESLint 检查结果数据
 * @param {Object} options - 配置选项
 * @returns {string}
 */
function generateMarkdownReport(eslintData, options = {}) {
	const { 
		totalFiles = 0,
		totalErrors = 0,
		totalWarnings = 0,
		files = [],
		summary = {}
	} = eslintData

	let report = `# ESLint 代码规范检查报告\n\n`
	
	report += `## 📊 总体统计\n\n`
	report += `| 指标 | 数值 |\n`
	report += `|------|------|\n`
	report += `| 检查文件数 | ${totalFiles} |\n`
	report += `| 错误总数 | ${totalErrors} |\n`
	report += `| 警告总数 | ${totalWarnings} |\n`
	report += `| 问题总数 | ${totalErrors + totalWarnings} |\n\n`

	// 状态评估
	report += `## 📈 状态评估\n\n`
	if (totalErrors > 0) {
		report += `❌ **发现 ${totalErrors} 个错误**，需要立即修复。\n\n`
	} else if (totalWarnings > 0) {
		report += `⚠️ **发现 ${totalWarnings} 个警告**，建议修复。\n\n`
	} else {
		report += `✅ **代码规范检查通过**，未发现错误或警告。\n\n`
	}

	// 按文件类型统计
	if (summary.byExtension && Object.keys(summary.byExtension).length > 0) {
		report += `## 📋 按文件类型统计\n\n`
		report += `| 文件类型 | 文件数 | 错误 | 警告 |\n`
		report += `|---------|--------|------|------|\n`
		
		Object.entries(summary.byExtension).forEach(([ext, stats]) => {
			const extName = ext === '.js' ? 'JavaScript' : ext === '.vue' ? 'Vue' : ext
			report += `| ${extName} | ${stats.files} | ${stats.errors} | ${stats.warnings} |\n`
		})
		report += `\n`
	}

	// 有问题的文件列表
	const filesWithIssues = files.filter(f => f.errors > 0 || f.warnings > 0)
	
	if (filesWithIssues.length > 0) {
		report += `## ⚠️ 有问题的文件\n\n`
		report += `| 文件路径 | 错误数 | 警告数 | 状态 |\n`
		report += `|---------|--------|--------|------|\n`
		
		// 按问题数量排序，显示所有文件
		filesWithIssues
			.sort((a, b) => (b.errors + b.warnings) - (a.errors + a.warnings))
			.forEach(file => {
				const status = file.errors > 0 ? '❌' : '⚠️'
				report += `| ${file.filePath} | ${file.errors} | ${file.warnings} | ${status} |\n`
			})
		
		report += `\n`
	}

	// 详细问题列表（所有文件）
	const sortedFiles = filesWithIssues
		.sort((a, b) => (b.errors + b.warnings) - (a.errors + a.warnings))

	if (sortedFiles.length > 0) {
		report += `## 📝 详细问题列表\n\n`
		
		sortedFiles.forEach((file, index) => {
			report += `### ${index + 1}. ${file.filePath}\n\n`
			
			if (file.messages && file.messages.length > 0) {
				report += `| 行号 | 列号 | 严重程度 | 规则 | 消息 |\n`
				report += `|------|------|----------|------|------|\n`
				
				// 显示所有问题
				file.messages.forEach(msg => {
					const severity = msg.severity === 2 ? '❌ 错误' : '⚠️ 警告'
					const rule = msg.ruleId || '未知规则'
					const message = (msg.message || '').replace(/\|/g, '\\|')
					report += `| ${msg.line || '-'} | ${msg.column || '-'} | ${severity} | ${rule} | ${message} |\n`
				})
			}
			
			report += `\n`
		})
	}

	// 修复建议
	if (totalErrors > 0 || totalWarnings > 0) {
		report += `## 💡 修复建议\n\n`
		report += `1. 运行 \`npm run lint:fix\` 自动修复可修复的问题\n`
		report += `2. 运行 \`npm run lint\` 查看所有问题详情\n`
		report += `3. 手动修复无法自动修复的问题\n\n`
	}

	report += `---\n\n`
	report += `*报告生成时间: ${new Date().toLocaleString('zh-CN')}*\n`

	return report
}

/**
 * 解析 ESLint JSON 输出
 * @param {string} jsonOutput - ESLint JSON 输出
 * @param {string} projectRoot - 项目根目录
 * @returns {Object}
 */
function parseEslintResults(jsonOutput, projectRoot) {
	try {
		const results = JSON.parse(jsonOutput)
		
		let totalFiles = 0
		let totalErrors = 0
		let totalWarnings = 0
		const files = []
		const byExtension = {}

		results.forEach(result => {
			if (!result.filePath) return
			
			const filePath = relative(projectRoot, result.filePath)
			const ext = filePath.substring(filePath.lastIndexOf('.')) || '.unknown'
			const errors = result.errorCount || 0
			const warnings = result.warningCount || 0
			
			totalFiles++
			totalErrors += errors
			totalWarnings += warnings

			// 统计按文件类型
			if (!byExtension[ext]) {
				byExtension[ext] = { files: 0, errors: 0, warnings: 0 }
			}
			byExtension[ext].files++
			byExtension[ext].errors += errors
			byExtension[ext].warnings += warnings

			// 只记录有问题的文件
			if (errors > 0 || warnings > 0) {
				files.push({
					filePath,
					errors,
					warnings,
					messages: result.messages || []
				})
			}
		})

		return {
			totalFiles,
			totalErrors,
			totalWarnings,
			files,
			summary: {
				byExtension
			}
		}
	} catch (error) {
		return {
			totalFiles: 0,
			totalErrors: 0,
			totalWarnings: 0,
			files: [],
			summary: { byExtension: {} }
		}
	}
}

/**
 * Vite 插件：ESLint 报告生成
 * @param {Object} options - 配置选项
 * @returns {Object}
 */
export function eslintReportPlugin(options = {}) {
	const {
		enabled = process.env.NODE_ENV === 'development',
		configFile = 'code-quality/code-quality-config/.eslintrc.js',
		ignorePath = 'code-quality/code-quality-config/.eslintignore',
		include = ['src/**/*.{js,vue}'],
		exclude = ['node_modules', 'dist'],
		skipOnError = true
	} = options

	if (!enabled) {
		return {
			name: 'eslint-report',
			apply: 'serve'
		}
	}

	return {
		name: 'eslint-report',
		apply: 'serve',
		async buildStart() {
			// 异步执行，不阻塞开发服务器启动
			setImmediate(async () => {
				try {
					const projectRoot = process.cwd()
					const reportsDir = join(projectRoot, 'code-quality/code-quality-reports')
					
					// 确保报告目录存在
					if (!existsSync(reportsDir)) {
						mkdirSync(reportsDir, { recursive: true })
					}

					// 构建 ESLint 命令
					const configFileFullPath = resolve(projectRoot, configFile)
					const ignorePathFullPath = resolve(projectRoot, ignorePath)
					
					let eslintCommand = 'npx eslint'
					
					// 添加配置文件
					if (existsSync(configFileFullPath)) {
						eslintCommand += ` --config ${configFile}`
					}
					
					// 添加忽略文件
					if (existsSync(ignorePathFullPath)) {
						eslintCommand += ` --ignore-path ${ignorePath}`
					}
					
					// 添加文件模式
					const filePatterns = include.join(' ')
					eslintCommand += ` ${filePatterns}`
					
					// 使用 JSON 格式输出
					eslintCommand += ' --format json'
					
					// 不自动修复（只检查）
					eslintCommand += ' --no-fix'

					let eslintData = {
						totalFiles: 0,
						totalErrors: 0,
						totalWarnings: 0,
						files: [],
						summary: { byExtension: {} }
					}

					try {
						const result = execSync(eslintCommand, {
							encoding: 'utf-8',
							stdio: 'pipe',
							cwd: projectRoot,
							maxBuffer: 10 * 1024 * 1024 // 10MB buffer
						})

						// 解析结果
						eslintData = parseEslintResults(result, projectRoot)
					} catch (error) {
						// ESLint 在发现错误时会返回非零退出码
						// 但输出仍然包含 JSON 格式的结果
						const errorOutput = error.stdout || error.message || ''
						
						if (errorOutput.trim()) {
							try {
								eslintData = parseEslintResults(errorOutput, projectRoot)
							} catch (parseError) {
								// 如果解析失败，创建一个错误报告
								eslintData = {
									totalFiles: 0,
									totalErrors: 1,
									totalWarnings: 0,
									files: [],
									summary: { byExtension: {} },
									error: '无法解析 ESLint 输出'
								}
							}
						}
					}

					// 生成并保存报告
					const markdownReport = generateMarkdownReport(eslintData, options)
					const reportPath = join(reportsDir, 'eslint-report.md')
					writeFileSync(reportPath, markdownReport, 'utf-8')

				} catch (error) {
					// 静默失败，不阻塞开发服务器
					if (!skipOnError) {
						console.error('ESLint 报告生成失败:', error.message)
					}
				}
			})
		}
	}
}

