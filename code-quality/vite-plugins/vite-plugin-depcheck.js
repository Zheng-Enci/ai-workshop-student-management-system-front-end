import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, join } from 'path'

export function depcheckPlugin(options = {}) {
	const {
		enabled = process.env.NODE_ENV === 'development',
		configPath = 'code-quality/code-quality-config/.depcheckrc.json',
		skipOnError = false
	} = options

	if (!enabled) {
		return {
			name: 'depcheck',
			apply: 'serve'
		}
	}

	// 解析 depcheck 输出，过滤掉已忽略的依赖
	function filterIgnoredDeps(output, configPath) {
		try {
			const configFile = resolve(process.cwd(), configPath)
			const config = JSON.parse(readFileSync(configFile, 'utf-8'))
			
			// 收集所有需要忽略的依赖
			const ignoredDeps = new Set()
			
			// 从 ignoreDeps 获取
			if (config.ignoreDeps && Array.isArray(config.ignoreDeps)) {
				config.ignoreDeps.forEach(dep => ignoredDeps.add(dep))
			}
			
			// 从 ignore 获取（兼容旧配置）
			if (config.ignore && Array.isArray(config.ignore)) {
				config.ignore.forEach(dep => ignoredDeps.add(dep))
			}
			
			// 从 ignoreMatches 获取匹配的依赖
			if (config.ignoreMatches && Array.isArray(config.ignoreMatches)) {
				const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'))
				const allDeps = [
					...Object.keys(packageJson.dependencies || {}),
					...Object.keys(packageJson.devDependencies || {})
				]
				
				config.ignoreMatches.forEach(pattern => {
					const regex = new RegExp(pattern.replace(/\*/g, '.*'))
					allDeps.forEach(dep => {
						if (regex.test(dep)) {
							ignoredDeps.add(dep)
						}
					})
				})
			}
			
			// 过滤输出
			let filteredOutput = output
			const lines = output.split('\n')
			const filteredLines = []
			let inUnusedSection = false
			let inDevDependenciesSection = false
			let hasRealUnused = false
			
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i]
				
				// 检测是否进入未使用依赖部分
				if (line.includes('Unused dependencies')) {
					inUnusedSection = true
					inDevDependenciesSection = false
					filteredLines.push(line)
					continue
				}
				
				if (line.includes('Unused devDependencies')) {
					inUnusedSection = true
					inDevDependenciesSection = true
					filteredLines.push(line)
					continue
				}
				
				// 如果是依赖列表行（以 * 开头）
				if (inUnusedSection && line.trim().startsWith('*')) {
					const depName = line.trim().substring(1).trim()
					// 检查是否在忽略列表中
					if (!ignoredDeps.has(depName)) {
						filteredLines.push(line)
						hasRealUnused = true
					}
					// 如果被忽略，跳过这一行
					continue
				}
				
				// 其他行直接添加
				filteredLines.push(line)
			}
			
			// 如果没有真正的未使用依赖，返回空或成功消息
			if (!hasRealUnused && inUnusedSection) {
				return null // 表示没有真正的未使用依赖
			}
			
			return filteredLines.join('\n')
		} catch (error) {
			// 如果解析失败，返回原始输出
			return output
		}
	}

	/**
	 * 生成 Markdown 格式的依赖检查报告
	 * @param {string|null} filteredResult - 过滤后的检查结果
	 * @param {boolean} hasIssues - 是否有问题
	 * @returns {string}
	 */
	function generateMarkdownReport(filteredResult, hasIssues) {
		let report = `# 依赖检查报告\n\n`
		
		if (hasIssues && filteredResult) {
			report += `## ⚠️ 发现依赖问题\n\n`
			report += `\`\`\`\n${filteredResult}\n\`\`\`\n\n`
			report += `## 💡 建议\n\n`
			report += `- 检查未使用的依赖是否可以移除\n`
			report += `- 检查缺失的依赖是否需要安装\n`
			report += `- 运行 \`npm run check:deps\` 查看详细信息\n\n`
		} else {
			report += `## ✅ 检查结果\n\n`
			report += `未发现未使用的依赖或缺失的依赖。\n\n`
		}

		report += `---\n\n`
		report += `*报告生成时间: ${new Date().toLocaleString('zh-CN')}*\n`

		return report
	}

	return {
		name: 'depcheck',
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

					const configFile = resolve(projectRoot, configPath)
					let depcheckCommand = 'npx depcheck'
					
					try {
						readFileSync(configFile)
						depcheckCommand += ` --config ${configPath}`
					} catch (error) {
						// 配置文件不存在，使用默认配置
					}

					let filteredResult = null
					let hasIssues = false

					try {
						const result = execSync(depcheckCommand, {
							encoding: 'utf-8',
							stdio: 'pipe',
							cwd: projectRoot
						})

						// 过滤已忽略的依赖
						filteredResult = filterIgnoredDeps(result, configPath)
						hasIssues = filteredResult && filteredResult.trim() ? true : false
					} catch (error) {
						const errorMessage = error.stdout || error.message || '未知错误'
						
						if (errorMessage.includes('Unused dependencies') || 
						    errorMessage.includes('Unused devDependencies') ||
						    errorMessage.includes('Missing dependencies')) {
							// 过滤已忽略的依赖
							filteredResult = filterIgnoredDeps(errorMessage, configPath)
							hasIssues = filteredResult && filteredResult.trim() ? true : false
						}
					}

					// 生成并保存报告
					const markdownReport = generateMarkdownReport(filteredResult, hasIssues)
					const reportPath = join(reportsDir, 'dependency-check-report.md')
					writeFileSync(reportPath, markdownReport, 'utf-8')

				} catch (error) {
					// 静默失败，不阻塞开发服务器
				}
			})
		}
	}
}

