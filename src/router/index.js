import Vue from 'vue'
import Router from 'vue-router'
import Visitor from 'group/visitor'
import Admin from 'group/admin'
import MainPage from 'pages/visitor/mainpage/mainpage'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      component: Visitor,
      children: [
        {
          path: '',
          name: "mainpage",
          component: MainPage
        }
      ]
    },
    {
      path: '/admin',
      component: Admin,
      children: []
    }
  ]
})
