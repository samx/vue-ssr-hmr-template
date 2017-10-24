<template>
    <div>
        <div class="content home">
            <div class="readme">
                <a href="https://github.com/hilongjw/vue-ssr">
                    <h2>Vue SSR</h2>
                </a>
                <p>
                    Use Vue 2.0 server-side rendering with Express
                    <button v-on:click="goto1">Hello</button>
                    <button @click="goto2">Hello</button>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import router from '../router';
export default {
    name: 'Article',
    serverCacheKey: () => 'tag',
    methods: {
        goto1() {
            alert(0);
            router.push('/tag');
        },
        goto2() {
            router.push('home');
        }
    }
}
</script>