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
		// ====================================
		// 代码格式规范
		// ====================================
		'indent': ['error', 'tab', { 'SwitchCase': 1 }],
		'max-len': ['error', {
			'code': 120,
			'tabWidth': 4,
			'ignoreUrls': true,
			'ignoreStrings': true,
			'ignoreTemplateLiterals': true,
			'ignoreRegExpLiterals': true,
			'ignoreComments': true
		}],
		'semi': ['error', 'never'],
		'quotes': ['error', 'single', { 'avoidEscape': true }],
		'comma-dangle': ['error', 'never'],
		'no-trailing-spaces': 'error',
		'eol-last': ['error', 'always'],
		'object-curly-spacing': ['error', 'always'],
		'array-bracket-spacing': ['error', 'never'],
		'space-before-function-paren': ['error', {
			'anonymous': 'always',
			'named': 'never',
			'asyncArrow': 'always'
		}],
		'keyword-spacing': ['error', { 'before': true, 'after': true }],
		'space-infix-ops': 'error',
		'comma-spacing': ['error', { 'before': false, 'after': true }],
		'quote-props': ['error', 'as-needed'],

		// ====================================
		// 代码质量 - 核心规则
		// ====================================
		'no-console': ['warn', { 'allow': ['warn', 'error'] }],
		'no-debugger': 'error',
		'no-unused-vars': ['error', {
			'argsIgnorePattern': '^_',
			'varsIgnorePattern': '^_',
			'caughtErrorsIgnorePattern': '^_'
		}],
		'no-var': 'error',
		'prefer-const': ['error', { 'destructuring': 'all' }],
		'no-duplicate-imports': 'error',
		'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1 }],
		'prefer-template': 'error',
		'template-curly-spacing': ['error', 'never'],
		'arrow-spacing': ['error', { 'before': true, 'after': true }],
		'block-spacing': ['error', 'always'],
		'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
		'camelcase': ['error', {
			'properties': 'never',
			'ignoreDestructuring': false
		}],
		'func-call-spacing': ['error', 'never'],
		'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
		'new-cap': ['error', { 'newIsCap': true, 'capIsNew': false }],
		'no-mixed-spaces-and-tabs': 'error',
		'no-multi-spaces': 'error',
		'padded-blocks': ['error', 'never'],
		'space-before-blocks': ['error', 'always'],
		'spaced-comment': ['error', 'always', {
			'markers': ['/'],
			'exceptions': ['-']
		}],

		// ====================================
		// 代码质量 - 高级规则
		// ====================================
		'no-shadow': 'error',
		'no-use-before-define': ['error', {
			'functions': false,
			'classes': true,
			'variables': true
		}],
		'no-param-reassign': ['error', {
			'props': true,
			'ignorePropertyModificationsFor': ['state', 'acc', 'e', 'ctx', 'req', 'res', 'config']
		}],
		'no-return-await': 'error',
		'require-await': 'error',
		'no-await-in-loop': 'warn',
		'prefer-arrow-callback': 'error',
		'prefer-rest-params': 'error',
		'prefer-spread': 'error',
		'no-unneeded-ternary': 'error',
		'no-nested-ternary': 'error',
		'no-lonely-if': 'error',
		'no-else-return': ['error', { 'allowElseIf': false }],
		'no-unreachable-loop': 'error',
		'complexity': ['warn', 15],
		'max-depth': ['warn', 4],
		'max-params': ['warn', 5],
		'max-statements-per-line': ['error', { 'max': 1 }],
		'no-useless-rename': 'error',
		'object-shorthand': ['error', 'always'],
		'dot-notation': ['error', { 'allowKeywords': true }],
		'no-bitwise': 'warn',
		'no-new-object': 'error',
		'no-array-constructor': 'error',

		// ====================================
		// Import 规范
		// ====================================
		'import/order': ['error', {
			'groups': [
				'builtin',
				'external',
				'internal',
				'parent',
				'sibling',
				'index'
			],
			'newlines-between': 'always',
			'alphabetize': {
				'order': 'asc',
				'caseInsensitive': true
			}
		}],

		// ====================================
		// Vue 特定规则
		// ====================================
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
		'vue/no-v-html': 'warn',
		'vue/require-default-prop': 'error',
		'vue/require-prop-types': 'error',
		'vue/require-explicit-emits': 'error',
		'vue/no-unused-vars': 'error',
		'vue/no-mutating-props': 'error',
		'vue/no-dupe-keys': 'error',
		'vue/no-dupe-v-else-if': 'error',
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
		'vue/component-tags-order': ['error', {
			'order': ['script', 'template', 'style']
		}],
		'vue/no-v-text-v-html-on-component': 'error',

		// ====================================
		// 安全相关
		// ====================================
		'no-eval': 'error',
		'no-implied-eval': 'error',
		'no-new-func': 'error',
		'no-script-url': 'error',

		// ====================================
		// 最佳实践
		// ====================================
		'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
		'no-alert': 'warn',
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
		'yoda': 'error',
		'curly': ['error', 'all'],
		'no-empty': ['error', { 'allowEmptyCatch': true }],
		'no-empty-function': 'warn',
		'no-constant-condition': 'error',
		'no-ex-assign': 'error',
		'no-fallthrough': ['error', { 'commentPattern': 'falls?\\s?through' }],
		'no-inline-comments': 'off',
		'no-inner-declarations': 'error',
		'no-invalid-this': 'error',
		'no-iterator': 'error',
		'no-labels': 'error',
		'no-lone-blocks': 'error',
		'no-multi-spaces': 'error',
		'no-multi-str': 'error',
		'no-negated-condition': 'warn',
		'no-new-require': 'error',
		'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
		'no-restricted-syntax': [
			'error',
			{
				'selector': 'ForInStatement',
				'message': 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
			}
		],
		'no-throw-literal': 'error',
		'no-undefined': 'error',
		'no-useless-catch': 'error',
		'no-useless-escape': 'error',
		'no-with': 'error',
		'radix': 'error',
		'vars-on-top': 'error',
		'wrap-iife': ['error', 'any'],

		// ====================================
		// ES6+ 最佳实践
		// ====================================
		'arrow-body-style': ['error', 'as-needed'],
		'arrow-parens': ['error', 'as-needed'],
		'no-class-assign': 'error',
		'no-confusing-arrow': ['error', { 'allowParens': true }],
		'no-duplicate-imports': 'error',
		'no-useless-constructor': 'error',
		'no-useless-rename': 'error',
		'object-shorthand': ['error', 'always'],
		'prefer-arrow-callback': 'error',
		'prefer-const': 'error',
		'prefer-destructuring': [
			'error',
			{
				'array': true,
				'object': true
			},
			{
				'enforceForRenamedProperties': false
			}
		],
		'prefer-rest-params': 'error',
		'prefer-spread': 'error',
		'prefer-template': 'error',
		'rest-spread-spacing': ['error', 'never'],
		'symbol-description': 'error',
		'template-curly-spacing': 'error'
	}
}