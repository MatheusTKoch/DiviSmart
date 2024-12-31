<script setup lang="ts">

</script>

<template>
<div class="sidebar">
    <ul class="lista">
        <li><RouterLink to="/menu/carteira">Carteira</RouterLink></li>
        <li><RouterLink to="/menu/dividendos">Dividendos</RouterLink></li>
        <li><RouterLink to="/menu/relatorios">Relatórios</RouterLink></li>
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