<script setup lang="ts">
import Header from './UI/Header.vue';
import Footer from './UI/Footer.vue';
</script>

<template>
    <Header showLogin></Header>
        <h1 class="message">Seu Guia Inteligente de Dividendos e Investimentos</h1>
        <div class="message">Acompanhe seus ganhos, visualize dividendos e maximize o retorno dos seus investimentos – tudo em um só lugar.</div>
        <img src="../assets/graph.png" alt="graph" class="grafico">
        <button class="cadastro"><RouterLink class="cadastro1" to="/register">Criar Conta</RouterLink></button>
    <Footer />
</template>

<style scoped>
a.cadastro1 {
    text-decoration: none;
    color: inherit;
}

button.cadastro {
    background-color: transparent;
    position: relative;
    color: ghostwhite;
    border-color: ghostwhite;
    bottom: 30vh;
    right: 35vh;
}

button.cadastro:hover {
    color: black;
    border-color: black;
    background-color: ghostwhite;
    transition: 0.3s;
}

img.grafico {
    position: relative;
    left: 100vh;
    bottom: 20vh;
}

h1.message {
    color: ghostwhite;
    width: 50vh;
    height: 16vh;
    padding: 5px;
    text-align: center;
    position: relative;
    top: 15vh;
    left: 20vh;
    font-size:calc(100% + 1.5vw);
}

div.message {
    color: ghostwhite;
    width: 50vh;
    padding: 10px;
    text-align: justify;
    vertical-align: middle;
    position: relative;
    top: 20vh;
    left: 20vh;
    font-size:calc(100% + 0.25vw);
}

@media screen and (max-width: 480px) {

    h1.message {
        left: 10vw;
        font-size: medium;
    }

    div.message {
        font-size: small;
        top: 18vh;
        left: 1vw;
    }

    button.cadastro {
        font-size: small;
        left: 20vw;
        bottom: 50vh;
    }
}
</style>
