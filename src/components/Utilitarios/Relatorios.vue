<script setup lang="ts">
import api from "../../api/main";
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Spinner from "../UI/Spinner.vue";
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';

const router = useRouter();
let idCarteira = ref();
let carteiras = ref();
let dataInicial = ref();
let dataFinal = ref();
let tipoRelatorio = ref("");
let loading = ref(true);
let showPdfReport = ref(false);
let pdfReportUrl = ref<string | undefined>();

let chartInstance: ECharts | null = null;
const chartDom = ref<HTMLElement | null>(null);

onMounted(async () => {
  try {
    await Promise.all([loadCarteira(), verifyUser()]);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

onMounted(() => {
  window.addEventListener('resize', resizeChart);
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
  window.removeEventListener('resize', resizeChart);
});

watch(tipoRelatorio, async (newVal, oldVal) => {
  if (oldVal.startsWith('chart_') && !newVal.startsWith('chart_')) {
    if (chartInstance) {
      chartInstance.clear();
      chartInstance.dispose();
      chartInstance = null;
    }
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

function ensureChartInitialized() {
  if (!chartInstance && chartDom.value) {
    chartInstance = echarts.init(chartDom.value);
    chartInstance.setOption({
      title: {
        text: 'Selecione um tipo de gráfico',
        left: 'center',
        textStyle: {
            color: '#f8fafc'
        }
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            color: '#f8fafc'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
            color: '#f8fafc'
        }
      },
      series: [],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    });
  }
}

async function updateChart() {
  if (!chartInstance) return;

  chartInstance.showLoading();

  let chartData;
  let chartTitle = 'Gráfico';
  let xAxisData: string[] = [];
  let seriesData: number[] = [];

  try {
    if (tipoRelatorio.value === 'chart_cotacoes') {
      chartTitle = 'Gráfico de Cotações';
      // No backend implementation for historical cotacoes, so display message
      // and clear any existing chart data
      chartInstance.setOption({
        title: {
            text: 'Desculpe, dados históricos de cotações não estão disponíveis no momento.',
            left: 'center',
            textStyle: {
                color: '#f8fafc'
            }
        },
        xAxis: { data: [] },
        yAxis: {},
        series: []
      });
      chartInstance.hideLoading();
      return;

    } else if (tipoRelatorio.value === 'chart_dividendos') {
      chartTitle = 'Gráfico de Dividendos';
      const res = await api.post('/chart_dividendos', {
        cID: idCarteira.value,
        dataInicial: dataInicial.value,
        dataFinal: dataFinal.value,
      });
      chartData = res.data;
      xAxisData = chartData.map((item: { data: string; valor: number }) => item.data);
      seriesData = chartData.map((item: { data: string; valor: number }) => item.valor);
    }

    const option = {
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: {
            color: '#f8fafc'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
            color: '#f8fafc'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
            color: '#f8fafc'
        }
      },
      series: [
        {
          name: chartTitle,
          type: 'line',
          data: seriesData,
          itemStyle: {
            color: '#3b82f6'
          }
        }
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    };
    chartInstance.setOption(option);

  } catch (error) {
    console.error("Erro ao carregar dados do gráfico:", error);
    chartInstance.setOption({
        title: {
            text: 'Erro ao carregar dados',
            left: 'center',
            textStyle: {
                color: '#f8fafc'
            }
        }
    });
  } finally {
    chartInstance.hideLoading();
  }
}

async function generateReport() {
  if (
    !idCarteira.value ||
    !dataInicial.value ||
    !dataFinal.value ||
    !tipoRelatorio.value
  ) {
    alert("Preencha todos os campos antes de pesquisar.");
    return;
  }
  if (dataInicial.value > dataFinal.value) {
    alert("Data inicial maior que a final, verifique os dados!");
    return;
  }

  if (tipoRelatorio.value.startsWith("chart_")) {
    showPdfReport.value = false; 
    await nextTick(); 
    ensureChartInitialized();
    await updateChart();
    return;
  }

  try {
    const res = await api.post(
      "/relatorios_load",
      {
        cID: idCarteira.value,
        tipo: tipoRelatorio.value,
        dataInicial: dataInicial.value,
        dataFinal: dataFinal.value,
      },
      { responseType: "blob" },
    );

    const contentType = res.headers["content-type"] || "";
    if (contentType.includes("application/json")) {
      const json = await new Response(res.data).json();
      alert(json.message || "Resposta recebida do servidor.");
      showPdfReport.value = false;
      if (pdfReportUrl.value) {
        URL.revokeObjectURL(pdfReportUrl.value);
        pdfReportUrl.value = undefined;
      }
    } else {
      if (pdfReportUrl.value) {
        URL.revokeObjectURL(pdfReportUrl.value);
      }
      const blob = new Blob([res.data], {
        type: contentType || "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      pdfReportUrl.value = url;
      showPdfReport.value = true;
      window.open(url, "_blank");
    }
  } catch (err) {
    console.error(err);
    alert(
      "Erro ao carregar relatório. Verifique o servidor e tente novamente.",
    );
  }
}
</script>

<template>
  <div v-if="loading">
    <Spinner></Spinner>
  </div>
  <div v-else class="conteudo page-panel">
    <div class="header-section">
      <div class="titulo">Relatórios</div>
      <div class="descricao">
        Visualize os relatórios de acordo com o período desejado:
      </div>
    </div>

    <div class="form-section">
      <div class="form-group">
        <label for="carteira">Carteira:</label>
        <select id="carteira" v-model="idCarteira" class="input-field">
          <option value="" disabled>-- Selecione --</option>
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
        <label for="relatorio">Tipo de Relatório:</label>
        <select id="relatorio" v-model="tipoRelatorio" class="input-field">
          <option value="" disabled>-- Selecione --</option>
          <option value="pdf_resumo">PDF Resumo</option>
          <option value="pdf_detalhado">PDF Detalhado</option>
          <option value="pdf_fluxo">PDF Fluxo</option>
          <option value="chart_cotacoes">Gráfico de Cotações</option>
          <option value="chart_dividendos">Gráfico de Dividendos</option>
        </select>
      </div>

      <div class="form-group">
        <label for="data_inicial">Data Inicial:</label>
        <input
          id="data_inicial"
          type="date"
          v-model="dataInicial"
          class="input-field"
        />
      </div>

      <div class="form-group">
        <label for="data_final">Data Final:</label>
        <input
          id="data_final"
          type="date"
          v-model="dataFinal"
          class="input-field"
        />
      </div>

      <button class="btn-search" @click="generateReport()">Pesquisar</button>
    </div>

    <div v-if="showPdfReport" class="result-section">
      <a :href="pdfReportUrl" target="_blank" class="btn-search"
        >Abrir Relatório</a
      >
      <a
        :href="pdfReportUrl"
        :download="'relatorio.pdf'"
        class="btn-search"
        style="margin-left: 1rem"
        >Baixar</a
      >
    </div>

    <div v-if="tipoRelatorio.startsWith('chart_')">
        <div v-if="tipoRelatorio === 'chart_cotacoes'" class="chart-message">
            Desculpe, dados históricos de cotações não estão disponíveis no momento.
        </div>
        <div v-else ref="chartDom" id="echarts-container" style="width: 100%; height: 400px;"></div>
    </div>
  </div>
</template>
