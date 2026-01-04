module.exports = {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-recess-order'
	],
	plugins: [
		'stylelint-declaration-block-no-ignored-properties',
		'stylelint-high-performance-animation'
	],
	overrides: [
		{
			files: ['**/*.vue'],
			customSyntax: 'postcss-html'
		},
		{
			files: ['**/*.scss', '**/*.sass'],
			customSyntax: 'postcss-scss'
		}
	],
	rules: {
		// ====================================
		// 代码质量规范（非格式化）
		// ====================================
		'color-no-invalid-hex': true,
		'font-family-no-duplicate-names': true,
		'function-calc-no-unspaced-operator': true,
		'function-linear-gradient-no-nonstandard-direction': true,
		'keyframe-declaration-no-important': true,
		'media-feature-name-no-unknown': true,
		'no-duplicate-at-import-rules': true,
		'no-duplicate-selectors': true,
		'no-empty-source': null,
		'no-invalid-double-slash-comments': true,
		'property-no-unknown': true,
		'selector-pseudo-class-no-unknown': [true, {
			ignorePseudoClasses: ['deep', 'slotted', 'global', 'v-deep', 'v-slotted', 'v-global']
		}],
		'selector-pseudo-element-no-unknown': true,
		'selector-type-no-unknown': true,
		'unit-no-unknown': true,

		// ====================================
		// 现代 CSS 最佳实践
		// ====================================
		'alpha-value-notation': 'number',
		'color-function-notation': 'modern',
		'color-hex-alpha': 'never',
		'hue-degree-notation': 'angle',
		'import-notation': 'string',
		'keyframe-selector-notation': 'percentage-unless-within-keyword-only-block',
		'length-zero-no-unit': true,
		'media-feature-range-notation': 'context',
		'selector-not-notation': 'complex',
		'selector-pseudo-element-colon-notation': 'double',

		// ====================================
		// 性能和质量规则
		// ====================================
		'shorthand-property-no-redundant-values': true,
		'declaration-block-no-redundant-longhand-properties': true,
		'declaration-block-no-shorthand-property-overrides': true,
		'selector-max-id': 0,
		'selector-max-universal': 1,
		'selector-max-type': 3,
		'selector-max-class': 4,
		'selector-max-attribute': 2,
		'selector-max-pseudo-class': 3,
		'selector-max-combinators': 3,
		'selector-max-compound-selectors': 4,
		'selector-max-specificity': '0,4,0',
		'max-nesting-depth': 3,
		'no-unknown-animations': true,

		// ====================================
		// 性能优化插件规则
		// ====================================
		'plugin/declaration-block-no-ignored-properties': true,
		'plugin/no-low-performance-animation-properties': true,

		// ====================================
		// 废弃语法检查
		// ====================================
		'declaration-property-value-no-unknown': true,

		// ====================================
		// 兼容性配置
		// ====================================
		'at-rule-no-unknown': [true, {
			'ignoreAtRules': ['tailwind', 'apply', 'variants', 'responsive', 'screen']
		}],

		// ====================================
		// 禁用浏览器前缀（使用 autoprefixer）
		// ====================================
		'value-no-vendor-prefix': true,
		'property-no-vendor-prefix': true,
		'selector-no-vendor-prefix': true,
		'media-feature-name-no-vendor-prefix': true,
		'at-rule-no-vendor-prefix': true,

		// ====================================
		// 命名规范（可选，根据团队需要调整）
		// ====================================
		'selector-class-pattern': null,
		'selector-id-pattern': null,
		'keyframes-name-pattern': null,
		'custom-property-pattern': null
	}
}