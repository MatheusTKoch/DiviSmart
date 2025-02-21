<script setup lang="ts">
import axios from 'axios';
import Toast from '../UI/Toast.vue';
import { ref, onMounted, nextTick } from 'vue';

let acoes = ref();
let fii = ref();
let tesouro = ref();
let cartNome = ref('');
let quantidadeAcao = ref();
let valorInvestidoAcao = ref();
let idAcao = ref();
let quantidadeFii = ref();
let valoInvestidoFii = ref();
let idFii = ref();
let idTesouro = ref();
let quantidadeTesouro = ref();
let valorInvestidoTesouro = ref();
let showToast = ref(false);       
let isSuccess = ref(false);       
let isError = ref(false);         
let toastMessage = ref(''); 
let dadosCarteira = ref();


onMounted(() => {
    loadAtivos();
    loadDados();
    loadDadosCarteira();
})

function loadDadosCarteira() {
    axios.post('http://localhost:8080/carteira_dados', {
        cID: sessionStorage.getItem('cID')
    }).then((res) => {
        console.log(res.data)
        nextTick(() => {
            dadosCarteira.value = res.data;
        })
    }).catch((err) => {
        console.log(err);
    });
};

function exibirToast(mensagem: string, sucesso: boolean) {
  toastMessage.value = mensagem;
  isSuccess.value = sucesso;
  isError.value = !sucesso;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

function cadastroAcao() {
  if (idAcao.value == undefined || quantidadeAcao.value == undefined || valorInvestidoAcao.value == undefined) {
    exibirToast('Verifique os campos informados e tente novamente!', false);
  } else if (isNaN(quantidadeAcao.value) || isNaN(valorInvestidoAcao.value)) {
    exibirToast('O valor investido e quantidade devem ser números!', false);
  } else {
    axios.post('http://localhost:8080/acoes_cadastro', {
        quantidade: quantidadeAcao.value,
        valorInvestido: valorInvestidoAcao.value,
        cID: sessionStorage.getItem('cID'),
        acaoID: idAcao.value
    }).then((res) => {
        console.log(res);
        exibirToast('Ativo cadastrado com sucesso!', true);
    }).catch((err) => {
        console.log(err);
        exibirToast('Erro no cadastro!', false);
    });
    }
}

function cadastroFii() {
    if (idFii.value == undefined || quantidadeFii.value == undefined || valoInvestidoFii.value == undefined) {
        exibirToast('Verifique os campos informados e tente novamente!', false);
    } else if (isNaN(quantidadeFii.value) || isNaN(valoInvestidoFii.value)) {
        exibirToast('O valor investido e quantidade devem ser informados somente com números, verifique e tente novamente!', false);
    } else {
        axios.post('http://localhost:8080/fii_cadastro', {
            quantidade: quantidadeFii.value,
            valorInvestido: valoInvestidoFii.value,
            cID: sessionStorage.getItem('cID'),
            fiiID: idFii.value
        }).then((res) => {
            console.log(res);
            exibirToast('Ativo cadastrado com sucesso!', true);
        }).catch((err) => {
            console.log(err);
        })
    }
}

function cadastroTesouro() {
    if (idTesouro.value == undefined || quantidadeTesouro.value == undefined || valorInvestidoTesouro.value == undefined) {
        exibirToast('Verifique os campos informados e tente novamente!', false);
    } else if (isNaN(quantidadeTesouro.value) || isNaN(valorInvestidoTesouro.value)) {
        exibirToast('O valor investido e quantidade devem ser informados somente com números, verifique e tente novamente!', false);
    } else {
        axios.post('http://localhost:8080/tesouro_cadastro', {
            quantidade: quantidadeTesouro.value,
            valorInvestido: valorInvestidoTesouro.value,
            cID: sessionStorage.getItem('cID'),
            tesID: idTesouro.value
        }).then((res) => {
            console.log(res);
            exibirToast('Ativo cadastrado com sucesso!', true);
        }).catch((err) => {
            console.log(err);
        })
    }
}

function loadAtivos() {
    axios.post('http://localhost:8080/ativos_load').then((res) => {
        acoes.value = res.data.acoes;
        fii.value = res.data.fii;
        tesouro.value = res.data.tesouro;
    }).catch((err) => {
        console.log(err);
    })
}

function loadDados() {
    axios.post('http://localhost:8080/carteira_name', {
        userID: localStorage.getItem('usID'),
        cID: sessionStorage.getItem('cID')
    }).then((res) => {
        cartNome.value = res.data[0].Nome;
    }).catch((err) => {
        console.log(err);
    })
}

function recarregar() {
    window.location.reload();
}
</script>

<template>
<div class="return">
    <svg @click="recarregar()" class="voltar_icon" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
        <path d="m287-446.67 240 240L480-160 160-480l320-320 47 46.67-240 240h513v66.66H287Z"/>
    </svg>
</div>
<div class="dados_carteira">Valor Total Investido: R$ {{ dadosCarteira?.valores?.[0]?.['sum(ValorInvestido)'] }} Quantidade de Ativos: {{ dadosCarteira?.quantidade?.[0]?.['count(ValorInvestido)'] }}</div>
<div class="conteudo">
    <h2 class="titulo_carteira">Editar Carteira - {{ cartNome }}</h2>
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
                    <select v-model="idAcao">
                        <option v-for="ac in acoes" :value="ac.AcaoID" :v-model="ac.AcaoID">{{ ac.Ticker }}</option>
                    </select>
                    </th>
                    <th scope="row"><input type="number" placeholder="R$" v-model="valorInvestidoAcao"></input></th>
                    <th scope="row"><input type="number" v-model="quantidadeAcao"></input></th>
                    <button class="salvar_acoes" @click="cadastroAcao()">Salvar</button>
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
                    <select v-model="idFii">
                        <option v-for="fi in fii" :value="fi.FundoImobiliarioID" :v-model="fi.FundoImobiliarioID" >{{ fi.Ticker }}</option>
                    </select>
                    </th>
                    <th scope="row"><input type="number" placeholder="R$" v-model="valoInvestidoFii"></input></th>
                    <th scope="row"><input type="number" v-model="quantidadeFii"></input></th>
                    <button class="salvar_fii" @click="cadastroFii()">Salvar</button>
                </tr>
            </table>
        </div>
    </div>
    <div class="tesouros">
        <h2 class="tesouro">Tesouro Direto<hr></h2>
        <div class="dados_tesouro">
            <table>
                <tr class="titulo">
                    <th scope="col">Ticker</th>
                    <th scope="col">Valor Investido</th>
                    <th scope="col">Quantidade</th>
                </tr>
                <tr>
                    <th scope="row">
                    <select v-model="idTesouro">
                        <option v-for="tes in tesouro" :value="tes.TesouroID" :v-model="tes.TesouroID" >{{ tes.Descricao }}</option>
                    </select>
                    </th>
                    <th scope="row"><input type="number" placeholder="R$" v-model="valorInvestidoTesouro"></input></th>
                    <th scope="row"><input type="number" v-model="quantidadeTesouro"></input></th>
                    <button class="save_tesouro" @click="cadastroTesouro()">Salvar</button>
                </tr>
            </table>
        </div>
    </div>
    <teleport to="body">
        <Toast v-if="showToast" :sucesso="isSuccess">
        {{ toastMessage }}
        </Toast>
    </teleport>    
</div>
</template>

<style scoped>
div.dados_carteira {
    font-size: large;
    white-space: nowrap;
    transform: translateX(12vw);
}

button.salvar_acoes, button.salvar_fii, button.save_tesouro {
    padding: 0.2vw;
    font-size: large;
    margin-left: 1vw;
}

tr.titulo {
    font-size: large;
}

 h2.acoes, h2.fii, h2.tesouro {
    transform: translateX(9vw);
}

h2.titulo_carteira {
    white-space: nowrap;
    transform: translate(4vw, -10vh);
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

div.acoes, div.fiis, div.tesouros {
    left: 10vw;
}

div.dados_tesouro {
    transform: translateX(-5vw);
}
</style>