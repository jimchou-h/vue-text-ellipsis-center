const { execSync } = require('child_process')
const fs = require('fs-extra')
const path = require('path')

/**
 * 构建脚本 - 执行项目构建和示例构建
 * 逻辑：
 * 1. 执行 npm run build (主包构建)
 * 2. 执行 npm run example-build (示例构建) 
 * 3. 将主包的 dist 内容复制到示例的 dist 中
 */

async function main() {
  console.log('🚀 开始构建流程...')
  
  try {
    // 步骤1: 构建主包
    console.log('📦 构建主包...')
    execSync('vite build', { stdio: 'inherit' })
    
    // 步骤2: 构建示例
    console.log('📋 构建示例...')
    execSync('pnpm --filter vue-text-ellipsis-center-examples run build', { stdio: 'inherit' })
    
    // 步骤3: 复制主包 dist 到示例 dist
    console.log('📁 复制文件...')
    
    const mainDistPath = path.join(__dirname, '..', 'dist')
    const examplesDistPath = path.join(__dirname, '..', 'examples', 'dist')
    
    // 检查目录是否存在
    if (!fs.existsSync(mainDistPath)) {
      throw new Error(`主包 dist 目录不存在: ${mainDistPath}`)
    }
    
    if (!fs.existsSync(examplesDistPath)) {
      throw new Error(`示例 dist 目录不存在: ${examplesDistPath}`)
    }
    
    // 复制主包 dist 中的所有文件到示例 dist
    await fs.copy(mainDistPath, examplesDistPath, {
      overwrite: true,
      errorOnExist: false
    })
    
    console.log('✅ 构建完成！')
    console.log(`📂 主包构建文件已复制到: ${examplesDistPath}`)
    
  } catch (error) {
    console.error('❌ 构建失败:', error.message)
    process.exit(1)
  }
}

// 运行构建流程
main()