<script setup lang="ts">
import Header from '../UI/Header.vue';
import Sidebar from '../UI/Sidebar.vue';
import Modal from '../UI/Modal.vue';
import axios from 'axios';
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
let showCarteira = ref(false);
let carteiras = ref();

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
        nextTick(() => {
            carteiras.value = res.data;
        })
    }).catch((err) => {
        console.log(err);
    });
}

function deleteCarteira(num:number) {
    if(confirm('Tem certeza que deseja apagar a carteira?')) {
        axios.post('http://localhost:8080/carteira_delete', {
            carteiraID: num
        }).then((res) => {
            console.log(res);
            window.location.reload();
        }).catch((err) => {
            console.log(err);
        })
    } else {
        console.log('nao')
    }
}
</script>

<template>
    <Header showPerfil></Header>
    <Sidebar></Sidebar>
    <div class="conteudo">
        <div>
            <div class="titulos-carteira">
                <div class="texto-titulo">Carteiras</div>
                <button class="carteira" @click="showCarteira = true" :disabled="showCarteira">Adicionar Carteira</button>
            </div>
            <div class="carteira-lista">Carteiras Cadastradas</div>
            <div>
                <ol v-for="cart in carteiras">
                    <li :id="cart.userId">{{ cart.Nome }}<svg class="alter_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                        <svg @click="deleteCarteira(cart.CarteiraID)" class="delete_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                        <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>
                    </li>
                </ol>
            </div>
            <div class="modal">
                <Modal @mostrarModal="showCarteira = false && $emit('mostraModal')" v-if="showCarteira"></Modal>
            </div>
        </div>
    </div>
    
</template>

<style scoped>
    svg.delete_icon {
        position: relative;
        left: 0.75vh;
        top: 0.75vh;
    }

    svg.alter_icon {
        position: relative;
        left: 0.75vh;
        top: 0.75vh;
    }

    li {
        list-style-type: none;
        cursor: pointer;
        font-size: large;
    }

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
        text-decoration: underline;
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