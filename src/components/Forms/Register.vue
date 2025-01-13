<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../UI/Header.vue';
import axios from 'axios';

const router =  useRouter();
let maxPass = ref(false);
let minPass = ref(false);
let numLetter = ref(false)
let like = ref(false);
let email = ref('');
let senha = ref('');
let senha2 = ref('');

function validarCadastrar() {
    if (senha.value.length > 20) {
        maxPass.value = true;
    } else {
        maxPass.value = false;
    }
    
    if (senha.value.length < 8) {
        minPass.value = true;
    } else {
        minPass.value = false;
    } 
    
    if (!senha.value.match(/\d/) || !senha.value.match(/[A-Z]/)) {
        numLetter.value = true;
    } else {
        numLetter.value = false;
    } 
    
    if (senha.value != senha2.value) {
        like.value = true;
    } else {
        like.value = false;
    }
}

async function register() {
    if (maxPass.value == true || minPass.value == true || numLetter.value == true || like.value == true || email.value == '' || senha.value == '') {
        alert("Verifique os campos informados e tente novamente!");
    } else {
        let dados = new URLSearchParams();
        dados.append('email', email.value);
        dados.append('senha', senha.value);
        await axios.post('http://localhost:8080/users_register', dados).then((res) => {
            console.log(res)
            if (res.status == 200) {
                router.push('menu');
            }

            if(localStorage.getItem('usID') != res.data.userID) {
                localStorage.clear();
                localStorage.setItem('usID', res.data.userID);
                localStorage.setItem('exp', res.data.exp);
            } else {
                localStorage.setItem('usID', res.data.userID);
                localStorage.setItem('exp', res.data.exp);
            }
        }).catch((err) => {
            alert(err.response.data);
            console.log(err)
        });
    };
}

function showHide() {
    let element1 = (<HTMLInputElement>document.getElementById("password")).type;
    if (element1 == "password") {
        (<HTMLInputElement>document.getElementById("password")).type = "text";
        (<HTMLInputElement>document.getElementById("password_confirm")).type = "text";
    } else {
        (<HTMLInputElement>document.getElementById("password")).type = "password";
        (<HTMLInputElement>document.getElementById("password_confirm")).type = "password";
    }
}

</script>

<template>
    <Header></Header> 
        <p class="titulo">Cadastre-se</p>
        <div class="conteudo">
            <label for="email">Email:</label>
            <input type="email" name="email" v-model="email" required>
            <label for="password">Digite sua senha:</label>
            <input type="password" name="senha" id="password" v-on:keyup="validarCadastrar" v-model="senha" required>
            <p class="alert" v-show="maxPass">- Senha deve ter no máximo 20 caracteres.</p>
            <p class="alert" v-show="minPass">- Senha deve ter no mínimo 8 caracteres.</p>
            <p class="alert" v-show="numLetter">- Senha deve ter pelo menos um número e letra maiúscula</p>
            <label for="password_confirm">Digite a senha novamente:</label>
            <p class="alert" v-show="like">- As senhas devem ser iguais</p>
            <input type="password" id="password_confirm" v-on:keyup="validarCadastrar" v-on:keypress.enter="register" v-model="senha2" required>
            <div class="pass">
                <input type="checkbox" id="showPass" :onkeypress="showHide" :onclick="showHide">
                <label for="showPass" class="passLabel">Mostrar Senha</label>
            </div>
        </div>
        <div class="registro">
            <button class="cadastro" type="button" :onclick="register">Cadastrar</button>
        </div>
        
        
        <p>Já é cadastrado? Faça o seu <RouterLink to="/login">login</RouterLink></p>
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

    label.passLabel {
        white-space: nowrap;
        cursor: pointer;
    }
    
    p.titulo {
        color: whitesmoke;
        text-align: center;
        font-size: xx-large;
        padding: 5%;
    }

    button.cadastro {
        background-color: transparent;
        color: ghostwhite;
        border-color: ghostwhite;
        margin: 10px;
    }

    button.cadastro:hover, button.cadastro:focus {
        color: black;
        border-color: black;
        background-color: ghostwhite;
        transition: 0.3s;
    }

    p.alert {
        color: red;
        font-size: small;
        text-align: center;
    }
</style>