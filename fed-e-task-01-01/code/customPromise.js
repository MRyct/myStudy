/**
 * 1. Promise 是一个类，而且在new Promise 的时候 传入了一个执行器并且会立即执行
 * 2. 在原型对象上有 resolve, reject方法， 作用是改变 Promise 的状态
 * 3. Promse 有3种状态 pending - 等待， fulfilled - 成功，rejected - 失败 
 * 4. pending 要么 改变成 fulfilled, 要么改变成 rejected
 * 5. Promise 上的then方法 是判断状态的。该方法 也是定义在原型上的，then 方法中有success，fail两个回调函数
 * 6. 处理Promise 异步情况，当在Promise立即执行函数中有异步代码的时候，
 *    主线程中的代码不会等到异步代码执行完成之后在执行的而是会立即执行，
 *    因此Promise中的then方法会立即执行，所以这是Promise的状态为pending, 
 *    因此在pending状态的时候，需要在then方法中，将成功回调和失败回调先存起来，
 *    在异步代码成功后 调用resolve 或 reject 的时候 对用对应的回调函数。
 * 7. 实现then方法多次调用，定义一个成功回调集合（success）和失败(fail)回调集合，把所有的成功回调和失败回调都存起来
 * 8. 实现then方法的链式调用，要实现链式调用的话then方法是必须返回Promise对象的
 * 9. 将上一个then方法的返回值 传入下一个promise对象
 *      1）返回值是Promise对象，需要判断promise状态，如果成功则调用resolve 将成功的状态传给下一个Promise对象， 如果是失败的则调用reject 将失败的结果传给下一个promise对象
 *      2) 返回值是普通值  直接将值传入下一个then方法
 * 10. then方法链式调用识别Promise对象自返回
 * 11. 对Promise 类进行 错误异常 处理
 * 12. then 方法 参数变为可选参数 可传 可不传
 * 13. 实现Promise.all 方法
 *      1) Promise.all 是静态方法
 *      2) Promise.all 方法 返回值是Promise对象
 *      3) Promise.all 方法 返回结果顺序与传入数组一致
 *      4）Promise.all 方法 在处理异步操作时，具备“异步操作 同步体验”
 *      5）Promise.all 方法 处理异步并发
 *      6）Promise.all 方法 所有结果处理完返回
 *      7) Promise.all 方法 一个失败 都失败， 返回第一个失败的结果
 * 14. 实现Promise.resolve 方法
 *      1）Promise.resolve 是静态方法
 *      2) Promise.resolve 返回值是Promise对象
 * 15. 实现finally方法
 *      1）finally 定义在原型对象上
 *      2）finally 方法 不管成功还是失败都会被执行一次
 *      3）finally 方法 后面可以通过then方法进行链式调用
 *      4) finally 方法 返回Promise对象
 * 16. 实现catch方法
 *      1）catch 方法 定在原型对象上
 * 17. 实现Promise.race方法
 *      1) Promise.race 是一个静态方法
 *      2) Promise.race 只要一个有结果 就会返回
 */



//  定义几个状态的常量
const PENDING = 'PENDING' //等待
const FULFILLED = 'FULFILLED' // 成功
const REJECTED = 'REJECTED' // 失败

class CustomPromise {
    constructor(executor) {
        try {
            // 执行器执行的时候 会传入resolve. reject方法
            executor(this.resolve, this.reject)
        }catch(e) {
           this.reject(e) 
        }
    }
    status = PENDING
    value = undefined
    reason = undefined
    success = []
    fail = []
    resolve = value => {
        //  当调用resolve时，状态为pending 改变为成功状态  
        // 因为状态 resolve中 只能由 pending -> fulfilled
        if(this.status !== PENDING) return
        // 更改状态为成功
        this.status = FULFILLED
        // 将成功的值存起来
        this.value = value
        // 如果成功回调存在 调用成功回调
        // this.success && this.success(this.value)
        while(this.success.length) this.success.shift()()
        
    }
    reject = reason => {
        // 当调用reject时，状态为pending 改变为失败状态 
        // 因为状态 reject中 只能由 pending -> rejected
        if(this.status !== PENDING) return
        // 更改状态失败
        this.status = REJECTED
        // 将失败的值也存起来
        this.reason = reason
        // 如果失败回调存在 调用失败回调
        // this.fail && this.fail(this.reason)
        while(this.fail.length) this.fail.shift()()
    }
    //  then方法中有success, fail两个回调函数
    then = (success, fail) => {
        // 当then方法 没有参数的时候 将上一个的值传入 失败 throw 一个reason
        success = success ? success: value => value
        fail = fail ? fail : reason => { throw reason}

        // 实现then方法的链式调用 需的返回Promise对象
        let thenPromise = new CustomPromise((resolve, reject) => {
            if(this.status === FULFILLED) {  // 如果当前状态是成功的话 调用成功回调函数, 并将成功的值传入成功回调函数
            //  因为thenPromise 对象需要在 new CustomPromise 执行完成后才存在，执行过程中是不存在的
            //  因此 在同步代码中也就是执行过程中是获取不到thenPromise的
            //  所以将同步代码改为异步代码，得以解决
                setTimeout(() => {
                    try {
                        let result =  success(this.value)
                        // 这一步就是将当前这个then方法的返回值 传给下一个Promise
                        handlePromise(thenPromise, result, resolve, reject)
                    }catch(e) {
                        reject(e)
                    }
                }, 0)
        
            }else if(this.status === REJECTED) { // 如果当前状态是失败的话，调用失败回调函数， 并将失败的值传入成功回调函数
               
                setTimeout(() => {
                    try {
                        let result =  fail(this.reason)
                        // 这一步就是将当前这个then方法的返回值 传给下一个Promise
                        handlePromise(thenPromise, result, resolve, reject)
                    }catch(e) {
                        reject(e)
                    }
                }, 0)
            }else {
                // 等待状态
                // 将成功回调 和 失败回调 存起来
                this.success.push(() => {
                    setTimeout(() => {
                        try {
                            let result =  success(this.value)
                            // 这一步就是将当前这个then方法的返回值 传给下一个Promise
                            handlePromise(thenPromise, result, resolve, reject)
                        }catch(e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.fail.push(() => {
                    setTimeout(() => {
                        try {
                            let result =  fail(this.reason)
                            // 这一步就是将当前这个then方法的返回值 传给下一个Promise
                            handlePromise(thenPromise, result, resolve, reject)
                        }catch(e) {
                            reject(e)
                        }
                    }, 0)
                })

                
            }
        })
        return thenPromise
    }
    finally (callback) {
        // 返回this.then方法 才能进行链式调用
        // 成功也要将当前then方法的结果 返回给下一个then方法
        // 失败也要将当前失败的原因的结果 返回给下一个then方法
       
        // 如果当前then方法的值 是 异步操作话，需要借助resolve方法 将值都转成Promise对象
        // 这样才能等异步操作执行完成继续往下执行
        return this.then(value => {
            return CustomPromise.resolve(callback()).then(() => value);
        }, reason =>{
            return CustomPromise.resolve(callback()).then(() => { throw reason});
        })
    }
    catch (fail) {
      return this.then(undefined, fail)
    }
    static race (array) {
        return new CustomPromise((resolve, reject) => {
            // 表示 所有array 列表中 已经有结果了
            let done = false
            for(let i = 0; i < array.length; i++) {
                let current = array[i]
                if(current instanceof CustomPromise) {
                    current.then(v => {
                        // 如果有结果了就直接返回了
                        if(done) return
                        resolve(v)
                    }, e =>{
                        // 如果有结果了就直接返回了
                        if(done) return
                        reject(e)
                    })
                }else {
                    // 普通值直接返回
                    resolve(current)
                }
            }
        })
    }
    static all (array) {
        let result = []
        let index = 0
        return new CustomPromise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value
                index++
                // 由于存在异步操作的情况，避免出现 不等异步操作执行完 就调用resolve方法，最后出现空的返回值
                // 定义一个index变量  每次调用addData方法时 +1 当index等于array数组长度时，说明所有方法执行完成
                // 调用resove方法
                // 另：说一下 addData是在 当前Promise对象 成功之后调用的
                if(index === array.length) {
                    resolve(result)
                }
            }
            for(let i = 0; i < array.length; i++) {
                let current = array[i]
                // 判断current是普通值 还是promise对象
                if(current instanceof CustomPromise) {
                    // 如果是Promise对象.则调用current上的then方法查询状态
                    current.then(value => addData(i, value), reason => reject(reason))
                }else {
                    addData(i, array[i])
                }
            }
        })
    }
    static resolve (value) {
        // 判断参数是Promise对象还是普通值
        // 如果是Promise对象 直接返回
        // 如果是普通值的话 就创建一个Promise对象 将值传给romise对象
        if(value instanceof CustomPromise) return value
        return new CustomPromise(resolve => resolve(value))
    }
}

const handlePromise = (thenPromise, result, resolve, reject) =>{
    // 如果当前then 返回的result等于当前的Promise对象那就抛出异常
    if(thenPromise === result) {
       return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    // 判断result 是普通值 还是Promise对象
    // 如果是普通值 直接将值传递给下一个promise对象
    if(result instanceof CustomPromise) {
        // 查看Promise对象(result)的状态 - 调用then方法查看状态
        // 如果成功 调用resolve 将成功状态传递过去
        // 如果失败 调用reject 将失败原因传递过去
        result.then(resolve, reject)
    }else {
        resolve(result)
    }
}
module.exports = CustomPromise
