<script setup lang="ts">
import Header from './Header.vue';
</script>

<template>
    <Header></Header>
    <form>
        <p class="titulo">Cadastre-se</p>
        <div class="conteudo">
        <label for="email">Email:</label>
        <input type="email" name="email">
        <label for="password">Digite sua senha:</label>
        <input type="password" name="password">
        <label for="password_confirm">Digite a senha novamente:</label>
        <input type="password" name="password_confirm">
        </div>
        <button class="cadastro">Cadastrar</button>
        <p>Já é cadastrado? Faça o seu login</p>
    </form>
</template>

<style scoped>
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
</style>