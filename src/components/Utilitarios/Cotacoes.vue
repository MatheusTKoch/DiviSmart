<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';

let dadosCotacao = ref()

onMounted(() => {

})

function loadCotacoes() {
    axios.post('http://localhost:8080/cotacoes_load').then((res) => {
        console.log(res.data)
    }).catch((err) => {
        console.log(err)
    });
}

</script>

<template>
    <div class="conteudo">

    </div>
</template>

<style scoped>

</style>