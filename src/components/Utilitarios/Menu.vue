<script setup lang="ts">
import Header from '../UI/Header.vue';
import Sidebar from '../UI/Sidebar.vue';
import axios from 'axios';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Cotacoes from './Cotacoes.vue';
import Spinner from '../UI/Spinner.vue';

const router = useRouter();
onMounted(async () => {
    try {
        await Promise.all([verifyUser()]);
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
})

let nome = ref('');
let horario = ref('');
let loading = ref(true);

async function verifyUser() {
    axios.post('http://localhost:8080/session', {
        usID: localStorage.getItem('usID'),
        sID: localStorage.getItem('sID'),
        exp: localStorage.getItem('exp')
    }).then(() => {
        loadUser();
        loadHorario();
    }).catch((err) => {
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

function loadUser() {
    axios.post('http://localhost:8080/users_load', {
        usID: localStorage.getItem('usID'),
    }).then((res) => {
        nextTick(() => {
            nome.value = res.data.Nome;
        });
    }).catch((err) => {
        console.log(err);
    })
}

function loadHorario() {
    let hora = new Date().getHours();
    
    if (hora <= 12) {
        horario.value = 'bom dia';
    } 
    
    if (hora > 12 && hora <= 18) {
        horario.value = 'boa tarde';
    }  
    
    if (hora >= 19) {
        horario.value = 'boa noite';
    }
}
</script>

<template>
    <Header showPerfil></Header>
    <Sidebar></Sidebar>
    <Cotacoes></Cotacoes>
    <div v-if="loading">
        <Spinner></Spinner>
    </div>
    <div v-else class="conteudo">  
        <div class="texto-titulo">Olá {{ nome }}, {{ horario }}!</div> 
        <div class="text">Inicie sua carteira para fazer o acompanhamento clicando no botão abaixo, e após tenha acesso
        a relatórios personalizados!</div>
        <button class="carteira" @click="router.push('menu/carteira')">Criar/Acompanhar Carteira</button>
    </div>
</template>

<style scoped>
    button.carteira {
        background-color: transparent;
        color: ghostwhite;
        border-color: ghostwhite;
        margin: 10px;
        font-size: large;
        margin-top: 5%;
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
        padding-top: 10%;
    }

    div.texto-titulo {
        position: relative;
        font-size: xx-large;
        left: 5%;
        padding-bottom: 5vh;
    }

    @media screen and (max-width: 480px){
        div.texto-titulo {
        font-size: large;
        }
        
        div.text {
        font-size: small;
        }

        button.carteira {
        font-size: small;
        }
    }
</style>