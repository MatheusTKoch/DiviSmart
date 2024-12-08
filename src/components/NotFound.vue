<script setup lang="ts">
import Header from './Header.vue';
</script>

<template>
  <div class="background">
  <Header></Header>
    <div class="aviso">
        <div class="titulo">Ooops!</div>
        <div class="subtitulo">404 - Página não Encontrada</div>
        <p class="mensagem">Por favor, retorne para a <RouterLink to="/">página inicial</RouterLink></p>
    </div>
  </div>
</template>

<style scoped>
div.aviso {
    color: whitesmoke;
    text-align: center;
    vertical-align: middle;
}

div.titulo {
    top: 40%;
    font-size: xx-large;
}

div.subtitulo {
    font-size: x-large;
}

div.mensagem {
    font-size: large;
}
div.background {
    min-height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    background-image: linear-gradient(180deg, rgba(0,24,36,1) 0%, rgba(17,43,148,1) 10%, rgba(0,239,255,1) 100%);
}
</style>