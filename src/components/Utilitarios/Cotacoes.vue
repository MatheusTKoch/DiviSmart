<script setup lang="ts">
import axios from "axios";
import { ref, onMounted, nextTick } from "vue";

let dadosCotacao = ref();

onMounted(() => {
  loadCotacoes();
});

function loadCotacoes() {
  axios
    .post("http://localhost:3000/cotacoes_load", {}, {withCredentials: true})
    .then((res) => {
      nextTick(() => {
        dadosCotacao.value = res.data;
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<template>
  <div class="cotacoes-card compact-card">
    <h3>
      <svg
        style="vertical-align: middle; margin-right: 8px"
        width="22"
        height="22"
        fill="#3b82f6"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.83.48-5.48-1.51-5.96-4.34-.09-.52.36-.99.89-.99.44 0 .81.32.89.75.34 1.97 2.19 3.25 4.16 2.91 1.97-.34 3.25-2.19 2.91-4.16-.34-1.97-2.19-3.25-4.16-2.91-.52.09-.99-.36-.99-.89 0-.44.32-.81.75-.89 2.83-.48 5.48 1.51 5.96 4.34.09.52-.36.99-.89.99-.44 0-.81-.32-.89-.75z"
        />
      </svg>
      Cotações Atualizadas:
    </h3>
    <ol>
      <li v-for="cot of dadosCotacao" :key="cot.ativo">
        <span class="ativo">{{ cot.ativo }}</span>
        <span class="valor">
          {{ "$ " }}{{ cot.valoratual }}
        </span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.cotacoes-card {
  width: min(100%, 360px);
  margin-left: auto;
  margin-bottom: 1.5rem;
  border-color: rgba(59, 130, 246, 0.18);
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cotacoes-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #3b82f6;
  display: flex;
  align-items: center;
}

.cotacoes-card ol {
  padding: 0;
  margin: 0;
}

.cotacoes-card li {
  list-style: none;
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgba(59, 130, 246, 0.08);
}

.ativo {
  font-weight: 600;
  color: #cbd5e1;
}

.valor {
  font-weight: 700;
  color: #3b82f6;
}

@media screen and (max-width: 768px) {
  .cotacoes-card {
    width: 100%;
    margin-left: 0;
  }
}
</style>
