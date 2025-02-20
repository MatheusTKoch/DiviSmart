<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';

let dadosCotacao = ref()

onMounted(() => {
    loadCotacoes();
})

function loadCotacoes() {
    axios.post('http://localhost:8080/cotacoes_load').then((res) => {
        console.log(res.data)
        dadosCotacao.value = res.data;
    }).catch((err) => {
        console.log(err)
    });
}

</script>

<template>
    <div class="conteudo">
        <h3>Cotações Atualizadas (atualizado as {{ new Date(dadosCotacao[0].DataAtualizacao).getHours() }}:{{ new Date(dadosCotacao[0].DataAtualizacao).getMinutes() }}):</h3>
        <ol>
            <li>{{ dadosCotacao[0].Ativo }}: R${{ dadosCotacao[0].ValorAtual }}</li>
            <li>{{ dadosCotacao[1].Ativo }}: R${{ dadosCotacao[1].ValorAtual }}</li>
            <li>{{ dadosCotacao[2].Ativo }}: ${{ dadosCotacao[2].ValorAtual }}</li>
        </ol>
    </div>
</template>

<style scoped>
div.conteudo {
    position: absolute;
    transform: translateX(40vw);
}

li {
    list-style: none;
}
</style>