<script setup lang="ts">
import Header from './Header.vue';
</script>

<template>
    <Header></Header>
    <form>
        <p class="titulo">Login</p>
        <div class="conteudo">
        <label for="email">Email:</label>
        <input type="email" name="email">
        <label for="password">Senha:</label>
        <input type="password" name="password">
        </div>
        <button class="cadastro">Login</button>
        <p>Não é cadastrado? Faça o seu <RouterLink to="/register">cadastro</RouterLink></p>
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