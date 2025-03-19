import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/main/Login.vue'
import Products from '../views/modules/products/ProductComponent.vue'
import HelloWorld from '../components/HelloWorld.vue'
import Invoices from '../views/modules/Invoices/InvoicesComponent.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HelloWorld
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/products',
    name: 'products',
    component: Products
  },
  {
    path: '/invoices',
    name: 'invoices',
    component: Invoices
  },
]

const router = new VueRouter({routes, mode: 'history'});

export default router
