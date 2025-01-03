<script setup lang="ts">
import Home from './components/Home.vue';
import NotFound from './components/Utilitarios/NotFound.vue';
import Register from './components/Forms/Register.vue';
import Login  from './components/Forms/Login.vue';
import Menu from './components/Utilitarios/Menu.vue';
import Carteira from './components/Utilitarios/Carteira.vue';
import Dividendos from './components/Utilitarios/Dividendos.vue';
import Relatorios from './components/Utilitarios/Relatorios.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();
const rotaAtual = computed(() => route.fullPath);
</script>

<template>
  <div class="background">
    <NotFound v-if="rotaAtual === '/notFound'"></NotFound>
    <Login v-else-if="rotaAtual == '/login'"></Login>
    <Register v-else-if="rotaAtual == '/register'"></Register>
    <Menu v-else-if="rotaAtual == '/menu'"></Menu>
    <Carteira v-else-if="rotaAtual == '/menu/carteira'"></Carteira>
    <Dividendos v-else-if="rotaAtual == '/menu/dividendos'"></Dividendos>
    <Relatorios v-else-if="rotaAtual == '/menu/relatorios'"></Relatorios>
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
