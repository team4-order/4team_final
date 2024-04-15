import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VModal from 'vue-js-modal'


Vue.config.productionTip = false
Vue.use(VModal, { dynamic: true })


import VueRouter from "vue-router";
import LightBootstrap from "./light-bootstrap-main";// LightBootstrap plugin
import routes from "./routes/routes";// router setup
import "./registerServiceWorker";
 
 // plugin setup
 Vue.use(VueRouter);
 Vue.use(LightBootstrap);
 
 // configure router
 const router = new VueRouter({
   routes, // short for routes: routes
   linkActiveClass: "nav-item active",
   scrollBehavior: (to) => {
     if (to.hash) {
       return { selector: to.hash };
     } else {
       return { x: 0, y: 0 };
     }
   },
 });
 
new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
