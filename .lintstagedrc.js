module.exports = {
	'src/**/*.{js,vue}': [
		'eslint --fix',
		'prettier --write'
	],
	'src/**/*.{css,scss}': [
		'stylelint --fix',
		'prettier --write'
	],
	'src/**/*.{json,md}': [
		'prettier --write'
	]
}

