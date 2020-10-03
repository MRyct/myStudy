module.exports = {
	root: true, // 作用的目录是根目录
	parserOptions: {
		sourceType: 'module' // 按照模块的方式解析
	},
	env: {
		browser: true, // 开发环境配置表示可以使用浏览器的方法
	},
	plugins: ["typescript"],
	extends: ['standard', 'plugin:vue/recommended'], // 导入airbnb规则
	rules: {
		// 自定义的规则
		"import/no-unresolved": "error",
		"linebreak-style": [0 ,"error", "windows"],
		"semi": ["error", "never"],
		'import/extensions': 0,
		"arrow-parens": ["error", "as-needed"],
		"indent": ['error', 2]
	}
}