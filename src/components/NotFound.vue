<script setup lang="ts">
import Header from './Header.vue';
</script>

<template>
  <Header></Header>
    <div class="aviso">
        <div class="titulo">Ooops!</div>
        <div class="subtitulo">404 - Página não Encontrada</div>
        <p class="mensagem">Por favor, retorne para a <RouterLink to="/">página inicial</RouterLink></p>
    </div>
</template>

<style scoped>
div.aviso {
    color: whitesmoke;
    text-align: center;
    transform: translateY(30vh);
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

</style>