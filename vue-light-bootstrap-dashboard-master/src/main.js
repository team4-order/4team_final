import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import LightBootstrap from "./light-bootstrap-main";// LightBootstrap plugin
import routes from "./routes/routes";// router setup
import "./registerServiceWorker";

// plugin setup
Vue.use(VueRouter);
Vue.use(LightBootstrap);

// configure router
const router = new VueRouter({
  mode : 'history',
  routes, // short for routes: routes
  linkActiveClass: "nav-item active",
  scrollBehavior: (to) => {
    if (to) {
      return { selector: to };
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

