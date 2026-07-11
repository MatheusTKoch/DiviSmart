<script setup lang="ts">
import api from "../../api/main";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Spinner from "../UI/Spinner.vue";

echarts.use([
  PieChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  GridComponent,
  CanvasRenderer,
]);

type Carteira = {
  CarteiraID: number;
  Nome: string;
};

type ResumoCategoria = {
  nome: string;
  valor: number;
  quantidade: number;
  percentual: number;
  cor: string;
};

type ResumoCarteira = {
  valores: number;
  quantidade: number;
  rendaFixa?: number;
  acoes?: number;
  fii?: number;
  rendaFixaQuantidade?: number;
  acoesQuantidade?: number;
  fiiQuantidade?: number;
};

const router = useRouter();

const loading = ref(true);
const carteiras = ref<Carteira[]>([]);
const selectedCarteira = ref<number | string>("");
const resumo = ref<ResumoCarteira | null>(null);
const chartDom = ref<HTMLElement | null>(null);

const cores = {
  rendaFixa: "#60a5fa",
  acoes: "#2563eb",
  fii: "#38bdf8",
  fundo: "#0f172a",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

function formatPercent(value: number) {
  return `${(value || 0).toFixed(1)}%`;
}

function getResumoCategorias(): ResumoCategoria[] {
  const base = resumo.value;

  if (!base) {
    return [
      { nome: "Renda fixa", valor: 0, quantidade: 0, percentual: 0, cor: cores.rendaFixa },
      { nome: "Ações", valor: 0, quantidade: 0, percentual: 0, cor: cores.acoes },
      { nome: "FIIs", valor: 0, quantidade: 0, percentual: 0, cor: cores.fii },
    ];
  }

  const total = base.valores || 0;
  const rendaFixa = Number(base.rendaFixa || 0);
  const acoes = Number(base.acoes || 0);
  const fii = Number(base.fii || 0);

  return [
    {
      nome: "Renda fixa",
      valor: rendaFixa,
      quantidade: Number(base.rendaFixaQuantidade || 0),
      percentual: total > 0 ? (rendaFixa / total) * 100 : 0,
      cor: cores.rendaFixa,
    },
    {
      nome: "Ações",
      valor: acoes,
      quantidade: Number(base.acoesQuantidade || 0),
      percentual: total > 0 ? (acoes / total) * 100 : 0,
      cor: cores.acoes,
    },
    {
      nome: "FIIs",
      valor: fii,
      quantidade: Number(base.fiiQuantidade || 0),
      percentual: total > 0 ? (fii / total) * 100 : 0,
      cor: cores.fii,
    },
  ];
}

function buildChartOption() {
  const dados = getResumoCategorias()
    .filter((item) => item.valor > 0)
    .map((item) => ({
      name: item.nome,
      value: Number(item.valor.toFixed(2)),
      itemStyle: { color: item.cor },
    }));

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(15, 23, 42, 0.96)",
      borderColor: "rgba(255, 255, 255, 0.08)",
      textStyle: {
        color: "#f8fafc",
      },
      formatter: (params: any) => {
        const total = Number(resumo.value?.valores || 0);
        const value = Number(params.value || 0);
        const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";

        return `
          <div style="font-weight:700; margin-bottom:4px;">${params.name}</div>
          <div>Participação: ${percent}%</div>
          <div>Valor: ${formatCurrency(value)}</div>
        `;
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "Distribuição da carteira",
        type: "pie",
        radius: ["58%", "82%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: cores.fundo,
          borderWidth: 4,
        },
        label: {
          show: false,
        },
        emphasis: {
          scale: true,
          scaleSize: 10,
        },
        labelLine: {
          show: false,
        },
        data: dados,
      },
    ],
  };
}

function renderChart() {
  if (!chartDom.value) return;

  let instance = echarts.getInstanceByDom(chartDom.value);
  
  if (!instance) {
    instance = echarts.init(chartDom.value);
  }

  instance.setOption(buildChartOption(), true);
}

function resizeChart() {
  if (!chartDom.value) return;
  
  const instance = echarts.getInstanceByDom(chartDom.value);
  if (instance && !instance.isDisposed()) {
    instance.resize();
  }
}

async function loadCarteiras() {
  const res = await api.post("/carteira_load");
  carteiras.value = res.data || [];

  if (carteiras.value.length > 0 && !selectedCarteira.value) {
    selectedCarteira.value = carteiras.value[0].CarteiraID;
  }
}

async function loadResumo() {
  if (!selectedCarteira.value) {
    resumo.value = null;
    renderChart();
    return;
  }

  const res = await api.post("/carteira_dados", {
    cID: selectedCarteira.value,
  });

  resumo.value = {
    valores: Number(res.data?.valores || 0),
    quantidade: Number(res.data?.quantidade || 0),
    rendaFixa: Number(res.data?.rendaFixa || 0),
    acoes: Number(res.data?.acoes || 0),
    fii: Number(res.data?.fii || 0),
    rendaFixaQuantidade: Number(res.data?.rendaFixaQuantidade || 0),
    acoesQuantidade: Number(res.data?.acoesQuantidade || 0),
    fiiQuantidade: Number(res.data?.fiiQuantidade || 0),
  };

  await nextTick();
  renderChart();
}

watch(selectedCarteira, async () => {
  await loadResumo();
});

onMounted(async () => {
  try {
    const session = await api.get("/verify_session");
    if (!session.data?.authenticated) {
      router.push("/");
      return;
    }

    await loadCarteiras();
    if (selectedCarteira.value) {
      const res = await api.post("/carteira_dados", {
        cID: selectedCarteira.value,
      });

      resumo.value = {
        valores: Number(res.data?.valores || 0),
        quantidade: Number(res.data?.quantidade || 0),
        rendaFixa: Number(res.data?.rendaFixa || 0),
        acoes: Number(res.data?.acoes || 0),
        fii: Number(res.data?.fii || 0),
        rendaFixaQuantidade: Number(res.data?.rendaFixaQuantidade || 0),
        acoesQuantidade: Number(res.data?.acoesQuantidade || 0),
        fiiQuantidade: Number(res.data?.fiiQuantidade || 0),
      };
    }
    
    window.addEventListener("resize", resizeChart);
  } catch (error) {
    console.error("Erro ao carregar acompanhamento:", error);
    router.push("/");
  } finally {
    loading.value = false;
    await nextTick();
    renderChart();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeChart);
  
  if (chartDom.value) {
    const instance = echarts.getInstanceByDom(chartDom.value);
    if (instance) {
      instance.dispose();
    }
  }
});
</script>

<template>
  <div class="acompanhamento page-panel">
    <div class="page-header acompanhamento-header">
      <div>
        <h1 class="page-title">Acompanhamento</h1>
        <p class="page-subtitle">
          Selecione uma carteira e acompanhe a divisão entre renda fixa, ações e FIIs.
        </p>
      </div>

      <div class="field-group carteira-select">
        <label class="field-label" for="carteira">Carteira</label>
        <select id="carteira" v-model="selectedCarteira" class="field-input">
          <option value="">Selecione uma carteira</option>
          <option v-for="cart in carteiras" :key="cart.CarteiraID" :value="cart.CarteiraID">
            {{ cart.Nome }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="acompanhamento-loading">
      <Spinner />
    </div>

    <template v-else>
      <div class="acompanhamento-grid">
        <section class="chart-card">
          <div class="chart-card-header">
            <div class="chart-card-title">Distribuição da carteira</div>
            <div class="chart-card-subtitle">Passe o mouse para ver o percentual e o valor total.</div>
          </div>

          <div ref="chartDom" class="chart-dom"></div>
        </section>

        <aside class="summary-card">
          <div class="summary-top">
            <span class="summary-label">Valor total</span>
            <strong class="summary-value">{{ formatCurrency(resumo?.valores || 0) }}</strong>
          </div>

          <div class="summary-metrics">
            <div class="summary-metric">
              <span>Quantidade total</span>
              <strong>{{ resumo?.quantidade || 0 }}</strong>
            </div>
            <div class="summary-metric">
              <span>Carteira ativa</span>
              <strong>{{ carteiras.find((item) => item.CarteiraID === selectedCarteira)?.Nome || "-" }}</strong>
            </div>
          </div>
        </aside>
      </div>

      <div class="breakdown-grid">
        <article
          v-for="item in getResumoCategorias()"
          :key="item.nome"
          class="breakdown-card"
          :style="{ '--accent-color': item.cor }"
        >
          <div class="breakdown-header">
            <span class="breakdown-badge">{{ item.nome }}</span>
            <span class="breakdown-percent">{{ formatPercent(item.percentual) }}</span>
          </div>

          <div class="breakdown-value">{{ formatCurrency(item.valor) }}</div>
          <div class="breakdown-meta">{{ item.quantidade }} ativo(s)</div>

          <div class="breakdown-bar">
            <span class="breakdown-bar-fill" :style="{ width: `${item.percentual}%` }"></span>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<style scoped>
.acompanhamento {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.acompanhamento-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  text-align: left;
  margin-bottom: 0;
}

.carteira-select {
  min-width: 260px;
}

.acompanhamento-loading {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.acompanhamento-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.85fr);
  gap: 1.25rem;
  align-items: stretch;
}

.chart-card,
.summary-card,
.breakdown-card {
  background: rgba(15, 23, 42, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  backdrop-filter: blur(14px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
}

.chart-card {
  padding: 1.25rem;
  min-height: 460px;
  display: flex;
  flex-direction: column;
}

.chart-card-header {
  margin-bottom: 1rem;
}

.chart-card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f8fafc;
}

.chart-card-subtitle {
  margin-top: 0.35rem;
  font-size: 0.92rem;
  color: #94a3b8;
}

.chart-dom {
  flex: 1;
  width: 100%;
  min-height: 360px;
}

.summary-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.summary-top {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.summary-label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.summary-value {
  color: #f8fafc;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  line-height: 1.05;
}

.summary-metrics {
  display: grid;
  gap: 0.9rem;
}

.summary-metric {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  background: rgba(2, 6, 23, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
}

.summary-metric span {
  color: #94a3b8;
}

.summary-metric strong {
  color: #f8fafc;
  font-weight: 700;
  text-align: right;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.breakdown-card {
  padding: 1rem 1.1rem;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.breakdown-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: #f8fafc;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent-color) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent-color) 30%, transparent);
}

.breakdown-percent {
  color: var(--accent-color);
  font-weight: 700;
  font-size: 1rem;
}

.breakdown-value {
  color: #f8fafc;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.breakdown-meta {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.breakdown-bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.breakdown-bar-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent-color), color-mix(in srgb, var(--accent-color) 65%, white));
}

@media (max-width: 1100px) {
  .acompanhamento-grid {
    grid-template-columns: 1fr;
  }

  .breakdown-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .acompanhamento-header {
    flex-direction: column;
    align-items: stretch;
  }

  .carteira-select {
    min-width: 0;
    width: 100%;
  }

  .chart-card {
    min-height: 380px;
  }
}
</style>