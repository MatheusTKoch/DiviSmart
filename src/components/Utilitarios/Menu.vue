<script setup lang="ts">
import Header from '../UI/Header.vue';
import Sidebar from '../UI/Sidebar.vue';
</script>

<template>
    <Header showBorder>Teste</Header>
    <Sidebar></Sidebar>
    <div class="conteudo">
        <div class="texto-titulo">Bem vindo(a) ao DiviSmart!</div> 
        <div class="text">Inicie sua carteira para fazer o acompanhamento clicando no botão abaixo, e após tenha acesso
        a relatórios personalizados!</div>
        <button class="carteira">Criar Carteira</button>
    </div>
</template>

<style scoped>
    button.carteira {
        font-size: large;
        margin-top: 2%;
    }

    a:hover {
        color: black;
        border-color: black;
        background-color: ghostwhite;
        transition: 0.3s;
    }

    div.conteudo {
        position: absolute;
        top: 20%;
        left: 30%;
        color: ghostwhite;
    }

    div.text {
        font-size: medium;
        padding-top: 2%;
    }

    div.texto-titulo {
        position: relative;
        font-size: x-large;
        left: 35%;
    }
</style>