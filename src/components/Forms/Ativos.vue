<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';

let acoes = ref();
let fii = ref();

onMounted(() => {
    loadAtivos();
})

function loadAtivos() {
    axios.post('http://localhost:8080/ativos_load').then((res) => {
        console.log(res);
        acoes.value = res.data.acoes;
        fii.value = res.data.fii;
    }).catch((err) => {
        console.log(err);
    })
}
</script>

<template>
<div class="return">
    <svg @click="$emit('editarCarteira')" class="voltar_icon" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
        <path d="m287-446.67 240 240L480-160 160-480l320-320 47 46.67-240 240h513v66.66H287Z"/>
    </svg>
</div>
<div class="conteudo">
    <h2 class="titulo_carteira">Editar Carteira</h2>
    <div class="acoes">
        <h2 class="acoes">Ações<hr></h2>
        <div class="dados_acoes">
            <table>
                <tr class="titulo">
                    <th scope="col">Ticker</th>
                    <th scope="col">Valor Investido</th>
                    <th scope="col">Quantidade</th>
                </tr>
                <tr>
                    <th scope="row">
                    <select >
                        <option v-for="ac in acoes" :value="ac.Ticker">{{ ac.Ticker }}</option>
                    </select>
                    </th>
                    <th scope="row"><input type="text"></input></th>
                    <th scope="row"><input type="text"></input></th>
                    <button class="salvar_acoes">Salvar</button>
                </tr>
            </table>
        </div>
    </div>
    <div class="fiis">
        <h2 class="fii">Fundos Imobiliários<hr></h2>
        <div class="dados_fiis">
            <table>
                <tr class="titulo">
                    <th scope="col">Ticker</th>
                    <th scope="col">Valor Investido</th>
                    <th scope="col">Quantidade</th>
                </tr>
                <tr>
                    <th scope="row">
                    <select >
                        <option v-for="fi in fii" :value="fi.Ticker">{{ fi.Ticker }}</option>
                    </select>
                    </th>
                    <th scope="row"><input type="text"></input></th>
                    <th scope="row"><input type="text"></input></th>
                    <button class="salvar_fii">Salvar</button>
                </tr>
            </table>
        </div>
    </div>
</div>

</template>

<style scoped>
button.salvar_acoes, button.salvar_fii {
    padding: 0.2vw;
    font-size: large;
    margin-left: 1vw;
}

tr.titulo {
    font-size: large;
}

h2.titulo_carteira, h2.acoes, h2.fii {
    transform: translateX(9vw);
}

div.conteudo {
    position: relative;
    text-align: center;
    width: 10vw;
    transform: translateX(10vw);
}

div.return {
    position: relative;
    transform: translate(-30vh, -8vh);
    cursor: pointer;
    margin-left: 5vh;
}

div.acoes {
    left: 10vw;
}

div.fiis {
    left: 10vw;
}
</style>