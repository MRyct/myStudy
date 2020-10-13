#### vue-router

##### 一、hash 模式和 history模式的区别

- 表现形式

  - hash url中有`#`， https://xxx.xxx.com/#/list?id=1111
  - history url就是一个正常的url地址  https://xxx.xxx.com/list/1111

- 原理

  - hash 是基于锚点，以及onhashchange事件
  - history 是基于HTML5中的history API
    - history.pushState() (IE10以后才支持)
    - history.replaceState()

- nodejs 配置history模式

  > connect-history-api-fallback 处理history模式的中间件

- nginx 配置history模式

  > 在nginx.conf文件中的server->location / 添加 `try_files $uri $uri/ /index.html`

