import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios'
import Swal from 'sweetalert2'
import  Vue2Filters from 'vue2-filters'
import moment from 'moment/moment'
import FileSaver from 'file-saver'
Vue.use(vuetify);
Vue.use(Vue2Filters);
Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY')
  }
});
new Vue({
  router,
  axios,
  Swal,
  vuetify,
  moment,
  FileSaver,
  render: function (h) { return h(App) }
}).$mount('#app')
