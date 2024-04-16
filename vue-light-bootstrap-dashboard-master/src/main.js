
 import Vue from "vue";
 import VueRouter from "vue-router";
 import App from "./AppTeam.vue";

 import LightBootstrap from "./light-bootstrap-main";// LightBootstrap plugin

 import routes from "./routes/routes";// router setup

 import "./registerServiceWorker";

 // plugin setup
 Vue.use(VueRouter);
 Vue.use(LightBootstrap);


// login

  import App1 from "./App.vue";
  import routers from './router'
  import VModal from 'vue-js-modal'

 Vue.config.productionTip = false

 Vue.use(VModal, { dynamic: true })

// login
 new Vue({
   routes,
   render: function (h) { return h(App1) }
 }).$mount('#app')









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

 /* eslint-disable no-new */
 new Vue({
   el: "#app",
   render: (h) => h(App),
   router,
 });


