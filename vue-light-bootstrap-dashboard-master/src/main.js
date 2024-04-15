import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VModal from 'vue-js-modal'



Vue.config.productionTip = false
Vue.use(VModal, { dynamic: true })


new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
