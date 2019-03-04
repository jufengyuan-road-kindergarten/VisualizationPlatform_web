import Vue from 'vue'
import Router from 'vue-router'
import MainPage from 'pages/mainpage/mainpage'
import All from 'pages/all/all'
import PersonEvent from 'pages/person-event/person-event'
import EventPerson from 'pages/event-person/event-person'
import Wiki from 'pages/wiki/wiki'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: "mainpage",
      component: MainPage
    },
    {
      path: '/all',
      component: All
    },
    {
      path: '/person-event',
      component: PersonEvent
    },
    {
      path: '/event-person',
      component: EventPerson
    },
    {
      path: '/wiki',
      component: Wiki
    }
  ]
})
