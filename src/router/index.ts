import { createRouter, createWebHistory } from 'vue-router'   
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Category from '@/views/Category.vue'
import MapView from '@/views/MapView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  { 
    path: '/:type', 
    name: 'category', 
    component: Category 
  },
  { path: '/map', 
    name: 'map', 
    component: MapView 
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
