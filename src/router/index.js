import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import Home from '../components/Home'
// import store from '../store'
import TimeEntries from '../components/TimeEntries.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Home
    }, {
      path: '/home',
      component: Home
    }, {
      path: '/time-entries',
      component: TimeEntries,
      // beforeEnter: (to, from, next) => {
      //   store.dispatch('findPlan')
      //   next()
      // },
      children: [{
        path: 'log-time',
        component: resolve => require(['../components/LogTime.vue'], resolve)
      }]
    }
  ]
})
