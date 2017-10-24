import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Auth = require('../views/Auth.vue')
const Login = require('../views/Login.vue')


const router = new Router({
    mode: 'history',
    routes: [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/auth',
        name: 'auth',
        component: Auth
    }, {
        path: '/login',
        name: 'login',
        component: Login
    }]
})

export default router