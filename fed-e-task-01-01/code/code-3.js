const fp = require('loadsh/fp')
const { Maybe, Container } = require('./support')

/**
 * 练习一
 */
let maybe = Maybe.of([5, 6, 1])
let ex1 = v => maybe.map(list => fp.map(a => fp.add(a, v), list))
console.log(maybe)
console.log(ex1(3))

/**
 * 练习二
 */
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])

let ex2 = fn => xs.map(fn)
let r = ex2(fp.first)._value
console.log(r)

/**
 * 练习三
 */
let safeProp = fp.curry(function(x, o) {
    return Maybe.of(o[x])
})

let user = { id: 2, name: 'Albert' }

let ex3 = () => safeProp('name', user).map(fp.first)._value
console.log(ex3())

/**
 * 练习四
 */

 let ex4 = n => Maybe.of(n).map(parseInt)._value

 console.log(ex4('123456'))