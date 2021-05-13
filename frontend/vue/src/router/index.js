import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import FrontPage from '../views/FrontPage.vue'
import Messages from '../views/Messages'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Login
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register
  },
  {
    path: '/FrontPage',
    name: 'FrontPage',
    component: FrontPage
  },
  {
    path: '/Messages/:Username',
    name: 'Messages',
    component: Messages
  }

]

const router = new VueRouter({
  routes
})

export default router
