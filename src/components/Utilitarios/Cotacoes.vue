<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted, nextTick } from 'vue';

let dadosCotacao = ref()

onMounted(() => {
    loadCotacoes();
})

function loadCotacoes() {
    axios.post('http://localhost:3000/cotacoes_load').then((res) => {
        nextTick(() => {
            dadosCotacao.value = res.data;
        })
    }).catch((err) => {
        console.log(err)
    });
}
</script>

<template>
    <div class="conteudo">
        <h3>Cotações Atualizadas:</h3>
        <ol v-for="cot of dadosCotacao">
            <li>{{ cot.Ativo }}: {{ cot.Ativo == 'Ouro/USD' ? '$' : 'R$' }}{{ cot.ValorAtual }}</li>
        </ol>
    </div>
</template>

<style scoped>
div.conteudo {
    position: absolute;
    transform: translate(45vw, -5vh);
}

li {
    list-style: none;
}
</style>