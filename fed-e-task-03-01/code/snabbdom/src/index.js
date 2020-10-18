import { h, init } from 'snabbdom'
import style from 'snabbdom/modules/style'
import eventlistenters from 'snabbdom/modules/eventlisteners'
let patch = init([style, eventlistenters])

let app = document.querySelector('#app')

const listData = ['1霍元甲', '2猛龙过江', '32012', '4星际大战', '5环太平洋', '6战狼']

let vnode = () => {
    let lis = []
    for(let i = 0; i < listData.length; i++) {
        let li = h('li', {
            key: i,
            style: {
                'list-style-type': 'none',
                border: '1px solid #999',
                'margin-bottom': '20px',
                'padding': '20px',
                position: 'relative',
                width:" 300px"
            }
        }, [listData[i], h('span', {
            style: {
                position: 'absolute',
                right: '20px',
                color: 'red',
                display: 'inline-block',
                width: '20px',
                height: '20px',
                'text-align': 'center',
                'line-height': '20px',
                'border-radius': '50%',
                border: '1px solid red',
                'font-size': '12px'
            },
            on: {
                click: [delLi, i]
            }
        }, 'X')])
        lis.push(li)
    }
    return h('ul', {}, lis)
}
// 添加节点button
let addBtn = () => {
    return h('div', {
        style: {
            width: '60px',
            height: '20px',
            'text-align': 'center',
            'line-height': '20px',
            'border-radius': '10px',
            background: '#000',
            color: '#fff',
            'font-size': '12px',
            'margin-bottom': '20px'
        },
        on: {click: addHandler}
    }, '添加')
}
// 排序button
let sortBtn = () => {
    return h('div', {
        style: {
            width: '60px',
            height: '20px',
            'text-align': 'center',
            'line-height': '20px',
            'border-radius': '10px',
            background: '#000',
            color: '#fff',
            'font-size': '12px'
        },
        on: {click: sortHandler}
    }, '排序')
}
let mainNode = () => {
    return h('div#main', {
        style: {
            background: '#f3f3f3',
            width: '400px',
            padding: '30px'
        }
    }, [addBtn(), sortBtn(), vnode()])
}
let oldNode = patch(app, mainNode())
//处理添加事件
function addHandler() {
   let nowTime = new Date().getTime()
   listData.unshift(nowTime)
   oldNode = patch(oldNode, mainNode())
}
//处理排序事件
function sortHandler() {
  
    listData.reverse()
    oldNode = patch(oldNode, mainNode())
 }
 // 处理删除事件
function delLi (index) {
    listData.splice(index, 1)
    oldNode = patch(oldNode, mainNode())
}

