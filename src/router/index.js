import Vue from 'vue'
import Router from 'vue-router'
import Visitor from 'group/visitor'
import Admin from 'group/admin'
import MainPage from 'pages/visitor/mainpage/mainpage'
import All from 'pages/visitor/all/all'
import PeopleEvent from 'pages/visitor/people-event/people-event'

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
        },
        {
          path: '/all',
          component: All
        },
        {
          path: '/people-event',
          component: PeopleEvent
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
