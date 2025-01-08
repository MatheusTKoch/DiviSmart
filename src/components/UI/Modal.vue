<script setup lang="ts">

</script>

<template>
    <div class="conteudo">
        <div class="titulo">Cadastro de Carteiras</div>
        <label for="nomeCarteira">Nome da Carteira</label>
        <input type="text" id="nomeCarteira">
        <div class="botoes">
            <button>Cadastrar</button>
            <button @click="$emit('mostrarModal')">Voltar</button>
        </div>
    </div>
</template>

<style scoped>
div.conteudo {
    position: relative;
    text-align: center;
}

div.titulo {
    font-size: large;
}

label {
    font-size: large;
}
</style>