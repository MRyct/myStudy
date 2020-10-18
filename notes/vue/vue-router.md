#### vue-router

##### 一、hash 模式和 history模式的区别

- hash

  - URL 中#后面的内容作为路径地址
  - hash url中有`#`， https://xxx.xxx.com/#/list?id=1111\
  - hash 是基于锚点，以及onhashchange事件
  - 

- history

  - history url就是一个正常的url地址  https://xxx.xxx.com/list/1111
  - history 是基于HTML5中的history API
    - history.pushState() (IE10以后才支持)
    - history.replaceState()
  - 监听 popstate 事件

- nodejs 配置history模式

  > connect-history-api-fallback 处理history模式的中间件

- nginx 配置history模式

  > 在nginx.conf文件中的server->location / 添加 `try_files $uri $uri/ /index.html`

##### 二、Vue_Router install 方法

- 判断当前插件是否已经被安装

- 将Vue构造函数记录到全局变量

- 把创建Vue实例时候传入的router对象注入到Vue实例上

- 混入

  ```javascript
  let _Vue = null
  export default class VueRouter {
      static install(Vue) {
          // 判断当前插件是否被安装
          if(VueRouter.install.installed) return
          // 将Vue构造函数 记录到全局变量中
          VueRouter.install.installed = true
          _Vue = Vue
          将创建Vue实例时候传入的router对象注入到Vue实例上
          _Vue.mixin({
              beforeCreate(){
                  if(this.$options.router) {
                      _Vue.prototype.$router = this.$options.router
                      this.$options.router.init()
                      this.$options.router.initEvent()
                  }
              }
          })
      }
  }
  ```

  ##### 三、构造函数
  > 初始化 options,data,routeMap参数
  - options 记录传入的路由选项

  - routeMap 路由规则

  - data 通过observable方法创建一个响应式数据

    ```javascript
    this.data =  _Vue.observable({
        current: '/' //当前路由地址
    })
    ```

    


  ##### 四、createRouteMap
  > 遍历所有的路由规则`routes`并解析存入到routeMap对象中
  > ``` javascript
  > createMap(){
  > this.options.routes.forEach(route =>{
  > this.routeMap[route.path] = route.component
  > })
  > ```

  ##### 五、initComponents
  - 传入vue 对象
  ###### router-link
  - 通过运行时版本实现`实现render方法`

  ``` javascript
  initComponents(vue){
   vue.component(`router-link`,{
    props:{
     to: String
    },
    render(h){
     return h(`a`,{
      attrs: {
       href: this.to
      },
      on: {
          click: this.clickhandle // 给链接注册点击事件
      }
     },[this.$slots.default])
    },
     methods: {
         clickHandle(e) {
             // 改变地址栏中地址
             history.pushState({}, '', this.to)
             // 修改当前地址为this.to
             this.$router.data.current = this.to
         		e.preventDefault()
     		}    
    	}
    })
   }
  }
  ```
  - 通过完整版实现`在vue.config.js中添加runtimeCompler属性为true

  ``` javascript
  initComponents(vue){
   vue.component(`router-link`,{
    props:{
     to: String
    },
    template: '<a :href="to"><slot></slot></ a>'
    })
   }
  }
  ```

  ###### router-view

  ```javascript
  initComponents(vue) {
      const self = this
      vue.component('router-view', {
          render(h) {
              // 获取当前路由对应的组件
              const component = self.routeMap[self.data.current]
              h(component)
          }
      })
  }
  ```

  

  ##### 六、init

  > 初始化vuerouter方法,在install 方法的beforeCreate方法中调用`this.$options.router.init()`

  ##### 七、initEvent

  > 监听浏览器前进后退操作

  在install方法的beforCreate方法中调用

  ```javascript
  initEvent() {
      window.addEventListener('popstate', () => {
          this.data.current = window.location.pathname
      })
  }
  ```