<script setup lang="ts">
import Header from '../UI/Header.vue';
import Sidebar from '../UI/Sidebar.vue';
import axios from 'axios';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
let carteiras = ref();
let idCarteira = ref();
let dataInicial = ref();
let dataFinal = ref();

onMounted(() => {
    verifyUser();
    loadCarteira();
})

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

function carregarRelatorio() {
    if (idCarteira.value == undefined || dataInicial.value == undefined || dataFinal.value == undefined) {
        alert('Verifique os campos informados e tente novamente!');
    } else if (dataInicial.value > dataFinal.value) {
        alert('Data inicial maior que a final, verifique os dados!');
    } else {
        axios.post('http://localhost:8080/dividendos_load', {
            cID: idCarteira.value,
            dataInicial: dataInicial.value,
            dataFinal: dataFinal.value
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }
}

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
        <div class="titulo_div">Dividendos</div>
        <div class="descricao">Visualize os relatórios de acordo com o periodo desejado:</div>
        <label for="carteira">Carteira:</label>
        <select name="carteira" v-model="idCarteira" required>
            <option v-for="cart in carteiras" :value="cart.CarteiraID" :v-model="cart.CarteiraID">{{ cart.Nome }}</option>
        </select>
        <label for="data_inicial">Data Inicial:</label>
        <input type="date" v-model="dataInicial" required>
        <label for="data_final">Data Final:</label>
        <input type="date" v-model="dataFinal" required>
        <button class="pesquisa" @click="carregarRelatorio()">Pesquisar</button>
    </div>  
</template>

<style scoped>
div.conteudo {
    position: absolute;
    top: 20%;
    left: 35%;
    color: ghostwhite;
}

div.titulo_div {
    font-size: xx-large;
    text-align: center;
}

div.descricao {
    font-size: large;
    transform: translateX(5vw);
}

label {
    margin: 1vw;
}

button.pesquisa {
    font-size: medium;
    padding: 0.2vw;
    margin-left: 1vw;
}
</style>