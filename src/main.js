import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios'
import Swal from 'sweetalert2'
import  Vue2Filters from 'vue2-filters'
Vue.use(vuetify);
Vue.use(Vue2Filters);
new Vue({
  router,
  axios,
  Swal,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
