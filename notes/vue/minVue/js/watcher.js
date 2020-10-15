class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        // data中的属性名称
        this.key = key
        // 回调函数负责更新视图
        this.cb = cb
        // 将wathcer对象记录到Dep类的静态属性target
        Dep.target = this
        this.oldValue = vm[key]
        // 添加完Watcher之后将target置为空，避免出现重复添加
        Dep.target = null
    }
    // 当数据发生变化的时候更新视图
    update() {
        let newValue = this.vm[this.key]
        // 如果新旧值相同 没有变化什么也不做
        if(this.oldValue === newValue) return
        this.cb(newValue)
    }
}