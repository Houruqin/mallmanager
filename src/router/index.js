import Vue from 'vue'
import Router from 'vue-router'
// 自行配置路由
import login from '../views/login.vue'
import Home from '../views/Home.vue'
// 在vue中使用插件
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      component: Home
    }
  ]
})
