import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// import { 
//     getUser,
//     userLogout,
//     queryArticleById
// } from '../api'

const state = {
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
    }
}

const actions = {
    // for mobile nav
    showHeaderNav({ commit }) {
        commit('SET_HEADER_NAV', true)
    },
    hideHeaderNav({ commit }) {
        commit('SET_HEADER_NAV', false)
    }
}

const getters = {
    HeaderNav: state => state.HeaderNav
}

const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})

export default store