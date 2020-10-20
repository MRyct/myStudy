// 当前 JS 要演示的是利用 babel 插件将 JS 代码转为 ast 
const parser = require('@babel/parser')
// import traverse from "@babel/traverse";   export import 
const traverse = require('@babel/traverse').default  // require module.exports 
const generator = require('@babel/generator').default

// 需求： 修改当前代码中的某些内容
/* 
  01 将下面代码中的 name 修改为 slogan
  02 想办法将下面的代码转为 AST 语法树，然后再去遍历这个树上的所有节点
  03 只要我们可以遍历所有的节点，那么就一定能找到叫 name 的这个字面量
  04 找到这个字面量之后就再利用相应的操作完成修改工作（）

  05 上面的四步做完之后我们只是在语法树上修改了我们的代码，最终想要体现在代码中还需要另一个插件
*/
let code = `let name = 'zce is a ML'`

let ast = parser.parse(code)

// 上面的 ast 就是语法树，我要怎么遍历呢？利用插件 traverse 
traverse(ast, {
  enter(nodePath) {  // 这个方法会遍历到所有的节点
    // console.log(nodePath.node.type)
    if (nodePath.node.type === 'Identifier') {
      // 在本例中就说明我们找到了 name 变量名 
      nodePath.node.name = 'aaa'
      nodePath.stop()
    }
  }
})
let retCode = generator(ast)
console.log(retCode)