<script setup lang="ts">
import Home from './components/Home.vue';
import NotFound from './components/NotFound.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Register from './components/Register.vue';

const route = useRoute();
const rotaAtual = computed(() => route.name);
</script>

<template>
  <div class="background">
    <NotFound v-if="rotaAtual === 'notFound'"></NotFound>
    <Register v-else-if="rotaAtual == 'register'"></Register>
    <Home v-else/>
  </div>
</template>

<style scoped>
div.background {
    min-height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    background-image: linear-gradient(180deg, rgba(0,24,36,1) 0%, rgba(17,43,148,1) 10%, rgba(0,239,255,1) 100%);
}
</style>
