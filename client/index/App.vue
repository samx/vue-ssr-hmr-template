<style src="./assets/_ionicicon.css"></style>
<style src="./assets/base.css"></style>
<style>
.view {
  text-align: center;
  padding-top: 1rem;
}

.content {
  display: inline-block;
  width: 960px;
  min-height: 100vh;
  background-color: #fff;
  padding: 1rem;
}

@media all and (max-width: 768px) {
  .content {
    width: 100%;
    padding: .5rem;
    box-sizing: border-box;
  }
}
</style>
<template>
  <div id="app">
    <um-header></um-header>
    <router-view class="view"></router-view>
  </div>
</template>
<script>
import umHeader from './components/Header.vue'
import store from './store/';

export default {
  components: {
    umHeader
  },
  mounted() {
    /*
    console.log('islogged:', localStorage.getItem('token'));
    if (!!localStorage.getItem('token')) {
    } else {
      store.commit('LOGOUT_USER');
    }
    */
  }
}
</script>
