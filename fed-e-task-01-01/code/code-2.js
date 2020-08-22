const fp = require('loadsh/fp')
const _ = require('loadsh')
const cars = [
    {
        name: 'Ferrari FF',
        horsepower: 660,
        dollar_velue: 700000,
        in_stock: true
    },
    {
        name: 'Spyker C12 Zagato',
        horsepower: 650,
        dollar_velue: 648000,
        in_stock: false
    },
    {
        name: 'Jaguar XKR-S',
        horsepower: 550,
        dollar_velue: 132000,
        in_stock: false
    },
    {
        name: 'Audi R8',
        horsepower: 525,
        dollar_velue: 114200,
        in_stock: false
    },
    {
        name: 'Aston Martin One-77',
        horsepower: 750,
        dollar_velue: 1850000,
        in_stock: false
    },
    {
        name: 'Ragani Huayra',
        horsepower: 700,
        dollar_velue: 130000,
        in_stock: false
    },
]

/**
 * 练习一
 */

// 1. 获取最后一条数据
const last = (cars) => {
    return fp.last(cars)
}
// 2. 获取in_stock 属性值
const getInStock = (last_car) => {
    return fp.prop('in_stock', last_car)
}

const inStock  = fp.flowRight(getInStock, last)

const inStockResult = inStock(cars)

console.log("=========练习一============")
console.log(inStockResult)

/**
 * 练习二
 */

 const first = (cars) => {
     return fp.first(cars)
 }

 const getName = (first) => {
     return fp.prop('name', first)
 }

 const name = fp.flowRight(getName, first)

 const nameResult = name(cars)

 console.log("=========练习二============")
 console.log(nameResult)

 /**
  * 练习三
  */
 let _average = function(xs) {
     return fp.reduce(fp.add, 0, xs) / xs.length
 }

 let getValues = (cars) => {
     return fp.map(car => car.dollar_velue, cars)
 }

let dollarValue = fp.flowRight(_average, getValues)

const dollarValueResult = dollarValue(cars)

console.log("=========练习三============")
console.log(dollarValueResult)

/**
 * 练习四
 */
let _underscore = fp.replace(/\W+/g, '_')

const split = (v) => {
    return v.split(',')
}
const map = _.curry((fn, array) => _.map(array, fn))

let get = item => item.name

const sanitizeNames = fp.flowRight(map(_underscore), split, fp.toLower)

let names = fp.flowRight(map(get))

console.log(sanitizeNames(names(cars)))