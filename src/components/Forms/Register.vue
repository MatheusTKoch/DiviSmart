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
let nameUndername = ref(false);
let email = ref('');
let nome = ref('');
let sobrenome = ref('')
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

    if (nome.value == '' || sobrenome.value == '') {
        nameUndername.value = true;
    } else {
        nameUndername.value = false;
    }
}

async function register() {
    if (maxPass.value == true || minPass.value == true || numLetter.value == true || like.value == true || email.value == '' || senha.value == '') {
        alert("Verifique os campos informados e tente novamente!");
    } else {
        let dados = new URLSearchParams();
        dados.append('email', email.value);
        dados.append('senha', senha.value);
        dados.append('nome', nome.value);
        dados.append('sobrenome', sobrenome.value);
        await axios.post('http://localhost:3000/users_register', dados).then((res) => {
            if (res.status == 200) {
                router.push('menu');
            }

            if(localStorage.getItem('usID') != res.data.usID) {
                localStorage.clear();
                localStorage.setItem('usID', res.data.usID);
                localStorage.setItem('exp', res.data.exp);
                localStorage.setItem('sID', res.data.sID);
            }  else {
                localStorage.setItem('usID', res.data.usID);
                localStorage.setItem('exp', res.data.exp);
                localStorage.setItem('sID', res.data.sID);
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
        <a @click="router.push('/')" class="voltar_icon"> 
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
                <path d="m287-446.67 240 240L480-160 160-480l320-320 47 46.67-240 240h513v66.66H287Z"/>
            </svg>
        </a> 
        <p class="titulo">Cadastre-se</p>
        <div class="conteudo">
            <label for="email">Email:</label>
            <input type="email" name="email" v-model="email" required>
            <label for="name">Nome:</label>
            <input type="text" name="name" v-on:keyup="validarCadastrar" v-model="nome" required>
            <label for="undername">Sobrenome:</label>
            <input type="text" name="undername" v-on:keyup="validarCadastrar" v-model="sobrenome" required>
            <label for="password">Digite sua senha:</label>
            <input type="password" name="senha" id="password" v-on:keyup="validarCadastrar" v-model="senha" required>
            <p class="alert" v-show="nameUndername">- Informe o nome e sobrenome nos campos acima</p>
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
            <button class="cadastro" type="button" :onclick="register">Cadastrar<svg class="register_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                <path d="M80-160v-112q0-33 17-62t47-44q51-26 115-44t141-18q30 0 58.5 3t55.5 9l-70 70q-11-2-21.5-2H400q-71 0-127.5 17T180-306q-9 5-14.5 14t-5.5 20v32h250l80 80H80Zm542 16L484-282l56-56 82 82 202-202 56 56-258 258ZM400-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm10 240Zm-10-320q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0-80Z"/></svg>
            </button>
        </div>
        
        
        <p>Já é cadastrado? Faça o seu <RouterLink to="/login">login</RouterLink></p>
</template>

<style scoped>
    a.voltar_icon {
        cursor: pointer;
        position: relative;
        top: 5vh;
        left: 5vw;
    }
    
    svg.register_icon {
        position: relative;
        top: 0.75vh;
    }

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
        padding: 2%;
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

    button.cadastro:hover svg.register_icon {
        fill: black;
        transition: 0.3s;
    }

    p.alert {
        color: red;
        font-size: small;
        text-align: center;
    }

    @media screen and (max-width: 480px) {
        p.titulo {
            font-size: larger;
            padding-bottom: 0;
        }

        button.cadastro {
            font-size: medium;
        }

        input {
            width: 40%;
        }
    }
</style>