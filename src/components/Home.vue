<script setup lang="ts">
import Header from './Header.vue';
import Footer from './Footer.vue';
</script>

<template>
<div class="background">
    <Header >
    </Header>
    <h1 class="message">Seu Guia Inteligente de Dividendos e Investimentos</h1>
    <div class="message">Acompanhe seus ganhos, visualize dividendos e maximize o retorno dos seus investimentos – tudo em um só lugar.</div>
    <Footer />
</div>
</template>

<style scoped>
h1.message {
    color: ghostwhite;
    width: 50vh;
    height: 16vh;
    padding: 5px;
    text-align: center;
    position: relative;
    top: 15vh;
    left: 12vh;
    font-size:calc(100% + 2vw);
}

div.message {
    color: ghostwhite;
    width: 50vh;
    padding: 10px;
    text-align: justify;
    vertical-align: middle;
    position: relative;
    top: 20vh;
    left: 12vh;
    font-size:calc(100% + 0.25vw);
}

div.background {
    min-height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    background-image: linear-gradient(180deg, rgba(0,24,36,1) 0%, rgba(17,43,148,1) 10%, rgba(0,239,255,1) 100%);
}
</style>
