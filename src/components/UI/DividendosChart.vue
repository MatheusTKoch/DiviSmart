<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
} from "echarts/components";
import { UniversalTransition } from "echarts/features";

echarts.use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  UniversalTransition,
]);

const props = defineProps<{
  categories: string[];
  series: { name: string; data: number[] }[];
  height?: number | string;
}>();

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

function buildOption() {
  return {
    title: {
      text: "Proventos por Mês",
      left: "center",
      textStyle: { color: "#f8fafc" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (items: any) => {
        if (!Array.isArray(items)) return items;
        return items
          .map((it: any) => `${it.seriesName}: R$ ${Number(it.data).toFixed(2)}`)
          .join("<br/>");
      },
    },
    legend: {
      data: props.series.map((s) => s.name),
      top: 40,
      textStyle: { color: "#f8fafc" },
    },
    grid: { left: "6%", right: "4%", bottom: "8%", containLabel: true },
    xAxis: {
      type: "category",
      data: props.categories,
      axisLine: { lineStyle: { color: "#94a3b8" } },
      axisLabel: { color: "#f8fafc" },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#94a3b8" } },
      axisLabel: { color: "#f8fafc", formatter: (v: number) => `R$ ${v}` },
    },
    toolbox: { feature: { saveAsImage: {} }, iconStyle: { borderColor: "#f8fafc" } },
    series: props.series.map((s) => ({
      name: s.name,
      type: "bar",
      data: s.data.map((v: number) => Number(Number(v).toFixed(2))),
      emphasis: { focus: "series" },
      barMaxWidth: "40%",
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color:
          s.name === "Ações"
            ? {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#3b82f6" },
                  { offset: 1, color: "#1e40af" },
                ],
              }
            : {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#1d4ed8" },
                  { offset: 1, color: "#1e3a8a" },
                ],
              },
      },
    })),
  };
}

function resizeHandler() {
  if (chart) chart.resize();
}

function initChart() {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value as HTMLElement, undefined, { renderer: "canvas" });
  chart.setOption(buildOption());
  window.addEventListener("resize", resizeHandler);
}

onMounted(() => {
  nextTick(initChart);
});

watch(
  () => [props.categories, props.series],
  () => {
    if (chart) {
      chart.setOption(buildOption());
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (chart) {
    window.removeEventListener("resize", resizeHandler);
    chart.dispose();
    chart = null;
  }
});
</script>

<template>
  <div ref="chartRef" :style="{ height: props.height ? (typeof props.height === 'number' ? props.height + 'px' : props.height) : '360px', width: '100%' }"></div>
</template>

<style scoped>
/* Opcional: ajustes locais de estilo se necessário */
</style>