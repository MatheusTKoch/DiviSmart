<script setup lang="ts">
import { ref } from 'vue';
import { onMounted } from 'vue';
import Header from '../UI/Header.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

onMounted(() => {
    verifyUser();
})

const router = useRouter()
let email = ref('');
let senha = ref('');

function verifyUser() {
    axios.post('http://localhost:3000/session', {
        usID: localStorage.getItem('usID'),
        sID: localStorage.getItem('sID'),
        exp: localStorage.getItem('exp')
    }).then((res) => {
        if (res.status == 200) {
            router.push('menu');
        }
        console.log(res);
    }).catch((err) => {
        if(err.response.data == 'Sessao expirada' && err.response.status == 401) {
            localStorage.removeItem('usID');
            localStorage.removeItem('exp');
            localStorage.removeItem('sID');
        }
    });
}

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
        await axios.post('http://localhost:3000/users_login', dados).then((res) => {
            if (res.status == 200) {
                router.push('menu');
            }

            if(localStorage.getItem('usID') != res.data.usID) {
                localStorage.clear();
                localStorage.setItem('usID', res.data.usID);
                localStorage.setItem('exp', res.data.exp);
                localStorage.setItem('sID', res.data.sID);
            } else if (localStorage.getItem('usID') == res.data.usID){
                localStorage.setItem('exp', res.data.exp);
                localStorage.setItem('sID', res.data.sID);
            } else {
                localStorage.setItem('usID', res.data.usID);
                localStorage.setItem('exp', res.data.exp);
                localStorage.setItem('sID', res.data.sID);
            }
        }).catch(err => {
            alert(err.response.data);
            console.log(err);
        });
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
            <button class="login" type="button" :onclick="login">Login<svg class="login_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>
            </button>
        </div>
        <p>Não é cadastrado? Faça o seu <RouterLink to="/register">cadastro</RouterLink></p>
</template>

<style scoped>
    a.voltar_icon {
        cursor: pointer;
        position: relative;
        top: 5vh;
        left: 5vw;
    }

    svg.login_icon {
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
        background-color: transparent;
        color: ghostwhite;
        border-color: ghostwhite;
        margin: 10px;
    }

    button.login:hover, button.login:focus {
        color: black;
        border-color: black;
        background-color: ghostwhite;
        transition: 0.3s;
    }

    button.login:hover svg.login_icon {
        fill: black;
        transition: 0.3s;
    }

    @media screen and (max-width: 480px) {
        p.titulo {
            font-size: x-large;
            padding-bottom: 0;
        }

        button.login {
            font-size: medium;
        }

        input {
            width: 40%;
        }
    }
</style>