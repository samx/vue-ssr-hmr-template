import Vue from 'vue'
//import VueResource from 'vue-resource';
import store from './store'
import router from './router'
import App from './App.vue'
import { sync } from 'vuex-router-sync'

sync(store, router)

const app = new Vue({
    data: {
    },
    store,
    router,
    ...App
})

export { app, router, store }
