<script setup lang="ts">
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
    showLogin: Boolean,
    showPerfil: Boolean
});

function clearUser() {
    axios.post('http://localhost:3000/logout', {
        usID: localStorage.getItem('usID'),
        sID: localStorage.getItem('sID')
    }).then((res) => {
        if(res.status == 200) {
            localStorage.removeItem('usID');
            localStorage.removeItem('exp');
            localStorage.removeItem('sID');

            router.push('/login');
        }
        console.log(res);
    }).catch((err) => {
        console.log(err);
    })
    
}
</script>

<template>
 <div class="header">
    <div class="titulo"><RouterLink class="titulo1" to="/">DiviSmart</RouterLink></div>
    <button class="login" v-if="showLogin"><RouterLink class="titulo2" to="/login">Login</RouterLink></button>
    <button class="login" v-if="showPerfil" @click="clearUser">
        <RouterLink class="titulo2" to="/login">Sair<svg class="logout_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
        </RouterLink>
    </button>
    <div class="border" v-if="showPerfil"></div>
 </div>
</template>

<style scoped>
svg.logout_icon {
    position: relative;
    top: 0.75vh;
}

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

button.login:hover svg.logout_icon {
    fill: black;
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

@media screen and (max-width: 480px) {
    div.titulo {
        font-size: large;
    }

    button.login {
        left: 70vw;
        font-size: medium;
        padding: 5px;
    }

    svg.logout_icon {
        top: 0.75vh;
    }
}
</style>