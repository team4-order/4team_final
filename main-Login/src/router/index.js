import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../views/Login.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  },
  {
    path: '/secure',
    name: 'Secure',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/Secure.vue')
    }
  },
  {
    path: '/login',
    name: 'login',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/Login.vue')

    }
  },
  {
    path: '/register',
    name: 'Register',
    component: function() {
      return import('../views/Register.vue')
    }

  },
  {
    path: '/login',
    name: 'App',
    component: function (){
      return import('../App.vue')
    }
  }/*,{
    path: '/naverlogin',
    name: 'NaverLogin',
    component: function (){
      return import('../views/NaverLogin.vue')
    }
  }*/
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
