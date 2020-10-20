// 当前 JS 要演示的是利用 babel 插件将 JS 代码转为 ast 
const parser = require('@babel/parser')

let code = `let name = 'zcegg'`

// 利用 parse 接收一个 JS 代码片段，可以将它转为 ast 
let ast = parser.parse(code)
console.log(ast)