const path = require('path')

module.exports = {
  devtool: "none", 
  mode: 'development', 
  entry: "./src/index.js", 
  output: {
    filename: 'bundle.js', 
    path: path.resolve('dist')
  }
}