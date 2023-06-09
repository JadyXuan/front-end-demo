import Vue from 'vue'
import VueRouter from 'vue-router'
import Menu from '@/components/Menu'
import monitor from '@/components/monitor'
import thermal from '@/components/thermal'
import dashboard from '@/components/dashboard'
import history from '@/components/History'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    name: 'Menu',
    component: Menu,
    children: [
      {
        path: '/monitor',
        name: 'monitor',
        component: monitor
      },
      {
        path: '/thermal',
        name: 'thermal',
        component: thermal
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: dashboard
      },
      {
        path: '/history',
        name: 'history',
        component: history
      }
    ]
  }
]
const router = new VueRouter({
  routes
})

export { router, routes }
