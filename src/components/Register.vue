<script setup lang="ts">
import { ref } from 'vue';
import { Sequelize, DataTypes } from 'sequelize';
import { configDotenv } from 'dotenv';
import Header from './Header.vue';

let maxPass = ref(false);
let minPass = ref(false);
let numLetter = ref(false)
let like = ref(false);
let email = ref('');
let senha1 = ref('');
let senha2 = ref('');

function registrar() {
    const sequelize = new Sequelize(
        process.env.DATABASE_DB!,
        process.env.USER_DB!,
        process.env.PASSWORD_DB!,
    {
        host: 'localhost',
        dialect: 'mysql'
    });

    sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
    });

    const User = sequelize.define("users", {
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    }
    });

    sequelize.sync().then(() => {
    console.log("Tabela users criada!");
    User.create({
        Email: email.value,
        Password: senha1.value
    })
    }).catch((error) => {
    console.error("Erro ao criar tabela: ", error);
    });
}

function validarCadastrar() {
    if (senha1.value.length > 20) {
        maxPass.value = true;
    } else {
        maxPass.value = false;
    }
    
    if (senha1.value.length < 8) {
        minPass.value = true;
    } else {
        minPass.value = false;
    } 
    
    if (!senha1.value.match(/\d/) || !senha1.value.match(/[A-Z]/)) {
        numLetter.value = true;
    } else {
        numLetter.value = false;
    } 
    
    if (senha1.value != senha2.value) {
        like.value = true;
    } else {
        like.value = false;
    }
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
    <form @submit="registrar">
        <p class="titulo">Cadastre-se</p>
        <div class="conteudo">
        <label for="email">Email:</label>
        <input type="email" name="email" required>
        <label for="password">Digite sua senha:</label>
        <input type="password" name="password" id="password" v-on:keyup="validarCadastrar" v-model="senha1" required>
        <p class="alert" v-show="maxPass">- Senha deve ter no máximo 20 caracteres.</p>
        <p class="alert" v-show="minPass">- Senha deve ter no mínimo 8 caracteres.</p>
        <p class="alert" v-show="numLetter">- Senha deve ter pelo menos um número e letra maiúscula</p>
        <label for="password_confirm">Digite a senha novamente:</label>
        <p class="alert" v-show="like">- As senhas devem ser iguais</p>
        <input type="password" name="password_confirm" id="password_confirm" v-on:keyup="validarCadastrar" v-model="senha2" required>
        <div class="pass">
        <input type="checkbox" name="showPass" :onkeypress="showHide" :onclick="showHide">
        <label for="showPass" class="passLabel">Mostrar Senha</label>
        </div>
        </div>
        <button class="cadastro">Cadastrar</button>
        <p>Já é cadastrado? Faça o seu <RouterLink to="/login">login</RouterLink></p>
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
    
    button.cadastro {
        margin: 10px;
    }

    button.cadastro:hover {
        color: black;
        border-color: black;
        background-color: ghostwhite;
        transition: 0.3s;
    }

    p.alert {
        color: red;
        font-size: small;
    }
</style>