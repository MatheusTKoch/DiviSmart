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
        <div class="titulo_div">Dividendos</div>
        <div class="descricao">Visualize os relatórios de acordo com o periodo desejado:</div>
        <label for="carteira">Carteira:</label>
        <select name="carteira" required></select>
        <label for="data_inicial">Data Inicial:</label>
        <input type="date" required>
        <label for="data_final">Data Final:</label>
        <input type="date" required>
        <button class="pesquisa">Pesquisar</button>
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