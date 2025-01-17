<script setup lang="ts">
import Header from '../UI/Header.vue';
import Sidebar from '../UI/Sidebar.vue';
import axios from 'axios';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
onMounted(() => {
    verifyUser();
})

function verifyUser() {
    axios.post('http://localhost:8080/session', {
        usID: localStorage.getItem('usID'),
        sID: localStorage.getItem('sID'),
        exp: localStorage.getItem('exp')
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
        if(err.response.data == 'Sessao expirada' && err.response.status == 401) {
            localStorage.removeItem('usID');
            localStorage.removeItem('exp');
            localStorage.removeItem('sID');
            router.push('/login');
        }

        if(err.response.data == 'Sem dados na localStorage' && err.response.status == 401) {
            router.push('/login');
        }
    });
}
</script>

<template>
    <Header showPerfil></Header>
    <Sidebar></Sidebar>
    <div class="conteudo">
        <div class="texto-titulo">Bem vindo(a) ao DiviSmart!</div> 
        <div class="text">Inicie sua carteira para fazer o acompanhamento clicando no botão abaixo, e após tenha acesso
        a relatórios personalizados!</div>
        <button class="carteira" @click="router.push('menu/carteira')">Criar Carteira</button>
    </div>
</template>

<style scoped>
    button.carteira {
        font-size: large;
        margin-top: 2%;
    }

    button.carteira:hover {
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