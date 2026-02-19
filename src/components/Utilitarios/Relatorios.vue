<script setup lang="ts">
import api from "../../api/main";
import { nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Spinner from "../UI/Spinner.vue";

const router = useRouter();
let idCarteira = ref();
let carteiras = ref();
let dataInicial = ref();
let dataFinal = ref();
let tipoRelatorio = ref("");
let loading = ref(true);
let showRelatorio = ref(false);
let relatorioUrl = ref<string | null>(null);

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

async function carregarRelatorio() {
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
      showRelatorio.value = false;
      if (relatorioUrl.value) {
        URL.revokeObjectURL(relatorioUrl.value);
        relatorioUrl.value = null;
      }
    } else {
      if (relatorioUrl.value) {
        URL.revokeObjectURL(relatorioUrl.value);
      }
      const blob = new Blob([res.data], {
        type: contentType || "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      relatorioUrl.value = url;
      showRelatorio.value = true;
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
  <div v-else class="conteudo">
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
          <option value="resumo">Resumo</option>
          <option value="detalhado">Detalhado</option>
          <option value="fluxo">Fluxo</option>
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

      <button class="btn-search" @click="carregarRelatorio()">Pesquisar</button>
    </div>

    <div v-if="showRelatorio" class="result-section">
      <a :href="relatorioUrl" target="_blank" class="btn-search"
        >Abrir Relatório</a
      >
      <a
        :href="relatorioUrl"
        :download="'relatorio.pdf'"
        class="btn-search"
        style="margin-left: 1rem"
        >Baixar</a
      >
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
  text-decoration: none;
  display: inline-block;
}

.btn-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.result-section {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
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
}
</style>
