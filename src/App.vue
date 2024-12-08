<script setup lang="ts">
import Home from './components/Home.vue';
import NotFound from './components/NotFound.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const rotaAtual = computed(() => route.name);
</script>

<template>
  <NotFound v-if="rotaAtual === 'notFound'"></NotFound>
  <Home v-else/>
</template>

<style scoped>

</style>
