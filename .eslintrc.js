module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
		es2021: true
	},
	extends: [
		'plugin:vue/vue3-strongly-recommended',
		'eslint:recommended'
	],
	parserOptions: {
		parser: '@babel/eslint-parser',
		ecmaVersion: 2021,
		sourceType: 'module',
		requireConfigFile: false
	},
	rules: {
		// 代码格式规范
		'indent': ['error', 'tab', { 'SwitchCase': 1 }],
		'max-len': ['error', { 
			'code': 120, 
			'tabWidth': 4,
			'ignoreUrls': true,
			'ignoreStrings': true,
			'ignoreTemplateLiterals': true,
			'ignoreRegExpLiterals': true
		}],
		'semi': ['error', 'never'],
		'quotes': ['error', 'single', { 'avoidEscape': true }],
		'comma-dangle': ['error', 'never'],
		'no-trailing-spaces': 'error',
		'eol-last': ['error', 'always'],
		'object-curly-spacing': ['error', 'always'],
		'array-bracket-spacing': ['error', 'never'],
		'space-before-function-paren': ['error', 'always'],
		'keyword-spacing': ['error', { 'before': true, 'after': true }],
		'space-infix-ops': 'error',
		'comma-spacing': ['error', { 'before': false, 'after': true }],
		
		// 代码质量 - 全部设为 error
		'no-console': 'error', // 改为 error
		'no-debugger': 'error',
		'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }], // 改为 error
		'no-var': 'error',
		'prefer-const': 'error',
		'no-duplicate-imports': 'error',
		'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1 }],
		'prefer-template': 'error',
		'template-curly-spacing': ['error', 'never'],
		'arrow-spacing': ['error', { 'before': true, 'after': true }],
		'block-spacing': ['error', 'always'],
		'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
		'camelcase': ['error', { 'properties': 'never' }],
		'func-call-spacing': ['error', 'never'],
		'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
		'new-cap': ['error', { 'newIsCap': true, 'capIsNew': false }],
		'no-mixed-spaces-and-tabs': 'error',
		'no-multi-spaces': 'error',
		'padded-blocks': ['error', 'never'],
		'space-before-blocks': ['error', 'always'],
		'spaced-comment': ['error', 'always'],
		
		// Vue 特定规则
		'vue/html-indent': ['error', 'tab'],
		'vue/html-self-closing': ['error', {
			'html': { 'void': 'always', 'normal': 'always', 'component': 'always' },
			'svg': 'always',
			'math': 'always'
		}],
		'vue/max-attributes-per-line': ['error', {
			'singleline': { 'max': 3 },
			'multiline': { 'max': 1 }
		}],
		'vue/multiline-html-element-content-newline': 'error',
		'vue/singleline-html-element-content-newline': 'off',
		'vue/component-name-in-template-casing': ['error', 'kebab-case'],
		'vue/component-definition-name-casing': ['error', 'PascalCase'],
		'vue/prop-name-casing': ['error', 'camelCase'],
		'vue/attribute-hyphenation': ['error', 'always'],
		'vue/v-on-event-hyphenation': ['error', 'always'],
		'vue/no-v-html': 'error', // 改为 error
		'vue/require-default-prop': 'error',
		'vue/require-prop-types': 'error',
		'vue/order-in-components': ['error', {
			'order': [
				'el',
				'name',
				'key',
				'parent',
				'functional',
				['delimiters', 'comments'],
				['components', 'directives', 'filters'],
				'extends',
				'mixins',
				['provide', 'inject'],
				'ROUTER_GUARDS',
				'layout',
				'middleware',
				'validate',
				'scrollToTop',
				'transition',
				'loading',
				'inheritAttrs',
				'model',
				['props', 'propsData'],
				'emits',
				'setup',
				'asyncData',
				'data',
				'fetch',
				'head',
				'computed',
				'watch',
				'watchQuery',
				'LIFECYCLE_HOOKS',
				'methods',
				['template', 'render'],
				'renderError'
			]
		}],
		'vue/attributes-order': ['error', {
			'order': [
				'DEFINITION',
				'LIST_RENDERING',
				'CONDITIONALS',
				'RENDER_MODIFIERS',
				'GLOBAL',
				['UNIQUE', 'SLOT'],
				'TWO_WAY_BINDING',
				'OTHER_DIRECTIVES',
				'OTHER_ATTR',
				'EVENTS',
				'CONTENT'
			],
			'alphabetical': false
		}],
		'vue/no-multiple-template-root': 'off',
		'vue/script-setup-uses-vars': 'error',
		
		// 安全相关
		'no-eval': 'error',
		'no-implied-eval': 'error',
		'no-new-func': 'error',
		'no-script-url': 'error',
		
		// 最佳实践
		'eqeqeq': ['error', 'always'],
		'no-alert': 'error', // 改为 error
		'no-caller': 'error',
		'no-extend-native': 'error',
		'no-extra-bind': 'error',
		'no-floating-decimal': 'error',
		'no-implicit-coercion': 'error',
		'no-implicit-globals': 'error',
		'no-lone-blocks': 'error',
		'no-loop-func': 'error',
		'no-new': 'error',
		'no-new-wrappers': 'error',
		'no-octal-escape': 'error',
		'no-proto': 'error',
		'no-return-assign': 'error',
		'no-self-compare': 'error',
		'no-sequences': 'error',
		'no-throw-literal': 'error',
		'no-unmodified-loop-condition': 'error',
		'no-useless-call': 'error',
		'no-useless-concat': 'error',
		'no-void': 'error',
		'prefer-promise-reject-errors': 'error',
		'radix': 'error',
		'wrap-iife': ['error', 'any'],
		'yoda': 'error'
	}
}