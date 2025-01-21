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

button.cadastrar {
    margin-right: 4%;
}

div.conteudo {
    
    padding: 30% 30% 20% 30%;
    position: relative;
    text-align: center;
    white-space: nowrap;
    border: 1px solid black;
    border-radius: 20px;
    background-image: linear-gradient(180deg, rgba(17,43,148,1) 2%, rgba(0,239,255,1) 100%);
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