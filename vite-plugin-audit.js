import { execSync } from 'child_process'

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

	return {
		name: 'audit',
		apply: 'serve',
		async buildStart() {
			console.log('\n🔒 检查依赖安全漏洞...')
			
			try {
				const auditCommand = `npm audit --audit-level=${auditLevel} --json`
				const result = JSON.parse(
					execSync(auditCommand, {
						encoding: 'utf-8',
						stdio: 'pipe',
						cwd: process.cwd()
					})
				)

				if (result.vulnerabilities) {
					const totalVulns = result.metadata?.vulnerabilities?.total || 0
					const critical = result.metadata?.vulnerabilities?.critical || 0
					const high = result.metadata?.vulnerabilities?.high || 0
					const moderate = result.metadata?.vulnerabilities?.moderate || 0
					const low = result.metadata?.vulnerabilities?.low || 0

					if (totalVulns > 0) {
						console.log(`⚠️  发现 ${totalVulns} 个安全漏洞:`)
						if (critical > 0) console.log(`   🔴 严重: ${critical}`)
						if (high > 0) console.log(`   🟠 高危: ${high}`)
						if (moderate > 0) console.log(`   🟡 中等: ${moderate}`)
						if (low > 0) console.log(`   🟢 低危: ${low}`)
						console.log('\n💡 提示: 运行 npm run check:security:fix 尝试自动修复')
						console.log('   或运行 npm run check:security 查看详细信息')
					} else {
						console.log('✅ 未发现安全漏洞')
					}
				} else {
					console.log('✅ 未发现安全漏洞')
				}
			} catch (error) {
				const errorOutput = error.stdout || error.message || '未知错误'
				
				try {
					const errorJson = JSON.parse(errorOutput)
					if (errorJson.vulnerabilities) {
						const totalVulns = errorJson.metadata?.vulnerabilities?.total || 0
						const critical = errorJson.metadata?.vulnerabilities?.critical || 0
						const high = errorJson.metadata?.vulnerabilities?.high || 0
						const moderate = errorJson.metadata?.vulnerabilities?.moderate || 0
						const low = errorJson.metadata?.vulnerabilities?.low || 0

						if (totalVulns > 0) {
							console.log(`⚠️  发现 ${totalVulns} 个安全漏洞:`)
							if (critical > 0) console.log(`   🔴 严重: ${critical}`)
							if (high > 0) console.log(`   🟠 高危: ${high}`)
							if (moderate > 0) console.log(`   🟡 中等: ${moderate}`)
							if (low > 0) console.log(`   🟢 低危: ${low}`)
							console.log('\n💡 提示: 运行 npm run check:security:fix 尝试自动修复')
						}
					}
				} catch (parseError) {
					if (errorOutput.includes('npm ERR!')) {
						console.log('⚠️  安全漏洞检查失败，可能是网络问题或 npm 配置问题')
						console.log('💡 提示: 可以手动运行 npm run check:security 进行检查')
					} else {
						console.log('⚠️  安全漏洞检查失败:', errorOutput)
					}
				}
			}
			
			console.log('')
		}
	}
}

