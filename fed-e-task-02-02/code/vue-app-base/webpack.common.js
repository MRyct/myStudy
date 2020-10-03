const { merge } = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const baseConfig = {
	entry: './src/main.js',
	resolve: {
		extensions: ['.js', '.ts', '.css', '.less'],
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /.js$/,
				loader: 'babel-loader'
			},
			{
				test: /\.tsx?$/,  //正则匹配.ts|tsx后缀文件,使用ts-loader进行解析,这里就是使用TypeScript的关键配置
				use: [
					{loader: 'babel-loader'},
					{loader: 'ts-loader',options: {transpileOnly: true,appendTsSuffixTo: ['\\.vue$'],happyPackMode: true}}]
			},
			{
				test: /\.(jpg|jpeg|png|gif|svg)$/i,
				loader: 'url-loader',
				options: {
					esModule: false, // 这里设置为false
					name: 'images/[name]-[hash:5].[ext]',
					limit: 100,
				}
			},
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				enforce: "pre",
				include: [path.resolve(__dirname, 'src')], // 指定检查的目录
				options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
					formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
				}
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: './public/index.html'
		})
	]
}
module.exports = (env, argv) => {
	const config = require(`./webpack.${argv.mode}`)
	return merge(baseConfig, config)
}