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
        await axios.post('http://localhost:8080/users_login', dados).then(res => console.log(res)).catch(err => console.log(err));
    }
}
</script>

<template>
    <Header></Header>
    <form method="post">
        <p class="titulo">Login</p>
        <div class="conteudo">
        <label for="email">Email:</label>
        <input type="email" name="email" v-model="email" required>
        <label for="password">Senha:</label>
        <input type="password" name="password" id="password" v-model="senha" required>
        <div class="pass">
        <input type="checkbox" name="showPass" :onkeypress="showHide" :onclick="showHide"> 
        <label for="showPass" class="passLabel">Mostrar Senha</label>
        </div>
        </div>
        <button class="login" :onclick="login">Login</button>
        <p>Não é cadastrado? Faça o seu <RouterLink to="/register">cadastro</RouterLink></p>
    </form>
</template>

<style scoped>
    a {
        text-decoration: none;
        color: darkblue;
    }

    div.pass {
        display: inline-flex;
    }

    label.passLabel {
        white-space: nowrap;
    }

    form {
        color: whitesmoke;
        text-align: center;
        transform: translateY(50%);
    }

    input {
        display: block;
        margin: auto;
        width: 18%;
        font-size: large;
        padding: 4px;
    }

    label {
        display: block;
        text-align: center;
        font-size: large;
        padding: 4px;
    }

    p.titulo {
        font-size: xx-large
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