module.exports = {
	'src/**/*.{js,vue}': [
		'eslint --config code-quality/code-quality-config/.eslintrc.js --fix',
		'prettier --config code-quality/code-quality-config/prettier.config.js --write'
	],
	'src/**/*.{css,scss}': [
		'stylelint --config code-quality/code-quality-config/.stylelintrc.js --fix',
		'prettier --config code-quality/code-quality-config/prettier.config.js --write'
	],
	'src/**/*.{json,md}': [
		'prettier --config code-quality/code-quality-config/prettier.config.js --write'
	]
}

