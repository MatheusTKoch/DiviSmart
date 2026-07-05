<script setup lang="ts">
import Header from "../UI/Header.vue";
</script>

<template>
  <Header></Header>
  <div class="page-empty">
    <div class="page-panel centered-card aviso">
    <div class="titulo">Ooops!</div>
    <div class="subtitulo">404 - Página não Encontrada</div>
    <p class="mensagem">
      Por favor, retorne para a <RouterLink to="/">página inicial</RouterLink>
    </p>
    </div>
  </div>
</template>

<style scoped>
div.titulo {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
}

div.subtitulo {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 0.75rem;
}

div.mensagem {
  font-size: 1rem;
  color: #cbd5e1;
}
</style>
