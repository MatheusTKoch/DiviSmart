<script setup lang="ts">
let menu = false;
let carteira = false;
let dividendos = false;
let relatorios = false;

function underlineSelect(element: string) {
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
        <li>
            <svg class="menu_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
            <RouterLink class="teste" @click="underlineSelect('menu')" :style="menu ? 'text-decoration: underline' : 'text-decoration: none'" to="/menu">Menu</RouterLink>
        </li>
        <li>
            <svg class="carteira_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
            <path d="M200-200v-560 560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v100h-80v-100H200v560h560v-100h80v100q0 33-23.5 56.5T760-120H200Zm320-160q-33 0-56.5-23.5T440-360v-240q0-33 23.5-56.5T520-680h280q33 0 56.5 23.5T880-600v240q0 33-23.5 56.5T800-280H520Zm280-80v-240H520v240h280Zm-160-60q25 0 42.5-17.5T700-480q0-25-17.5-42.5T640-540q-25 0-42.5 17.5T580-480q0 25 17.5 42.5T640-420Z"/></svg>
            <RouterLink @click="underlineSelect('carteira')" :style="carteira ? 'text-decoration: underline' : 'text-decoration: none'" to="/menu/carteira">Carteira</RouterLink>
        </li>
        <li>
            <svg class="dividendos_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
            <path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            <RouterLink @click="underlineSelect('dividendos')" :style="dividendos ? 'text-decoration: underline' : 'text-decoration: none'" to="/menu/dividendos">Dividendos</RouterLink>
        </li>
        <li>
            <svg class="relatorios_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
            <path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"/></svg>
            <RouterLink @click="underlineSelect('relatorios')" :style="relatorios ? 'text-decoration: underline' : 'text-decoration: none'" to="/menu/relatorios">Relatórios</RouterLink>
        </li>
    </ul>
</div>
</template>

<style scoped>
svg.menu_icon, svg.carteira_icon, svg.dividendos_icon, svg.relatorios_icon {
    position: relative;
    top: 0.75vh;
}

a {
    text-decoration: none;
    color: whitesmoke;
}

a:hover {
    color: rgba(123, 104, 238, 1);
    transition: 0.3s;
}

a:hover svg {
    fill: black;
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