import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import LightBootstrap from "./light-bootstrap-main";// LightBootstrap plugin
import routes from "./routes/routes";// router setup
import "./registerServiceWorker";
import Swal from 'sweetalert2';
import VueCookies from 'vue-cookies';

Vue.use(VueCookies);
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


router.beforeEach((to, from, next) => {
  // 메타 데이터를 확인하여 인증이 필요한 페이지인지 검사
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // localStorage나 sessionStorage에서 값을 가져옵니다.
    const code = localStorage.getItem("code");
    const user = sessionStorage.getItem("user");
    const cuser = sessionStorage.getItem("cuser");
    // code나 user 값이 있으면 다음 페이지로 진행
    if (code || user ||cuser) {
      next();
    } else {

       Swal.fire({
        title: 'Login Status Error',
        text: '세션이 만료되었거나, 로그인 상태 에러입니다.',
        icon: 'error',
        confirmButtonText: '돌아가기'
      });
      localStorage.removeItem('token');
      localStorage.removeItem('code');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('cuser');
      next("/login");
    }
  } else {
    // 인증이 필요없는 페이지는 바로 다음으로 넘어갑니다.
    next();
  }
});








/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
});

