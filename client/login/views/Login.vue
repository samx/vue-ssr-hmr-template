<style>

</style>

<template>
    <div>
        <form v-on:submit="login">
            <input type="hidden" name="type" value="google">
            <button type="submit" value="Login with Google"></button>
        </form>
        <form v-on:submit.prevent="login">
            <h2 class="form__title">{{msg}}</h2>

            <a href="/google-auth"> Log in with Google</a>

            <div class="info info--error" v-if="infoError">Login failed. Please try again.</div>

            <div :class="{'is-waiting': loader}">
                <div class="form-block">
                    <input v-model.trim="email" class="field" name="email" type="text" placeholder="E-mail address" required>
                </div>

                <div class="form-block">
                    <input v-model.trim="password" class="field" name="password" type="password" placeholder="Password" required>
                </div>

                <div class="form-block form__actions">
                    <button class="button button--green form__submit">Login</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>


import store from '../../index/store'

export default {
    data() {
        return {
            msg: "Login Page",
            loader: false,
            infoError: false,
            email: 'john',
            password: 'password'
        }
    },
    methods: {
        login() {

            this.loader = true
            this.infoError = false
            axios.post('/login', {
                name: this.email,
                password: this.password
            }).then((response) => {
                localStorage.setItem('token', response.data.token)
                store.commit('LOGIN_USER')

                console.log(store.state.isLogged)
            }, () => {
                this.infoError = true
                this.loader = false
                this.password = ''
            })
        }
    }
}

</script>