module.exports = {
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		open: false,
		hot: true,
		port: 3001,
		contentBase: './public'
	},
	module: {
		rules: [
			{
				test: /\.(le|c)ss$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader',
					'less-loader'
				]
			}
		]
	}
}