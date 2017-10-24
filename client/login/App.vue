<style>

</style>

<template>
  <div>
    <h1>Hello world</h1>
    <router-view></router-view>
  </div>
</template>

<script>
import store from '../index/store'
import Login from './views/Login.vue'
import Auth from './views/Auth.vue'




export default {
  name: 'login',
  components: {
    Login,
    Auth,
  },

  beforeCreate() {
    console.log('islogged:', localStorage.getItem('token'));

    if (store.state.isLogged) {
      router.push('/')
    }
  },

}
</script>