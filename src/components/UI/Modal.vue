<script setup lang="ts">
import axios from 'axios';
import {ref} from 'vue';

let nomeCarteira = ref('');
let userID = ref();
let showAlert = ref(false);

function validarCarteira() {
    if(nomeCarteira.value == '') {
        showAlert.value = true;
    } else {
        showAlert.value = false;
    }
}

function cadastroCarteira() {
    if(nomeCarteira.value == '') {
        alert('Por favor informe um nome para cadastro da carteira!');
    } else {
        let dados = new URLSearchParams()
        userID.value = localStorage.getItem('usID');
        dados.append('carteira', nomeCarteira.value);
        dados.append('userID', userID.value);
        axios.post('http://localhost:8080/carteira', dados).then((res) => {
            console.log(res);
            window.location.reload();
        }).catch((err) => {
            console.log(err);
        })
    }
}
</script>

<template>
        <div class="conteudo">
            <div class="titulo">Cadastro de Carteiras<a class="fechar" @click="$emit('mostrarModal')">X</a></div>
            <label for="nomeCarteira">Nome da Carteira: </label>
            <input type="text" id="nomeCarteira" v-model="nomeCarteira" v-on:keyup="validarCarteira">
            <p class="alert" v-if="showAlert">Por favor informe um nome para cadastro da carteira</p>
            <div class="botoes">
                <button class="cadastrar" @click="cadastroCarteira(); $emit('mostrarModal')">Cadastrar</button>
                <button @click="$emit('mostrarModal')" class="voltar">Voltar</button>
            </div>
        </div>
</template>

<style scoped>
p.alert {
    color: red;
    font-size: small;
    text-align: center;
}

button.cadastrar, button.voltar {
    background-color: transparent;
    color: ghostwhite;
    border-color: ghostwhite;
    margin: 10px;
    margin-right: 4%;
}

button.cadastrar:hover, button.voltar:hover {
    color: black;
    border-color: black;
    background-color: ghostwhite;
    transition: 0.3s;
}

div.conteudo {
    padding: 20% 20% 20% 20%;
    position: absolute;
    text-align: center;
    white-space: nowrap;
    border: 1px solid black;
    border-radius: 25px;
    background: linear-gradient(135deg, #055db6 10%, #8ecdd3, #6755d1);
    outline: 100vw solid rgba(0, 0, 0, .65);
}   

a.fechar {
    left: 14%;
    position: relative;
    color: ghostwhite;
    cursor: pointer;
}

div.botoes {
    padding: 5%;
}

div.titulo {
    font-size: x-large;
}

label {
    padding-top: 10%;
    display: block;
    font-size: large;
}

input {
    padding-bottom: 2%;
}
</style>