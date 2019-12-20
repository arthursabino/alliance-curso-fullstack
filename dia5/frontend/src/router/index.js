import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'performance',
    component: performance
  },
  {
    path: '/carteira',
    name: 'carteira',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  
  {
    path: '/ativos',
    name: 'ativos',
    component: () => import(/* webpackChunkName: "ativos" */ '../views/Ativos.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
