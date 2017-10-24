import Vue from 'vue'
import Vuex from 'vuex'
import jwtDecode from 'jwt-decode';

Vue.use(Vuex)

// import { 
//     getUser,
//     userLogout,
//     queryArticleById
// } from '../api'

const state = {
    //isLogged: !!localStorage.getItem('token'),
    //isLogged: false,
    userProfile: {
        username: ''
    },
    HeaderNav: {
        show: false,
        navs: [{
            text: 'Home',
            route: {
                name: 'home'
            }
        }, {
            text: 'Article',
            route: {
                name: 'article'
            }
        }, {
            text: 'Tag',
            route: {
                name: 'tag'
            }
        }]
    }
}

const mutations = {
    SET_HEADER_NAV(state, active) {
        state.HeaderNav.show = active
    },
    LOGIN_USER(state, token) {
        //state.isLogged = true
        localStorage.setItem('token', token);

        let userObject = jwtDecode(token);
        state.userProfile.username = userObject.displayName || 'Anonymous';

    },
    LOGOUT_USER(state) {
        //state.isLogged = false
        localStorage.setItem('token', '');
    }
}

const actions = {
    // for mobile nav
    showHeaderNav({ commit }) {
        commit('SET_HEADER_NAV', true)
    },
    hideHeaderNav({ commit }) {
        commit('SET_HEADER_NAV', false)
    },
    logoutUser({ commit }) {
        commit('LOGOUT_USER');
    },
    setLogged({ commit }) {
        console.log('commit isLogged = false')
        commit('LOGIN_USER');
    }
}

const getters = {
    HeaderNav: state => state.HeaderNav,
    //isLogged: state => state.isLogged,
    username: state => state.userProfile.username
}

const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})

export default store