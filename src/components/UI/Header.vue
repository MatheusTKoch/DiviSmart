<script setup lang="ts">
defineProps({
    showLogin: Boolean,
    showPerfil: Boolean
});

function clearUser() {
    localStorage.removeItem('usID');
    localStorage.removeItem('exp');
    localStorage.removeItem('sID');
}
</script>

<template>
 <div class="header">
    <div class="titulo"><RouterLink class="titulo1" to="/">DiviSmart</RouterLink></div>
    <button class="login" v-if="showLogin"><RouterLink class="titulo2" to="/login">Login</RouterLink></button>
    <button class="login" v-if="showPerfil" @click="clearUser"><RouterLink class="titulo2" to="/login">Sair</RouterLink></button>
    <div class="border" v-if="showPerfil"></div>
 </div>
</template>

<style scoped>
a.titulo1 {
    text-decoration: none;
    color: whitesmoke;
}

a.titulo2 {
    text-decoration: none;
    color: inherit;
}

button.login {
    background-color: transparent;
    position: relative;
    left: 170vh;
    top: -2vh;
    color: ghostwhite;
    border-color: ghostwhite;
}

button.login:hover {
    color: black;
    border-color: black;
    background-color: ghostwhite;
    transition: 0.3s;
}

div.titulo {
    color: ghostwhite;
    position: relative;
    left: 10vh;
    top: 2vh;
    font-weight: 800;
    font-size: x-large;
    margin: 0;
    padding: 0;
}

div.header {
    width: 100%;
    min-height: 5vh;
    display: inline;
}

div.border {
    border-bottom: 1px black solid;
    padding: 0.5vh;
}
</style>