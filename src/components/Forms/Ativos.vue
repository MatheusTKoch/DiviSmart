<script setup lang="ts">
import axios from "axios";
import Toast from "../UI/Toast.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

interface Acao {
  acaoid: string;
  ticker: string;
}

interface Fii {
  fundoimobiliarioid: string;
  ticker: string;
}

interface Tesouro {
  tesouroid: string;
  descricao: string;
}

const router = useRouter();

const acoes = ref<Acao[]>([]);
const fii = ref<Fii[]>([]);
const tesouro = ref<Tesouro[]>([]);
const cartNome = ref("");
const dadosCarteira = ref({ valores: 0, quantidade: 0 });

const idAcao = ref("");
const quantidadeAcao = ref();
const valorInvestidoAcao = ref();

const idFii = ref("");
const quantidadeFii = ref();
const valoInvestidoFii = ref();

const idTesouro = ref("");
const quantidadeTesouro = ref();
const valorInvestidoTesouro = ref();

const showToast = ref(false);
const isSuccess = ref(false);
const toastMessage = ref("");

onMounted(() => {
  loadAtivos();
  loadDados();
  loadDadosCarteira();
});

const loadDadosCarteira = async () => {
  try {
    const res = await axios.post("http://localhost:3000/carteira_dados", {
      cID: sessionStorage.getItem("cID"),
    });
    dadosCarteira.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const loadAtivos = async () => {
  try {

    const res = await axios.post("http://localhost:3000/ativos_load", {
      carteiraid: sessionStorage.getItem("cID")
    });

    acoes.value = res.data.acoes;
    fii.value = res.data.fii;
    tesouro.value = res.data.tesouro;

    console.log("Ativos carregados com sucesso!");
  } catch (err) {
    console.error("Erro ao carregar ativos:", err);
  }
}

const loadDados = async () => {
  try {
    const res = await axios.post("http://localhost:3000/carteira_name", {
      userID: localStorage.getItem("usID"),
      cID: sessionStorage.getItem("cID"),
    });
    cartNome.value = res.data[0]?.nome || "Minha Carteira";
  } catch (err) {
    console.error(err);
  }
};

function exibirToast(mensagem: string, sucesso: boolean) {
  toastMessage.value = mensagem;
  isSuccess.value = sucesso;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

const cadastroAcao = async () => {
  if (!idAcao.value || !quantidadeAcao.value || !valorInvestidoAcao.value) {
    return exibirToast("Preencha todos os campos!", false);
  }
  try {
    await axios.post("http://localhost:3000/acoes_cadastro", {
      quantidade: quantidadeAcao.value,
      valorInvestido: valorInvestidoAcao.value,
      cID: sessionStorage.getItem("cID"),
      acaoID: idAcao.value,
    });
    await loadDadosCarteira();
    exibirToast("Sucesso!", true);
    idAcao.value = "";
    quantidadeAcao.value = null;
    valorInvestidoAcao.value = null;
  } catch (err) {
    exibirToast("Erro no cadastro.", false);
  }
};

const cadastroFii = async () => {
  if (!idFii.value || !quantidadeFii.value || !valoInvestidoFii.value) {
    return exibirToast("Preencha todos os campos!", false);
  }
  try {
    await axios.post("http://localhost:3000/fii_cadastro", {
      quantidade: quantidadeFii.value,
      valorInvestido: valoInvestidoFii.value,
      cID: sessionStorage.getItem("cID"),
      fiiID: idFii.value,
    });
    await loadDadosCarteira();
    exibirToast("Sucesso!", true);
    idFii.value = "";
    quantidadeFii.value = null;
    valoInvestidoFii.value = null;
  } catch (err) {
    exibirToast("Erro no cadastro.", false);
  }
};

const cadastroTesouro = async () => {
  if (
    !idTesouro.value ||
    !quantidadeTesouro.value ||
    !valorInvestidoTesouro.value
  ) {
    return exibirToast("Preencha todos os campos!", false);
  }
  try {
    await axios.post("http://localhost:3000/tesouro_cadastro", {
      quantidade: quantidadeTesouro.value,
      valorInvestido: valorInvestidoTesouro.value,
      cID: sessionStorage.getItem("cID"),
      tesID: idTesouro.value,
    });
    await loadDadosCarteira();
    exibirToast("Sucesso!", true);
    idTesouro.value = "";
    quantidadeTesouro.value = null;
    valorInvestidoTesouro.value = null;
  } catch (err) {
    exibirToast("Erro no cadastro.", false);
  }
};

const voltar = () => router.push("/menu/carteira");
</script>

<template>
  <div class="ativos-page">
    <header class="ativos-header">
      <button @click="voltar" class="btn-back">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          fill="currentColor"
        >
          <path
            d="m287-446.67 240 240L480-160 160-480l320-320 47 46.67-240 240h513v66.66H287Z"
          />
        </svg>
        <span>Carteiras</span>
      </button>

      <div class="resumo-box">
        <div class="resumo-item">
          <span class="label">Total Investido</span>
          <span class="valor highlight"
            >R$ {{ dadosCarteira?.valores || "0,00" }}</span
          >
        </div>
        <div class="divider"></div>
        <div class="resumo-item">
          <span class="label">Ativos Totais</span>
          <span class="valor">{{ dadosCarteira?.quantidade || 0 }}</span>
        </div>
      </div>
    </header>

    <main class="ativos-container">
      <div class="title-section">
        <h1 class="page-title">
          Gerenciar Ativos: <span>{{ cartNome }}</span>
        </h1>
        <p class="page-subtitle">
          Adicione novas posições à sua carteira de investimentos.
        </p>
      </div>

      <div class="assets-grid">
        <section class="asset-section">
          <div class="section-info">
            <div class="icon-box blue">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20">
                <path
                  d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
                />
              </svg>
            </div>
            <h2>Ações</h2>
          </div>
          <div class="glass-card">
            <div class="vertical-form">
              <div class="form-group">
                <label>Ticker</label>
                <select v-model="idAcao">
                  <option value="" disabled>Selecione</option>
                  <option
                    v-for="ac in acoes"
                    :key="ac.acaoid"
                    :value="ac.acaoid"
                  >
                    {{ ac.ticker }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Valor Investido</label>
                <input
                  type="number"
                  placeholder="R$ 0,00"
                  v-model="valorInvestidoAcao"
                />
              </div>
              <div class="form-group">
                <label>Quantidade</label>
                <input
                  type="number"
                  placeholder="Ex: 10"
                  v-model="quantidadeAcao"
                />
              </div>
              <button class="btn-action blue-btn" @click="cadastroAcao">
                Salvar Ativo
              </button>
            </div>
          </div>
        </section>

        <section class="asset-section">
          <div class="section-info">
            <div class="icon-box green">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <h2>FIIs</h2>
          </div>
          <div class="glass-card">
            <div class="vertical-form">
              <div class="form-group">
                <label>Ticker</label>
                <select v-model="idFii">
                  <option value="" disabled>Selecione</option>
                  <option
                    v-for="f in fii"
                    :key="f.fundoimobiliarioid"
                    :value="f.fundoimobiliarioid"
                  >
                    {{ f.ticker }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Valor Investido</label>
                <input
                  type="number"
                  placeholder="R$ 0,00"
                  v-model="valoInvestidoFii"
                />
              </div>
              <div class="form-group">
                <label>Quantidade</label>
                <input
                  type="number"
                  placeholder="Ex: 5"
                  v-model="quantidadeFii"
                />
              </div>
              <button class="btn-action green-btn" @click="cadastroFii">
                Salvar Ativo
              </button>
            </div>
          </div>
        </section>

        <section class="asset-section">
          <div class="section-info">
            <div class="icon-box orange">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20">
                <path
                  d="M11.8 2.1L3.8 6.7V17.3L11.8 21.9L19.8 17.3V6.7L11.8 2.1ZM11.8 4.4L17.8 7.8L11.8 11.2L5.8 7.8L11.8 4.4Z"
                />
              </svg>
            </div>
            <h2>Tesouro</h2>
          </div>
          <div class="glass-card">
            <div class="vertical-form">
              <div class="form-group">
                <label>Título Público</label>
                <select v-model="idTesouro">
                  <option value="" disabled>Selecione</option>
                  <option
                    v-for="t in tesouro"
                    :key="t.tesouroid"
                    :value="t.tesouroid"
                  >
                    {{ t.descricao }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Valor Investido</label>
                <input
                  type="number"
                  placeholder="R$ 0,00"
                  v-model="valorInvestidoTesouro"
                />
              </div>
              <div class="form-group">
                <label>Quantidade</label>
                <input
                  type="number"
                  placeholder="Ex: 1.5"
                  v-model="quantidadeTesouro"
                />
              </div>
              <button class="btn-action orange-btn" @click="cadastroTesouro">
                Salvar Ativo
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>

    <teleport to="body">
      <Toast v-if="showToast" :sucesso="isSuccess">{{ toastMessage }}</Toast>
    </teleport>
  </div>
</template>

<style scoped>
.ativos-page {
  padding: 2rem;
  max-width: 1300px;
  margin: 0 auto;
  color: #f8fafc;
}

.ativos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.btn-back {
  background: transparent;
  border: none;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-back:hover {
  color: #3b82f6;
  transform: translateX(-4px);
}

.resumo-box {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(30, 41, 59, 0.4);
  padding: 10px 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.resumo-item {
  display: flex;
  flex-direction: column;
}

.resumo-item .label {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
}

.resumo-item .valor {
  font-size: 1.1rem;
  font-weight: 700;
}

.valor.highlight {
  color: #3b82f6;
}

.divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
}

.title-section {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 300;
}

.page-title span {
  font-weight: 700;
  color: #3b82f6;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
}

.assets-grid {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: stretch;
}

.asset-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.section-info h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #cbd5e1;
}

.icon-box {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box.blue {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}
.icon-box.green {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}
.icon-box.orange {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.glass-card {
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
  flex-grow: 1;
}

.vertical-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #94a3b8;
}

input,
select {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 12px;
  border-radius: 10px;
  color: #fff;
  font-size: 0.9rem;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
}

.btn-action {
  margin-top: 0.5rem;
  padding: 12px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.blue-btn {
  background: #3b82f6;
  color: white;
}
.green-btn {
  background: #10b981;
  color: white;
}
.orange-btn {
  background: #f59e0b;
  color: white;
}

.btn-action:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

@media (max-width: 1024px) {
  .assets-grid {
    flex-wrap: wrap;
  }
  .asset-section {
    flex: 1 1 calc(50% - 1.5rem);
  }
}

@media (max-width: 768px) {
  .ativos-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .asset-section {
    flex: 1 1 100%;
  }
}
</style>
