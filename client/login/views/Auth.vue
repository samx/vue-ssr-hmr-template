<<style>

</style>

<template>
    <div>
        <h1>Authentication complete!</h1>
        <h2>
            Welcome, {{ loggedInUser}}

            <textarea v-model="response" style="width:500px;height:300px"></textarea>
            <button @click="getYoutubeData">YoutubeData</button>
        </h2>
    </div>
</template>

<script>
export default {
    data() {
        return {
            response: 'null'
        }
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.username
        }
    },
    methods: {
        getYoutubeData() {
            let jwtObject = this.$jwtDecode(this.$route.query.token);

            console.log('youtube', jwtObject.token);

            axios.get('/userVideos', {
                params: {
                    token: jwtObject.token
                }
            }).then((response) => {
                this.response = JSON.stringify(response);
            }, () => {

            })
        }
    },
    mounted() {
        this.$store.commit('LOGIN_USER', this.$route.query.token);
        // setTimeout(function (token) {
        console.log('test');
        //window.location.replace("http://localhost:8080");


        //  }, 1000, this.$route.query.token)
    }
}
</script>
