// 当前 JS 要演示的是利用 babel 插件将 JS 代码转为 ast 
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default  
const generator = require('@babel/generator').default
import * as t from '@babel/types'

/* 
  需求： 创建 let slogan = "我爱工作，我爱前端"，节点添加至 body 中

  01 先想办法创建一个空的语法树 
  02 依据目标语句，利用 babel 提供的插件或者方法来组装语法树的节点 
  03 添加至 body 
*/

let code = ``
let ast = parser.parse(code)  // 创建了一个空的语法树

// 利用 types 里所提供的方法（type所对应的单词在 types中都有具体的方法，就相当于创建节点）
let init = t.stringLiteral('我爱工作，我爱前端')
let id = t.identifier('slogan')
let declarator = t.VariableDeclarator(id, init)
let declaration = t.variableDeclaration('let', [declarator])

ast.program.body.push(declaration)

// 这里的 ast 就是我们组装之后的
// console.log(ast)
let retCode = generator(ast)
console.log(retCode)

