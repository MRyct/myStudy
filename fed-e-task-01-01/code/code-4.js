const CustomPromse = require('./customPromise')
const CustomPromise = require('./customPromise')

const promise = new CustomPromse((resolve, reject) => {
    resolve('成功')
    // reject('失败')
    // setTimeout(() => {
    //    resolve("成功")
    // }, 2000)
    // throw new Error('exeutor error')
})

const p1 = () => {
    return new CustomPromse((resolve, reject) => {
        setTimeout(() => {
            resolve('p1')
        }, 1000)
    })
}
const p2 = () => {
    return new CustomPromse((resolve, reject) => {
        resolve('成功')
    })
}
// CustomPromse.all(['A','B',p1(), p2(), 'C']).then(result => console.log(result))
// function other () {
//     return new CustomPromise((resolve, reject) => {
//         resolve('other')

//     })
// }
// let p1 = promise.then(value => {
//     console.log(value)
//     return value
// })
// promise.then((value) =>{
//     console.log(value)
//     // throw new Error('then error')
//     return 'aaa'
// }, reason => {
//     console.log(reason)
//     return 1000
// }).then((value) =>{
//     console.log(value)
// })

// promise.then().then().then(v => console.log(v))

// CustomPromse.resolve(100).then(value => console.log(value))
// CustomPromse.resolve(p1()).then(value => console.log(value))

// p2().finally( () => {
//     console.log('finally')
//     return p1()
// })
// .then(v => {
// console.log(v)
// }, err => {
// console.log(err)
// })

// p2()
// .then(v => console.log(v))
// .catch(r => console.log(r))

CustomPromse.race([p1(), p2()]).then(v => console.log(v), e => console.log(e))