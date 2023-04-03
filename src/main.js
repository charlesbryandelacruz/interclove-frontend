import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios'
import Swal from 'sweetalert2'

Vue.use(vuetify);

new Vue({
  router,
  axios,
  Swal,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
