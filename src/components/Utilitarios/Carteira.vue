<script setup lang="ts">
import Header from '../UI/Header.vue';
import Sidebar from '../UI/Sidebar.vue';
import Modal from '../UI/Modal.vue';
import { ref } from 'vue';

let showCarteira = ref(false);
</script>

<template>
    <Header showBorder></Header>
    <Sidebar></Sidebar>
    <div class="conteudo">
        <div class="texto-titulo">Carteiras</div>
        <button class="carteira" @click="showCarteira = true">Adicionar Carteira</button>
        <div class="carteira-lista">Carteiras Cadastradas</div>
        <div class="modal">
            <Modal @mostrarModal="showCarteira = false" v-if="showCarteira"></Modal>
        </div>
        
    </div>
    
</template>

<style scoped>
    div.modal {
        position: relative;
        bottom: 10%;
        left: 40%;
    }

    div.conteudo {
        position: absolute;
        top: 20%;
        left: 30%;
        color: ghostwhite;
    }

    div.texto-titulo {
        position: relative;
        left: 150%;
        font-size: x-large;
        margin-bottom: 2%;
    }

    div.carteira-lista {
        font-size: large;
    }

    button.carteira {
        font-size: large;
    }

    button.carteira:hover {
        color: black;
        border-color: black;
        background-color: ghostwhite;
        transition: 0.3s;
    }

    
</style>