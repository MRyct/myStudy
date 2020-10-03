import Vue from 'vue'
import App from './App.vue'
import { hello } from './test.ts'
import './style.less'
import { test1, test2 } from './index'

test1(hello)
test2()

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
