module.exports = {
	// 基础格式化配置
	printWidth: 120,           // 每行最大字符数
	tabWidth: 4,              // 缩进空格数
	useTabs: true,            // 使用 tab 缩进（与你原配置保持一致）
	semi: true,               // 语句末尾加分号
	singleQuote: true,        // 使用单引号
	quoteProps: 'as-needed',  // 对象属性引号按需添加
	trailingComma: 'es5',     // 尾随逗号
	bracketSpacing: true,     // 对象花括号内空格
	bracketSameLine: false,   // 标签闭合括号换行
	arrowParens: 'avoid',     // 箭头函数参数括号
	
	// Vue 特定配置
	vueIndentScriptAndStyle: false,  // Vue 文件中 script 和 style 不额外缩进
	
	// CSS 特定配置
	singleAttributePerLine: false,   // HTML 属性不强制单行
	
	// 文件覆盖配置
	overrides: [
		{
			files: '*.vue',
			options: {
				parser: 'vue'
			}
		},
		{
			files: ['*.css', '*.scss', '*.sass'],
			options: {
				parser: 'css'
			}
		}
	]
}