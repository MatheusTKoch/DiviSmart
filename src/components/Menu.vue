<script setup lang="ts">
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import Carteira from './Carteira.vue';
import Dividendos from './Dividendos.vue';
import Relatorios from './Relatorios.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const rotaAtual = computed(() => route.name);
</script>

<template>
    <Header></Header>
    <Carteira v-if="rotaAtual == 'menu/carteira'"></Carteira>
    <Dividendos v-else-if="rotaAtual == 'menu/dividendos'"></Dividendos>
    <Relatorios v-else-if="rotaAtual == 'menu/relatorios'"></Relatorios>
    <Sidebar></Sidebar>
</template>

<style scoped>

</style>