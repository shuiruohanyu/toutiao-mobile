import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/permission'
import plugin from '@/utils/plugin'
import Vant from 'vant'
import 'vant/lib/index.less' // 引入less文件
import '@/styles/index.less'
import 'amfe-flexible' // 引入动态设置的值
Vue.config.productionTip = false
Vue.use(Vant) // 全局注册vant组件
Vue.use(plugin) // 注册自定义的插件
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
