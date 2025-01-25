<script setup lang="ts">

</script>

<template>
<div class="conteudo">
    <svg @click="$emit('editarCarteira')" class="voltar_icon" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
        <path d="m287-446.67 240 240L480-160 160-480l320-320 47 46.67-240 240h513v66.66H287Z"/>
    </svg>
    <div class="acoes">
        <h2>Ações</h2>
        <hr>
        <div class="dados_acoes">

        </div>
    </div>
    <div class="fiis">
        <h2>Fundos Imobiliários</h2>
        <hr>
        <div class="dados_fiis">
            
        </div>
    </div>
</div>

</template>

<style scoped>
svg.voltar_icon {
    position: relative;
    transform: translate(-30vh, -8vh);
    cursor: pointer;
    margin-left: 5vh;
}

</style>