import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'fs'
import { join, extname, relative } from 'path'

/**
 * 统计文件中的注释和代码行数
 * @param {string} filePath - 文件路径
 * @param {string} content - 文件内容
 * @returns {{codeLines: number, commentLines: number, totalLines: number}}
 */
function analyzeFileComments(filePath, content) {
	let codeLines = 0
	let commentLines = 0
	const lines = content.split('\n')
	let inBlockComment = false
	let inString = false
	let stringChar = null

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		const line = lines[lineIndex]
		const trimmedLine = line.trim()

		// 跳过空行
		if (trimmedLine === '') {
			continue
		}

		let lineHasCode = false
		let lineHasComment = false
		let charIndex = 0

		while (charIndex < line.length) {
			const char = line[charIndex]
			const nextChar = charIndex + 1 < line.length ? line[charIndex + 1] : null

			// 处理字符串
			if (!inString && (char === '"' || char === "'" || char === '`')) {
				inString = true
				stringChar = char
				charIndex++
				continue
			}

			if (inString) {
				if (char === stringChar && line[charIndex - 1] !== '\\') {
					inString = false
					stringChar = null
				}
				charIndex++
				continue
			}

			// 处理块注释
			if (!inBlockComment && char === '/' && nextChar === '*') {
				inBlockComment = true
				lineHasComment = true
				charIndex += 2
				continue
			}

			if (inBlockComment) {
				if (char === '*' && nextChar === '/') {
					inBlockComment = false
					charIndex += 2
					continue
				}
				charIndex++
				continue
			}

			// 处理行注释
			if (char === '/' && nextChar === '/') {
				lineHasComment = true
				// 检查注释前是否有代码
				const beforeComment = line.substring(0, charIndex).trim()
				if (beforeComment) {
					lineHasCode = true
				}
				break
			}

			// 非空白字符视为代码
			if (char !== ' ' && char !== '\t') {
				lineHasCode = true
			}

			charIndex++
		}

		// 如果整行都是块注释的一部分
		if (inBlockComment && !lineHasCode) {
			lineHasComment = true
		}

		if (lineHasCode) {
			codeLines++
		}
		if (lineHasComment) {
			commentLines++
		}
	}

	return {
		codeLines,
		commentLines,
		totalLines: lines.length
	}
}

/**
 * 递归获取所有需要分析的文件
 * @param {string} dir - 目录路径
 * @param {string[]} extensions - 文件扩展名列表
 * @param {string[]} excludeDirs - 排除的目录
 * @returns {string[]}
 */
function getAllFiles(dir, extensions = ['.js', '.vue'], excludeDirs = ['node_modules', 'dist', '.git']) {
	const files = []

	if (!existsSync(dir)) {
		return files
	}

	const scanDir = (currentDir) => {
		try {
			const entries = readdirSync(currentDir)

			for (const entry of entries) {
				const fullPath = join(currentDir, entry)

				try {
					const stat = statSync(fullPath)

					if (stat.isDirectory()) {
						// 检查是否在排除列表中
						if (!excludeDirs.some(exclude => fullPath.includes(exclude))) {
							scanDir(fullPath)
						}
					} else if (stat.isFile()) {
						const ext = extname(entry)
						if (extensions.includes(ext)) {
							files.push(fullPath)
						}
					}
				} catch (error) {
					// 忽略无法访问的文件/目录
				}
			}
		} catch (error) {
			// 忽略无法访问的目录
		}
	}

	scanDir(dir)
	return files
}

/**
 * 执行注释覆盖率分析
 * @param {string} projectRoot - 项目根目录
 * @param {Object} options - 配置选项
 * @returns {Object}
 */
function performCommentAnalysis(projectRoot, options = {}) {
	const {
		srcDir = 'src',
		extensions = ['.js', '.vue'],
		minCoverage = 0,
		showDetails = false
	} = options

	const srcPath = join(projectRoot, srcDir)

	if (!existsSync(srcPath)) {
		return {
			success: false,
			error: `源目录不存在: ${srcPath}`
		}
	}

	const files = getAllFiles(srcPath, extensions)

	if (files.length === 0) {
		return {
			success: false,
			error: '未找到需要分析的文件'
		}
	}

	let totalCodeLines = 0
	let totalCommentLines = 0
	let totalLines = 0
	const fileStats = []

	for (const filePath of files) {
		try {
			const content = readFileSync(filePath, 'utf-8')
			const stats = analyzeFileComments(filePath, content)

			totalCodeLines += stats.codeLines
			totalCommentLines += stats.commentLines
			totalLines += stats.totalLines

			if (showDetails || stats.codeLines > 0) {
				const coverage = stats.codeLines > 0
					? ((stats.commentLines / stats.codeLines) * 100).toFixed(2)
					: 0

				const fileExt = extname(filePath)
				fileStats.push({
					file: relative(projectRoot, filePath),
					extension: fileExt,
					codeLines: stats.codeLines,
					commentLines: stats.commentLines,
					totalLines: stats.totalLines,
					coverage: parseFloat(coverage)
				})
			}
		} catch (error) {
			// 忽略无法读取的文件
		}
	}

	const overallCoverage = totalCodeLines > 0
		? ((totalCommentLines / totalCodeLines) * 100).toFixed(2)
		: 0

	return {
		success: true,
		stats: {
			totalFiles: files.length,
			totalCodeLines,
			totalCommentLines,
			totalLines,
			coverage: parseFloat(overallCoverage),
			fileStats: fileStats.sort((a, b) => b.coverage - a.coverage)
		}
	}
}

/**
 * 获取文件的最低注释率要求
 * @param {string} fileExt - 文件扩展名
 * @param {Object} minCoverageByExtension - 按扩展名配置的最低注释率
 * @param {number} defaultMinCoverage - 默认最低注释率
 * @returns {number}
 */
function getMinCoverageForFile(fileExt, minCoverageByExtension = {}, defaultMinCoverage = 0) {
	if (minCoverageByExtension && typeof minCoverageByExtension === 'object') {
		return minCoverageByExtension[fileExt] !== undefined
			? minCoverageByExtension[fileExt]
			: defaultMinCoverage
	}
	return defaultMinCoverage
}

/**
 * 生成 Markdown 格式的报告
 * @param {Object} stats - 统计信息
 * @param {Object} options - 配置选项
 * @returns {string}
 */
function generateMarkdownReport(stats, options = {}) {
	const {
		warnThreshold = 10,
		minCoverage = 0,
		minCoverageByExtension = {}
	} = options
	const { coverage, totalFiles, totalCodeLines, totalCommentLines, fileStats } = stats

	// 🔥 新增：根据文件扩展名返回对应图标
	const getFileIcon = (extension) => {
		const iconMap = {
			'.js': '📘',
			'.vue': '💚',
			'.css': '🎨',
			'.scss': '🎨',
			'.ts': '🔷',
			'.tsx': '🔷',
			'.jsx': '📘',
			'.json': '⚙️',
			'.md': '📄',
			'.html': '🌐',
			'.xml': '📋'
		}
		return iconMap[extension] || '📄'
	}

	let report = `# 代码注释覆盖率报告\n\n`

	report += `## 📊 总体统计\n\n`
	report += `| 指标 | 数值 |\n`
	report += `|------|------|\n`
	report += `| 文件总数 | ${totalFiles} |\n`
	report += `| 代码行数 | ${totalCodeLines} |\n`
	report += `| 注释行数 | ${totalCommentLines} |\n`
	report += `| 总体注释率 | ${coverage}% |\n\n`

	// 状态评估 - 计算加权平均最低要求
	const fileTypeStats = {}
	fileStats.forEach(file => {
		const ext = file.extension || '.unknown'
		if (!fileTypeStats[ext]) {
			fileTypeStats[ext] = { totalCodeLines: 0, totalCommentLines: 0, count: 0 }
		}
		fileTypeStats[ext].totalCodeLines += file.codeLines
		fileTypeStats[ext].totalCommentLines += file.commentLines
		fileTypeStats[ext].count++
	})

	let weightedMinCoverage = 0
	let totalWeight = 0
	Object.keys(fileTypeStats).forEach(ext => {
		const typeStats = fileTypeStats[ext]
		const typeCoverage = typeStats.totalCodeLines > 0
			? (typeStats.totalCommentLines / typeStats.totalCodeLines) * 100
			: 0
		const typeMinCoverage = getMinCoverageForFile(ext, minCoverageByExtension, minCoverage)
		weightedMinCoverage += typeMinCoverage * typeStats.totalCodeLines
		totalWeight += typeStats.totalCodeLines
	})
	const avgMinCoverage = totalWeight > 0 ? (weightedMinCoverage / totalWeight).toFixed(1) : minCoverage

	report += `## 📈 状态评估\n\n`
	if (coverage < parseFloat(avgMinCoverage)) {
		report += `⚠️ **注释率未达到最低要求** (加权平均最低要求: ${avgMinCoverage}%, 当前: ${coverage}%)\n\n`
		report += `建议为代码添加更多注释以提高可维护性。\n\n`
	} else if (coverage < warnThreshold) {
		report += `⚠️ **注释率低于建议阈值** (建议: ${warnThreshold}%, 当前: ${coverage}%)\n\n`
		report += `虽然达到了最低要求，但建议进一步提高注释率。\n\n`
	} else {
		report += `✅ **注释率符合要求** (≥ ${avgMinCoverage}%)\n\n`
	}

	// 显示各文件类型的最低要求
	if (Object.keys(minCoverageByExtension).length > 0) {
		report += `### 📋 各文件类型最低要求\n\n`
		report += `| 文件类型 | 最低注释率要求 |\n`
		report += `|---------|--------------|\n`
		Object.keys(minCoverageByExtension).forEach(ext => {
			const extName = ext === '.js' ? 'JavaScript' : ext === '.vue' ? 'Vue' : ext === '.css' ? 'CSS' : ext === '.scss' ? 'SCSS' : ext
			report += `| ${extName} | ${minCoverageByExtension[ext]}% |\n`
		})
		report += `\n`
	}

	// 注释率较低的文件（低于最低要求）
	const lowCoverageFiles = fileStats
		.map(f => {
			const fileMinCoverage = getMinCoverageForFile(f.extension, minCoverageByExtension, minCoverage)
			return {
				...f,
				minCoverage: fileMinCoverage,
				belowMin: f.coverage < fileMinCoverage
			}
		})
		.filter(f => f.belowMin && f.codeLines > 50)
		.slice(0, 20)

	if (lowCoverageFiles.length > 0) {
		report += `## ⚠️ 注释率未达最低要求的文件 (需要关注)\n\n`
		report += `| 文件路径 | 代码行数 | 注释行数 | 注释率 | 最低要求 |\n`
		report += `|---------|---------|---------|--------|----------|\n`
		lowCoverageFiles.forEach(file => {
			const fileIcon = getFileIcon(file.extension)
			report += `| ${fileIcon} ${file.file} | ${file.codeLines} | ${file.commentLines} | ${file.coverage}% | ${file.minCoverage}% |\n`
		})
		report += `\n`
	}

	// 所有文件统计（按注释率排序）
	if (fileStats.length > 0) {
		report += `## 📋 文件详细统计\n\n`
		report += `| 文件路径 | 代码行数 | 注释行数 | 注释率 | 状态 |\n`
		report += `|---------|---------|---------|--------|------|\n`

		fileStats.forEach(file => {
			const fileMinCoverage = getMinCoverageForFile(file.extension, minCoverageByExtension, minCoverage)
			const status = file.coverage >= fileMinCoverage ? '✅' : '⚠️'
			const fileIcon = getFileIcon(file.extension)
			report += `| ${fileIcon} ${file.file} | ${file.codeLines} | ${file.commentLines} | ${file.coverage}% | ${status} |\n`
		})
		report += `\n`
	}

	report += `---\n\n`
	report += `*报告生成时间: ${new Date().toLocaleString('zh-CN')}*\n`

	return report
}

/**
 * Vite 插件：注释覆盖率检查
 * @param {Object} options - 配置选项
 * @returns {Object}
 */
export function commentCoveragePlugin(options = {}) {
	const {
		enabled = process.env.NODE_ENV === 'development',
		srcDir = 'src',
		extensions = ['.js', '.vue'],
		minCoverage = 0,
		minCoverageByExtension = {},
		warnThreshold = 10,
		showDetails = false,
		skipOnError = false
	} = options

	if (!enabled) {
		return {
			name: 'comment-coverage',
			apply: 'serve'
		}
	}

	return {
		name: 'comment-coverage',
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

					const result = performCommentAnalysis(projectRoot, {
						srcDir,
						extensions,
						minCoverage,
						minCoverageByExtension,
						showDetails: true // 生成报告时总是显示详细信息
					})

					if (!result.success) {
						return
					}

					const { stats } = result

					// 生成 Markdown 报告
					const markdownReport = generateMarkdownReport(stats, {
						warnThreshold,
						minCoverage,
						minCoverageByExtension
					})

					// 保存报告
					const reportPath = join(reportsDir, 'comment-coverage-report.md')
					writeFileSync(reportPath, markdownReport, 'utf-8')

				} catch (error) {
					// 静默失败，不阻塞开发服务器
				}
			})
		}
	}
}

