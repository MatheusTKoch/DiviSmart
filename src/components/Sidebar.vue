<script setup lang="ts">
let menu = false;
let carteira = false;
let dividendos = false;
let relatorios = false;

function underlineSelect(element: String) {
    if (element == 'menu') {
        menu = true;
        carteira = false;
        dividendos = false;
        relatorios = false;
        element = '';
    } else if (element == 'carteira') {
        menu = false;
        carteira = true;
        dividendos = false;
        relatorios = false;
        element = '';
    } else if (element == 'dividendos') {
        menu = false;
        carteira = false;
        dividendos = true;
        relatorios = false;
        element = '';
    } else if (element == 'relatorios') {
        menu = false;
        carteira = false;
        dividendos = false;
        relatorios = true;
        element = '';
    }
}
</script>

<template>
<div class="sidebar">
    <ul class="lista">
        <li><RouterLink @click="underlineSelect('menu')" :style="menu ? 'text-decoration: underline' : 'text-decoration: none'" to="/menu">Menu</RouterLink></li>
        <li><RouterLink @click="underlineSelect('carteira')" :style="carteira ? 'text-decoration: underline' : 'text-decoration: none'" to="/menu/carteira">Carteira</RouterLink></li>
        <li><RouterLink @click="underlineSelect('dividendos')" :style="dividendos ? 'text-decoration: underline' : 'text-decoration: none'" to="/menu/dividendos">Dividendos</RouterLink></li>
        <li><RouterLink @click="underlineSelect('relatorios')" :style="relatorios ? 'text-decoration: underline' : 'text-decoration: none'" to="/menu/relatorios">Relatórios</RouterLink></li>
    </ul>
</div>
</template>

<style scoped>
a {
    text-decoration: none;
    color: whitesmoke;
}

a:hover {
    color: blue;
}

div.sidebar {
    position: relative;
    width: 14vw;
    border-right: 1px solid black;
    height: 100vh;
}

ul.lista {
    margin-top: 0;
    min-width: 10vw;
    text-align: left;
    padding-top: 2vh;
    bottom: 10%;
}


li {
    list-style-type: none;
    color: ghostwhite;
    font-size:calc(100% + 0.25vw);
}
</style>