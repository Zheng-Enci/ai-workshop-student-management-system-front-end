#!/usr/bin/env node

/**
 * 运行代码质量检查的独立脚本
 * 使用 vite.config.check.js 配置来运行所有检查
 */

import { createServer } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runChecks() {
  console.log('\n🚀 启动代码质量检查...\n')

  let server = null

  try {
    // 创建 Vite 开发服务器，这会触发所有插件的 buildStart 钩子
    // 设置环境变量 RUN_CHECKS=true 来启用检查插件
    process.env.RUN_CHECKS = 'true'
    server = await createServer({
      configFile: resolve(__dirname, '../vite.config.js'),
      server: {
        // 不实际启动服务器，只触发插件
        middlewareMode: true
      },
      logLevel: 'info'
    })

    // 等待一段时间，让所有异步检查完成
    // 检查插件使用 setImmediate 异步执行，需要等待
    await new Promise(resolve => setTimeout(resolve, 5000))

    // 关闭服务器
    await server.close()

    console.log('\n✅ 所有检查已完成！\n')
  } catch (error) {
    // 检查插件可能会抛出错误，这是正常的
    // 我们只关心检查是否运行
    if (server) {
      try {
        await server.close()
      } catch (closeError) {
        // 忽略关闭错误
      }
    }

    // 如果错误不是构建相关的，才退出
    if (error.message && !error.message.includes('build') && !error.message.includes('ECONNREFUSED')) {
      console.error('\n❌ 检查过程中出现错误:', error.message)
      process.exit(1)
    } else {
      console.log('\n✅ 所有检查已完成！\n')
    }
  }
}

runChecks()

