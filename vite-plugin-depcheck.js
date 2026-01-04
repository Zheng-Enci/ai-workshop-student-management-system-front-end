import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export function depcheckPlugin(options = {}) {
	const {
		enabled = process.env.NODE_ENV === 'development',
		configPath = '.depcheckrc.json',
		skipOnError = false
	} = options

	if (!enabled) {
		return {
			name: 'depcheck',
			apply: 'serve'
		}
	}

	return {
		name: 'depcheck',
		apply: 'serve',
		async buildStart() {
			console.log('\n🔍 检查未使用的依赖...')
			
			try {
				const configFile = resolve(process.cwd(), configPath)
				let depcheckCommand = 'npx depcheck'
				
				try {
					readFileSync(configFile)
					depcheckCommand += ` --config ${configPath}`
				} catch (error) {
					console.log('⚠️  未找到 depcheck 配置文件，使用默认配置')
				}

				const result = execSync(depcheckCommand, {
					encoding: 'utf-8',
					stdio: 'pipe',
					cwd: process.cwd()
				})

				if (result.trim()) {
					console.log('📦 依赖检查结果:')
					console.log(result)
				} else {
					console.log('✅ 未发现未使用的依赖')
				}
			} catch (error) {
				const errorMessage = error.stdout || error.message || '未知错误'
				
				if (errorMessage.includes('Unused dependencies') || 
				    errorMessage.includes('Unused devDependencies') ||
				    errorMessage.includes('Missing dependencies')) {
					console.log('⚠️  发现依赖问题:')
					console.log(errorMessage)
					
					if (!skipOnError) {
						console.log('\n💡 提示: 运行 npm run check:deps 查看详细信息')
					}
				} else {
					console.log('⚠️  Depcheck 检查失败:', errorMessage)
					
					if (!skipOnError) {
						console.log('💡 提示: 可以手动运行 npm run check:deps 进行检查')
					}
				}
			}
			
			console.log('')
		}
	}
}

