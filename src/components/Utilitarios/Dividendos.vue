<script setup lang="ts">
import api from "../../api/main";
import { nextTick, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import Spinner from "../UI/Spinner.vue";
import DividendosChart from "../UI/DividendosChart.vue";

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
let loading = ref(true);

let dadosRelatorioAcao = computed(() => {
  let mesDadosMap = new Map<string, DADOSGRAFICO>();
  if (!dadosAcoes.value) return [];
  for (const dados of dadosAcoes.value) {
    let atualData: number = new Date(dados.DataPagamento).getMonth() + 1;
    let atualValor: number = Number(
      (dados.ValorPagamento * dados.Quantidade).toPrecision(3),
    );
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
  if (!dadosFii.value) return [];
  for (const dados of dadosFii.value) {
    let atualData: number = new Date(dados.DataPagamento).getMonth() + 1;
    let atualValor: number = Number(
      (dados.ValorPagamento * dados.Quantidade).toPrecision(3),
    );
    let tipo: number = 1;
    let chave = `${atualData}-${tipo}`;
    if (mesDadosMap.has(chave)) {
      mesDadosMap.get(chave)!.valor += atualValor;
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
  return dadosRelatorioFinal.value.reduce(
    (acc, curr) => {
      if (!acc[curr.data]) {
        acc[curr.data] = [];
      }
      acc[curr.data].push({ valor: curr.valor, tipo: curr.tipo });
      return acc;
    },
    {} as Record<number, { valor: number; tipo: number }[]>,
  );
});

let dadosPorMes = computed(() => {
  const resultado: {
    mes: number;
    acao: { valor: number; tipo: number } | null;
    fii: { valor: number; tipo: number } | null;
  }[] = [];
  for (const mes in dadosAgrupadosPorMes.value) {
    const itens = dadosAgrupadosPorMes.value[mes];
    const acao = itens.find((item) => item.tipo === 0) || null;
    const fii = itens.find((item) => item.tipo === 1) || null;
    resultado.push({ mes: Number(mes), acao, fii });
  }
  return resultado.sort((a, b) => a.mes - b.mes);
});

const categories = computed(() => dadosPorMes.value.map((i) => `Mês ${i.mes}`));

const series = computed(() => [
  {
    name: "Ações",
    data: dadosPorMes.value.map((i) =>
      i.acao ? Number(i.acao.valor.toFixed(2)) : 0,
    ),
  },
  {
    name: "FIIs",
    data: dadosPorMes.value.map((i) =>
      i.fii ? Number(i.fii.valor.toFixed(2)) : 0,
    ),
  },
]);

const formatDateSafe = (dateValue: unknown): string => {
  if (!dateValue) return "";
  const d = new Date(dateValue as any);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

onMounted(async () => {
  try {
    await Promise.all([loadCarteira(), verifyUser()]);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

async function verifyUser() {
  try {
    await api.get("/verify_session");
  } catch (err: any) {
    console.log(err);
    localStorage.removeItem("exp");
    localStorage.removeItem("sID");
    router.push("/");
  }
}

async function loadCarteira() {
  try {
    const res = await api.post("/carteira_load");
    nextTick(() => {
      carteiras.value = res.data;
    });
  } catch (err) {
    console.log(err);
  }
}

function carregarRelatorio() {
  if (
    idCarteira.value == undefined ||
    dataInicial.value == undefined ||
    dataFinal.value == undefined
  ) {
    alert("Verifique os campos informados e tente novamente!");
  } else if (dataInicial.value > dataFinal.value) {
    alert("Data inicial maior que a final, verifique os dados!");
  } else {
    api
      .post("/dividendos_load", {
        cID: idCarteira.value,
        dataInicial: dataInicial.value,
        dataFinal: dataFinal.value,
      })
      .then((res) => {
        nextTick(() => {
          showValores.value = true;
          dadosAcoes.value = res.data.acao;
          dadosFii.value = res.data.fii;
          showGraph.value = true;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
</script>

<template>
  <div v-if="loading">
    <Spinner></Spinner>
  </div>
  <div v-else class="conteudo">
    <div class="header-section">
      <div class="titulo">Dividendos</div>
      <div class="descricao">
        Visualize os relatórios de acordo com o período desejado:
      </div>
    </div>
    <div class="form-section">
      <div class="form-group">
        <label for="carteira">Carteira:</label>
        <select name="carteira" v-model="idCarteira" class="input-field">
          <option
            v-for="cart in carteiras"
            :key="cart.CarteiraID"
            :value="cart.CarteiraID"
          >
            {{ cart.Nome }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="data_inicial">Data Inicial:</label>
        <input type="date" v-model="dataInicial" class="input-field" />
      </div>
      <div class="form-group">
        <label for="data_final">Data Final:</label>
        <input type="date" v-model="dataFinal" class="input-field" />
      </div>
      <button class="btn-search" @click="carregarRelatorio()">Pesquisar</button>
    </div>
    <div v-if="showGraph" class="chart-section">
      <h3>Gráfico de Proventos</h3>
      <div class="chart-container">
        <DividendosChart :categories="categories" :series="series" />
      </div>
    </div>
    <div v-if="showValores" class="details-section">
      <h3>Detalhamento de Valores</h3>
      <div class="details-grid">
        <div class="detail-card">
          <h4>Ações</h4>
          <div class="scroll-list">
            <div v-for="acao in dadosAcoes" :key="acao.Ticker" class="item">
              {{ acao.Ticker }} - {{ acao.Descricao }} | R$
              {{ (acao.ValorPagamento * acao.Quantidade).toFixed(2) }} |
              {{ formatDateSafe(acao.DataPagamento) }}
            </div>
          </div>
        </div>
        <div class="detail-card">
          <h4>Fundos Imobiliários</h4>
          <div class="scroll-list">
            <div v-for="fii in dadosFii" :key="fii.Ticker" class="item">
              {{ fii.Ticker }} - {{ fii.Descricao }} | R$
              {{ (fii.ValorPagamento * fii.Quantidade).toFixed(2) }} |
              {{ formatDateSafe(fii.DataPagamento) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.conteudo {
  position: absolute;
  top: 20%;
  left: 30%;
  color: #f8fafc;
  max-width: 70vw;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.titulo {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

.descricao {
  font-size: 1.2rem;
  color: #94a3b8;
}

.form-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

label {
  font-size: 0.9rem;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.input-field {
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  color: #f8fafc;
  font-size: 1rem;
}

.btn-search {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border: none;
  color: #f8fafc;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  align-self: flex-end;
}

.btn-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.chart-section {
  margin-bottom: 2rem;
}

.chart-section h3 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.chart-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.chart-svg {
  width: 100%;
  height: auto;
  max-width: 800px;
}

.details-section h3 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.detail-card h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #f8fafc;
}

.scroll-list {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.scroll-list::-webkit-scrollbar {
  width: 6px;
}

.scroll-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.scroll-list::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 3px;
}

.item {
  padding: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .conteudo {
    left: 5%;
    max-width: 90vw;
  }
  .titulo {
    font-size: 2rem;
  }
  .form-section {
    flex-direction: column;
  }
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
