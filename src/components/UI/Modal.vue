<script setup lang="ts">

</script>

<template>
    <div class="conteudo">
        <div class="titulo">Cadastro de Carteiras<a class="fechar" @click="$emit('mostrarModal')">X</a></div>
        <label for="nomeCarteira">Nome da Carteira: </label>
        <input type="text" id="nomeCarteira">
        <div class="botoes">
            <button class="cadastrar">Cadastrar</button>
            <button @click="$emit('mostrarModal')" class="voltar">Voltar</button>
        </div>
    </div>
</template>

<style scoped>
div.conteudo {
    padding: 30%;
    position: relative;
    text-align: center;
    white-space: nowrap;
    border: 1px solid black;
    border-radius: 20px;
    background-image: linear-gradient(180deg, rgba(17,43,148,1) 2%, rgba(0,239,255,1) 100%);
}   

a.fechar {
    left: 20%;
    position: relative;
    color: ghostwhite;
    cursor: pointer;
}

div.botoes {
    padding: 5%;
}

div.titulo {
    font-size: x-large;
}

label {
    font-size: large;
}
</style>