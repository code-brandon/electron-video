import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'


const routes = [
  {
    path:'/launch',
    name:'Launch',
    component:()=>import('@/views/LaunchPage.vue')
  },
  {
    path:'/dashboard',
    name:'Dashboard',
    component:()=>import('@/views/Dashboard.vue')
  },
  {
    path:'/suspend',
    name:'Suspend',
    component:()=>import('@/views/Suspend.vue')
  }
]

const router = createRouter({
  // mode: 'history',
  // mode: 'hash',
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes
})

export default router
