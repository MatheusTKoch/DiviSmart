<script setup lang="ts">
import Header from './Header.vue';
import mysql from 'mysql2';
import dotEnv from 'dotenv';

dotEnv.config();

const connection = mysql.createConnection({
    host: "localhost",
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB
});

connection.connect((err) => {
    if (err) {
        console.log("Erro na conexao: " + err.message);
    } else {
        console.log("Conexao ok");
    }
});

let sql = `INSERT INTO users (email, password) VALUES (teste@teste.com.br, teste1234)`;

function register() {
    connection.query(sql);
    connection.end();
};

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
    <form>
        <p class="titulo">Cadastre-se</p>
        <div class="conteudo">
        <label for="email">Email:</label>
        <input type="email" name="email">
        <label for="password">Digite sua senha:</label>
        <input type="password" name="password" id="password">
        <label for="password_confirm">Digite a senha novamente:</label>
        <input type="password" name="password_confirm" id="password_confirm">
        <div class="pass">
        <input type="checkbox" name="showPass" :onkeypress="showHide" :onclick="showHide">
        <label for="showPass" class="passLabel">Mostrar Senha</label>
        </div>
        </div>
        <button class="cadastro" @click="register">Cadastrar</button>
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
</style>