#!/usr/bin/env node

/**
 * 日志文件迁移脚本
 * 将 Note/更新日志/ 目录下的日志文件按年/月二级分类组织
 * 
 * 迁移规则：
 * - 2025-12-10.md -> 2025/12/2025-12-10.md
 * - 2026-1-2.md -> 2026/01/2026-1-2.md
 * - 2026-1-2-eslint修复.md -> 2026/01/2026-1-2-eslint修复.md
 */

import { readdirSync, statSync, mkdirSync, renameSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')
const LOGS_DIR = join(PROJECT_ROOT, 'Note', '更新日志')

/**
 * 从文件名中提取年份和月份
 * @param {string} filename - 文件名（不含路径）
 * @returns {{year: string, month: string, fullFilename: string} | null}
 */
function parseDateFromFilename(filename) {
	// 匹配日期格式：YYYY-MM-DD 或 YYYY-M-D
	// 例如：2025-12-10.md, 2026-1-2.md, 2026-1-2-eslint修复.md
	const dateMatch = filename.match(/^(\d{4})-(\d{1,2})-\d{1,2}(.*)\.md$/)
	
	if (!dateMatch) {
		return null
	}
	
	const [, year, month, suffix] = dateMatch
	
	// 月份补零（1 -> 01, 12 -> 12）
	const monthPadded = month.padStart(2, '0')
	
	return {
		year,
		month: monthPadded,
		fullFilename: filename
	}
}

/**
 * 确保目录存在，如果不存在则创建
 * @param {string} dirPath - 目录路径
 */
function ensureDir(dirPath) {
	if (!existsSync(dirPath)) {
		mkdirSync(dirPath, { recursive: true })
		console.log(`✓ 创建目录: ${dirPath}`)
	}
}

/**
 * 迁移日志文件
 */
function migrateLogs() {
	console.log('开始迁移日志文件...\n')
	
	// 读取日志目录下的所有文件
	const files = readdirSync(LOGS_DIR)
	const mdFiles = files.filter(file => {
		const filePath = join(LOGS_DIR, file)
		const stats = statSync(filePath)
		return stats.isFile() && file.endsWith('.md')
	})
	
	if (mdFiles.length === 0) {
		console.log('未找到需要迁移的日志文件')
		return
	}
	
	console.log(`找到 ${mdFiles.length} 个日志文件\n`)
	
	const migrationMap = new Map()
	const skippedFiles = []
	
	// 解析所有文件，构建迁移映射
	for (const file of mdFiles) {
		const dateInfo = parseDateFromFilename(file)
		
		if (!dateInfo) {
			skippedFiles.push(file)
			console.log(`⚠ 跳过无法解析的文件: ${file}`)
			continue
		}
		
		const { year, month, fullFilename } = dateInfo
		const targetDir = join(LOGS_DIR, year, month)
		const targetPath = join(targetDir, fullFilename)
		const sourcePath = join(LOGS_DIR, fullFilename)
		
		// 如果目标文件已存在，跳过
		if (existsSync(targetPath)) {
			console.log(`⚠ 目标文件已存在，跳过: ${fullFilename}`)
			continue
		}
		
		migrationMap.set(fullFilename, {
			source: sourcePath,
			target: targetPath,
			targetDir
		})
	}
	
	if (migrationMap.size === 0) {
		console.log('\n没有需要迁移的文件')
		return
	}
	
	console.log(`\n准备迁移 ${migrationMap.size} 个文件:\n`)
	
	// 显示迁移计划
	for (const [filename, { targetDir }] of migrationMap) {
		const relativePath = targetDir.replace(PROJECT_ROOT + '\\', '').replace(PROJECT_ROOT + '/', '')
		console.log(`  ${filename} -> ${relativePath}/${filename}`)
	}
	
	// 执行迁移
	console.log('\n开始执行迁移...\n')
	
	let successCount = 0
	let errorCount = 0
	
	for (const [filename, { source, target, targetDir }] of migrationMap) {
		try {
			// 确保目标目录存在
			ensureDir(targetDir)
			
			// 移动文件
			renameSync(source, target)
			console.log(`✓ 已迁移: ${filename}`)
			successCount++
		} catch (error) {
			console.error(`✗ 迁移失败: ${filename}`, error.message)
			errorCount++
		}
	}
	
	// 输出统计信息
	console.log('\n' + '='.repeat(50))
	console.log('迁移完成！')
	console.log(`成功: ${successCount} 个文件`)
	console.log(`失败: ${errorCount} 个文件`)
	if (skippedFiles.length > 0) {
		console.log(`跳过: ${skippedFiles.length} 个文件`)
	}
	console.log('='.repeat(50))
}

// 执行迁移
try {
	migrateLogs()
} catch (error) {
	console.error('迁移过程中发生错误:', error)
	process.exit(1)
}

