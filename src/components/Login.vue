<script setup lang="ts">
import { ref } from 'vue';
import Header from './Header.vue';
import axios from 'axios';

let email = ref('');
let senha = ref('');

function showHide() {
    let element = (<HTMLInputElement>document.getElementById("password")).type;
    if (element == "password") {
        (<HTMLInputElement>document.getElementById("password")).type = "text";
    } else {
        (<HTMLInputElement>document.getElementById("password")).type = "password";
    }
}

async function login() {
    if(email.value === '' || senha.value === '') {
        alert("Verifique os campos informados e tente novamente!");
    } else {
        let dados = new URLSearchParams();
        dados.append('email', email.value);
        dados.append('senha', senha.value);
        await axios.post('http://localhost:8080/users_login', dados).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }
}
</script>

<template>
    <Header></Header>
        <p class="titulo">Login</p>
            <div class="conteudo">
                <label for="email">Email:</label>
                <input type="email" name="email" v-model="email" required>
                <label for="password">Senha:</label>
                <input type="password" name="password" id="password" v-on:keypress.enter="login" v-model="senha" required>
            <div class="pass">
                <input type="checkbox" id="showPass" name="showPass" :onkeypress="showHide" :onclick="showHide"> 
                <label for="showPass" class="passLabel">Mostrar Senha</label>
            </div>
        </div>
        <div class="registro">
            <button class="login" type="button" :onclick="login">Login</button>
        </div>
        <p>Não é cadastrado? Faça o seu <RouterLink to="/register">cadastro</RouterLink></p>
</template>

<style scoped>
    a {
        text-decoration: none;
        color: darkblue;
    }

    p {
        color: whitesmoke;
        text-align: center;
    }

    div.pass {
        display: inline-flex;
    }

    div.conteudo {
        text-align: center;
    }

    div.registro {
        display: flex;
        justify-content: center;
    }

    label.passLabel {
        white-space: nowrap;
        cursor: pointer;
    }

    input {
        display: block;
        margin: auto;
        width: 18%;
        font-size: large;
        padding: 4px;
    }

    label {
        color: whitesmoke;
        display: block;
        text-align: center;
        font-size: large;
        padding: 4px;
    }

    p.titulo {
        color: whitesmoke;
        font-size: xx-large;
        padding: 5%;
    }
    
    button.login {
        margin: 10px;
    }

    button.login:hover {
        color: black;
        border-color: black;
        background-color: ghostwhite;
        transition: 0.3s;
    }
</style>