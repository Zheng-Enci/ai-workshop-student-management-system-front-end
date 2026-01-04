import { execSync } from 'child_process'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export function auditPlugin(options = {}) {
	const {
		enabled = process.env.NODE_ENV === 'development',
		auditLevel = 'moderate',
		skipOnError = false
	} = options

	if (!enabled) {
		return {
			name: 'audit',
			apply: 'serve'
		}
	}

	/**
	 * 生成 Markdown 格式的安全审计报告
	 * @param {Object} auditData - 审计数据
	 * @returns {string}
	 */
	function generateMarkdownReport(auditData) {
		const { totalVulns, critical, high, moderate, low, vulnerabilities } = auditData
		
		let report = `# 依赖安全审计报告\n\n`
		
		if (totalVulns > 0) {
			report += `## ⚠️ 发现安全漏洞\n\n`
			report += `| 严重程度 | 数量 |\n`
			report += `|---------|------|\n`
			if (critical > 0) report += `| 🔴 严重 | ${critical} |\n`
			if (high > 0) report += `| 🟠 高危 | ${high} |\n`
			if (moderate > 0) report += `| 🟡 中等 | ${moderate} |\n`
			if (low > 0) report += `| 🟢 低危 | ${low} |\n`
			report += `| **总计** | **${totalVulns}** |\n\n`

			// 列出漏洞详情
			if (vulnerabilities && Object.keys(vulnerabilities).length > 0) {
				report += `## 📋 漏洞详情\n\n`
				const vulnList = Object.values(vulnerabilities).slice(0, 20) // 最多显示20个
				
				vulnList.forEach((vuln, index) => {
					report += `### ${index + 1}. ${vuln.name || '未知漏洞'}\n\n`
					report += `- **严重程度**: ${vuln.severity || '未知'}\n`
					report += `- **影响范围**: ${vuln.via ? (Array.isArray(vuln.via) ? vuln.via.map(v => typeof v === 'string' ? v : v.title).join(', ') : vuln.via) : '未知'}\n`
					if (vuln.title) report += `- **描述**: ${vuln.title}\n`
					if (vuln.fixAvailable) {
						report += `- **修复建议**: ${vuln.fixAvailable === true ? '运行 npm audit fix' : vuln.fixAvailable}\n`
					}
					report += `\n`
				})

				if (Object.keys(vulnerabilities).length > 20) {
					report += `*还有 ${Object.keys(vulnerabilities).length - 20} 个漏洞未显示，请运行 \`npm audit\` 查看完整列表*\n\n`
				}
			}

			report += `## 💡 修复建议\n\n`
			report += `1. 运行 \`npm run check:security:fix\` 尝试自动修复\n`
			report += `2. 运行 \`npm run check:security\` 查看详细信息\n`
			report += `3. 手动更新有漏洞的依赖包到安全版本\n\n`
		} else {
			report += `## ✅ 检查结果\n\n`
			report += `未发现安全漏洞。\n\n`
		}

		report += `---\n\n`
		report += `*报告生成时间: ${new Date().toLocaleString('zh-CN')}*\n`

		return report
	}

	return {
		name: 'audit',
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

					const auditCommand = `npm audit --audit-level=${auditLevel} --json`
					let auditData = {
						totalVulns: 0,
						critical: 0,
						high: 0,
						moderate: 0,
						low: 0,
						vulnerabilities: {}
					}

					try {
						const result = JSON.parse(
							execSync(auditCommand, {
								encoding: 'utf-8',
								stdio: 'pipe',
								cwd: projectRoot
							})
						)

						if (result.vulnerabilities) {
							auditData.totalVulns = result.metadata?.vulnerabilities?.total || 0
							auditData.critical = result.metadata?.vulnerabilities?.critical || 0
							auditData.high = result.metadata?.vulnerabilities?.high || 0
							auditData.moderate = result.metadata?.vulnerabilities?.moderate || 0
							auditData.low = result.metadata?.vulnerabilities?.low || 0
							auditData.vulnerabilities = result.vulnerabilities || {}
						}
					} catch (error) {
						const errorOutput = error.stdout || error.message || '未知错误'
						
						try {
							const errorJson = JSON.parse(errorOutput)
							if (errorJson.vulnerabilities) {
								auditData.totalVulns = errorJson.metadata?.vulnerabilities?.total || 0
								auditData.critical = errorJson.metadata?.vulnerabilities?.critical || 0
								auditData.high = errorJson.metadata?.vulnerabilities?.high || 0
								auditData.moderate = errorJson.metadata?.vulnerabilities?.moderate || 0
								auditData.low = errorJson.metadata?.vulnerabilities?.low || 0
								auditData.vulnerabilities = errorJson.vulnerabilities || {}
							}
						} catch (parseError) {
							// 解析失败，使用默认数据
						}
					}

					// 生成并保存报告
					const markdownReport = generateMarkdownReport(auditData)
					const reportPath = join(reportsDir, 'security-audit-report.md')
					writeFileSync(reportPath, markdownReport, 'utf-8')

				} catch (error) {
					// 静默失败，不阻塞开发服务器
				}
			})
		}
	}
}

