import Vue from 'vue'
import App from './App.vue'
import store from '../index/store'
import router from './router'
import jwtDecode from 'jwt-decode';

Object.defineProperty(Vue.prototype, '$jwtDecode', { get() { return this.$root.jwtDecode } });


const app = new Vue({
  data: {
    jwtDecode
  },
  el: '#app',
  render: h => h(App),
  router,
  store
}).$mount('#app')
