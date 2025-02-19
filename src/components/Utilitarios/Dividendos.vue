<script setup lang="ts">
import Header from '../UI/Header.vue';
import Sidebar from '../UI/Sidebar.vue';
import axios from 'axios';
import { nextTick, onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

interface DADOSGRAFICO {
    data: number;
    valor: number;
    tipo: number;
}

const router = useRouter();
let carteiras = ref();
let idCarteira = ref();
let dataInicial = ref();
let dataFinal = ref();
let showValores = ref(false);
let dadosAcoes = ref();
let dadosFii = ref();
let showGraph = ref(false);
let dadosRelatorioAcao = computed(() => {
    let mesDadosMap = new Map<string, DADOSGRAFICO>();
    for (const dados of dadosAcoes.value) {
        let atualData: number = new Date(dados.DataPagamento).getMonth() + 1;
        let atualValor: number = Number((dados.ValorPagamento * dados.Quantidade).toPrecision(3));
        let tipo: number = 0;
        let chave = `${atualData}-${tipo}`;
        if (mesDadosMap.has(chave)) {
            mesDadosMap.get(chave)!.valor += atualValor;
        } else {
            mesDadosMap.set(chave, { data: atualData, valor: atualValor, tipo });
        }
    }
    return Array.from(mesDadosMap.values());
});

let dadosRelatoriosFii = computed(() => {
    let mesDadosMap = new Map<string, DADOSGRAFICO>();
    for (const dados of dadosFii.value) {
        let atualData: number = new Date(dados.DataPagamento).getMonth() + 1;
        let atualValor: number = Number((dados.ValorPagamento * dados.Quantidade).toPrecision(3));
        let tipo: number = 0;
        let chave = `${atualData}-${tipo}`;
        if (mesDadosMap.has(chave)) {
            mesDadosMap.get(chave)!.valor += atualValor;
            atualValor.toFixed(2);
        } else {
            mesDadosMap.set(chave, { data: atualData, valor: atualValor, tipo });
        }
    }
    return Array.from(mesDadosMap.values());
});

let dadosRelatorioFinal = computed(() => {
    let mesDadosFinal: DADOSGRAFICO[] = [];
    mesDadosFinal = dadosRelatorioAcao.value.concat(dadosRelatoriosFii.value);
    return mesDadosFinal;
});

let dadosAgrupadosPorMes = computed(() => {
  return dadosRelatorioFinal.value.reduce((acc, curr) => {
    if (!acc[curr.data]) {
      acc[curr.data] = [];
    }
    acc[curr.data].push({ valor: curr.valor, tipo: curr.tipo });
    return acc;
  }, {} as Record<number, { valor: number; tipo: number }[]>);
});

onMounted(() => {
    verifyUser();
    loadCarteira();
})

function loadCarteira() {
    axios.post('http://localhost:8080/carteira_load', {
        userID: localStorage.getItem('usID')
    }).then((res) => {
        nextTick(() => {
            carteiras.value = res.data;
        })
    }).catch((err) => {
        console.log(err);
    });
}

function carregarRelatorio() {
    if (idCarteira.value == undefined || dataInicial.value == undefined || dataFinal.value == undefined) {
        alert('Verifique os campos informados e tente novamente!');
    } else if (dataInicial.value > dataFinal.value) {
        alert('Data inicial maior que a final, verifique os dados!');
    } else {
        axios.post('http://localhost:8080/dividendos_load', {
            cID: idCarteira.value,
            dataInicial: dataInicial.value,
            dataFinal: dataFinal.value
        }).then((res) => {
            nextTick(() => {
                showValores.value = true;
                dadosAcoes.value = res.data.acao;
                dadosFii.value = res.data.fii;
                showGraph.value = true;
                console.log(dadosAgrupadosPorMes.value);
            });
        }).catch((err) => {
            console.log(err);
        })
    }
}

function verifyUser() {
    axios.post('http://localhost:8080/session', {
        usID: localStorage.getItem('usID'),
        sID: localStorage.getItem('sID'),
        exp: localStorage.getItem('exp')
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
        if(err.response.data == 'Sessao expirada' && err.response.status == 401) {
            localStorage.removeItem('usID');
            localStorage.removeItem('exp');
            localStorage.removeItem('sID');
            router.push('/login');
        }

        if(err.response.data == 'Sem dados na localStorage' && err.response.status == 401) {
            router.push('/login');
        }
    });
}
</script>

<template>
    <Header showPerfil></Header>
    <Sidebar></Sidebar>
    <div class="conteudo">
        <div class="titulo_div">Dividendos</div>
        <div class="descricao">Visualize os relatórios de acordo com o periodo desejado:</div>
        <label for="carteira">Carteira:</label>
        <select name="carteira" v-model="idCarteira" required>
            <option v-for="cart in carteiras" :value="cart.CarteiraID" :v-model="cart.CarteiraID">{{ cart.Nome }}</option>
        </select>
        <label for="data_inicial">Data Inicial:</label>
        <input type="date" v-model="dataInicial" required>
        <label for="data_final">Data Final:</label>
        <input type="date" v-model="dataFinal" required>
        <button class="pesquisa" @click="carregarRelatorio()">Pesquisar</button>
        <div class="grafico">
            <title id="title_grafico">Grafico de Proventos em barras</title>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="svg_grafico" v-if="showGraph" >
                <g v-for="gr in dadosAgrupadosPorMes">
                    <rect x="10" y="0" width="30" height="30" fill="rgba(123, 104, 238, 1)"/>
                </g>
            </svg>
        </div>
        <div class="valores_totais" v-if="showValores">
            <h1 class="titulo_totais">Detalhamento de valores</h1>
            <div class="dados_acoes">
                <h2 class="subtitulo_acoes">Ações</h2>
                <div class="scroll_acoes">
                    <div class="acoes" v-for="acao in dadosAcoes">
                        <div class="">{{ acao.Ticker }} - {{ acao.Descricao }} R${{ (acao.ValorPagamento * acao.Quantidade).toFixed(2) }} {{ new Date(acao.DataPagamento).toISOString().slice(0,10) }}</div>
                    </div>
                </div>
            </div>
            <div class="dados_fii">
                <h2 class="subtitulo_fii">Fundos Imobiliários</h2>
                    <div class="scroll_fii">
                        <div class="fii" v-for="fii in dadosFii">
                            <div class="">{{ fii.Ticker }} - {{ fii.Descricao }} R${{ (fii.ValorPagamento * fii.Quantidade).toFixed(2) }} {{ new Date(fii.DataPagamento).toISOString().slice(0,10) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
</template>

<style scoped>
svg.svg_grafico {
    width: 100%;
}

h2.subtitulo_acoes, h2.subtitulo_fii {
    display: inline-block;
}

div.grafico {
    width: 120%;
    justify-self: center;
}

div.dados_acoes {
   float: left;
   width: 50%;
}

div.scroll_fii, div.scroll_acoes {
    height: 20vh;
    overflow-y: auto;
}

div.valores_totais {
    text-align: center;
    overflow: hidden;
    transform: translateY(15vh);
}

h1.titulo_totais {
    font-size: x-large;
}

div.conteudo {
    position: absolute;
    top: 20%;
    left: 35%;
    color: ghostwhite;
}

div.titulo_div {
    font-size: xx-large;
    text-align: center;
}

div.descricao {
    font-size: large;
    transform: translateX(5vw);
}

label {
    margin: 1vw;
}

button.pesquisa {
    font-size: medium;
    padding: 0.2vw;
    margin-left: 1vw;
}
</style>