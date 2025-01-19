<script setup lang="ts">
import Header from '../UI/Header.vue';
import Sidebar from '../UI/Sidebar.vue';
import Modal from '../UI/Modal.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
let showCarteira = ref(false);
let carteiras = ref('');

onMounted(() => {
    verifyUser();
    loadCarteira();
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

function loadCarteira() {
    axios.post('http://localhost:8080/carteira_load', {
        userID: localStorage.getItem('usID')
    }).then((res) => {
        console.log(res);
        carteiras = res.data;
        console.log(carteiras)
    }).catch((err) => {
        console.log(err);
    });
}

</script>

<template>
    <Header showPerfil></Header>
    <Sidebar></Sidebar>
    <div class="conteudo">
        <div class="texto-titulo">Carteiras</div>
        <button class="carteira" @click="showCarteira = true" :disabled="showCarteira">Adicionar Carteira</button>
        <div class="carteira-lista">Carteiras Cadastradas</div>
        <div>
            <ol>
                <li></li>
            </ol>
        </div>
        <div class="modal">
            <Modal @mostrarModal="showCarteira = false && $emit('mostraModal')" v-if="showCarteira"></Modal>
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
        white-space: nowrap;
        padding: 10%;
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