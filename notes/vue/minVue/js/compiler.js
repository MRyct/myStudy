class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        // 自执行函数  调用compiler 开始编译
        this.compile(this.el)
    }
    // 编译模板，处理文本节点和元素节点
    compile(el) {
        // 获取节点的子节点
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if(this.isTextNode(node)) {  // 处理文本节点
              this.compileText(node)
            }else if(this.isElementNode(node)) {  // 处理元素节点
              this.compileElement(node)
            }
            // 如果当前节点 存在子节点 则递归调用complie 处理
            if(node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }
    // 编译元素节点，处理指令
    compileElement(node) {
        // 获取节点的所有属性
        let attributes = node.attributes
        // 遍历所有属性
        Array.from(attributes).forEach(attr => {
            let attrName = attr.name
            if(this.isDirective(attrName)) { // 判断是否是指令
                attrName = attrName.substr(2)
                let key = attr.value // 变量名 例：v-text="msg"
                 this.update(node, key, attrName)
            }
        })
    }
    update(node, key, attrName) {
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }
    // 处理v-text指令
    textUpdater(node, value, key) {
        node.textContent = value
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }
    // 处理v-model 指令
    modelUpdater(node, value, key) {
        node.value = value
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })
        // 双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }
    // 编译文本节点，处理差值表达式
    compileText(node) {
        /**
         * 处理文本节点思路：
         * 1.正则匹配出差值表达式中的变量名
         * 2.提取该变量名并处理空格字符
         * 3.用该变量去当前实例（this.vm）中获取对应的值
         */
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent

        if(reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
            
            // 创建watcher对象，当数据改变更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }
    // 判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')     
    }
    // 判断节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }
    // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}