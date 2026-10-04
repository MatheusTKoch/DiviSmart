<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/main";
import Spinner from "../UI/Spinner.vue";

interface Asset {
  id: number | string;
  ticker: string | null;
  descricao: string;
  precoatual: number | string | null;
  pl: number | string | null;
  pvp: number | string | null;
  beta: number | string | null;
  dividendyield: number | string | null;
  dataatualizacao: string | null;
  quantidade: number;
  valorinvestido: number | string;
  tipo: "Ações" | "FIIs" | "Tesouro Direto";
  investimentominimo: number | string | null;
  vencimento: string | null;
  codigotitulo: string | null;
}

interface Wallet {
  CarteiraID: number;
  Nome: string;
}

const router = useRouter();

const loading = ref(true);
const loadingAssets = ref(false);
const carteiras = ref<Wallet[]>([]);
const selectedCarteira = ref<number | string>("");
const assets = ref<Asset[]>([]);
const selectedAssetId = ref<number | string | null>(null);

const selectedAsset = computed(() => {
  if (selectedAssetId.value === null) return null;
  return assets.value.find((a) => String(a.id) === String(selectedAssetId.value)) || null;
});

function formatCurrency(val: number | string | null) {
  if (val === null || val === undefined) return "N/A";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(val));
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(dateStr: string | null) {
  if (!dateStr) return "N/A";
  return new Date(`${dateStr.slice(0, 10)}T00:00:00`).toLocaleDateString("pt-BR");
}

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maturity = new Date(`${dateStr.slice(0, 10)}T00:00:00`);
  return Math.ceil((maturity.getTime() - today.getTime()) / 86400000);
}

function maturityLabel(dateStr: string | null) {
  const days = daysUntil(dateStr);
  if (days === null) return "Prazo não informado";
  if (days < 0) return "Título vencido";
  if (days === 0) return "Vence hoje";
  return `${days.toLocaleString("pt-BR")} dias restantes`;
}

function formatNumber(val: number | string | null, decimals = 2) {
  if (val === null || val === undefined) return "N/A";
  return Number(val).toFixed(decimals);
}

async function loadCarteiras() {
  const res = await api.post("/carteira_load");
  carteiras.value = res.data || [];

  if (carteiras.value.length > 0 && !selectedCarteira.value) {
    selectedCarteira.value = carteiras.value[0].CarteiraID;
  }
}

async function loadAssets() {
  if (!selectedCarteira.value) {
    assets.value = [];
    selectedAssetId.value = null;
    return;
  }

  loadingAssets.value = true;
  try {
    const res = await api.post("/carteira_ativos", {
      cID: selectedCarteira.value,
    });
    assets.value = res.data || [];
    selectedAssetId.value = assets.value.length > 0 ? assets.value[0].id : null;
  } catch (error) {
    console.error("Erro ao buscar ativos:", error);
    assets.value = [];
    selectedAssetId.value = null;
  } finally {
    loadingAssets.value = false;
  }
}

watch(selectedCarteira, async () => {
  await loadAssets();
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
      await loadAssets();
    }
  } catch (error) {
    console.error("Erro ao carregar análise de ativos:", error);
    router.push("/");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="analise-ativos page-panel">
    <div class="page-header analise-header">
      <div>
        <h1 class="page-title">Análise de Ativos</h1>
        <p class="page-subtitle">
          Selecione uma carteira para ver os ativos e seus indicadores fundamentalistas.
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

    <div v-if="loading" class="analise-loading">
      <Spinner />
    </div>

    <template v-else>
      <div class="analise-grid">
        <aside class="sidebar-card">
          <div class="sidebar-header">
            <span class="sidebar-title">Ativos Cadastrados</span>
          </div>

          <div v-if="loadingAssets" class="state-container">
            <Spinner />
          </div>

          <div v-else-if="assets.length === 0" class="empty-state">
            Nenhum ativo encontrado nesta carteira.
          </div>

          <ul v-else class="asset-list">
            <li
              v-for="asset in assets"
              :key="asset.id"
              class="asset-item"
              :class="{ active: selectedAssetId === asset.id }"
              @click="selectedAssetId = asset.id"
            >
              <div class="asset-info">
                <span class="ticker">{{ asset.ticker || asset.codigotitulo || "Tesouro Direto" }}</span>
                <span class="name">{{ asset.descricao }}</span>
              </div>
              <span class="badge">{{ asset.tipo }}</span>
            </li>
          </ul>
        </aside>

        <main class="details-card">
          <Transition name="fade-slide" mode="out-in">
            <div v-if="selectedAsset" :key="selectedAsset.id" class="asset-details">
              <div class="details-header">
                <div>
                  <span class="asset-type-tag">{{ selectedAsset.tipo }}</span>
                  <h2 class="asset-ticker-title">
                    {{ selectedAsset.ticker || selectedAsset.codigotitulo || "Tesouro Direto" }}
                  </h2>
                  <p class="company-name">{{ selectedAsset.descricao }}</p>
                </div>
                <div class="price-container">
                  <span class="price-label">
                    {{ selectedAsset.tipo === "Tesouro Direto" ? "Valor Investido" : "Preço Atual" }}
                  </span>
                  <strong class="price-value">
                    {{ formatCurrency(
                      selectedAsset.tipo === "Tesouro Direto"
                        ? selectedAsset.valorinvestido
                        : selectedAsset.precoatual,
                    ) }}
                  </strong>
                </div>
              </div>

              <hr class="divider" />

              <div v-if="selectedAsset.tipo === 'Tesouro Direto'" class="fixed-income-summary">
                <div class="fixed-income-heading">
                  <div>
                    <span class="section-kicker">Detalhes do título</span>
                    <h3>Informações do Tesouro Direto</h3>
                  </div>
                  <span class="maturity-status">{{ maturityLabel(selectedAsset.vencimento) }}</span>
                </div>

                <div class="metrics-grid">
                  <div class="metric-card highlight">
                    <span class="metric-label">Código do título</span>
                    <strong class="metric-value font-md">{{ selectedAsset.codigotitulo || "N/A" }}</strong>
                    <span class="metric-sub">Identificação oficial</span>
                  </div>

                  <div class="metric-card highlight">
                    <span class="metric-label">Investimento mínimo</span>
                    <strong class="metric-value">{{ formatCurrency(selectedAsset.investimentominimo) }}</strong>
                    <span class="metric-sub">Valor mínimo informado</span>
                  </div>

                  <div class="metric-card highlight">
                    <span class="metric-label">Vencimento</span>
                    <strong class="metric-value font-md">{{ formatDateOnly(selectedAsset.vencimento) }}</strong>
                    <span class="metric-sub">Data final do título</span>
                  </div>
                </div>
              </div>

              <div v-else class="metrics-grid">
                <div class="metric-card highlight">
                  <span class="metric-label">P/VP</span>
                  <strong class="metric-value">{{ formatNumber(selectedAsset.pvp) }}</strong>
                  <span class="metric-sub">Preço / Valor Patrimonial</span>
                </div>

                <div class="metric-card highlight">
                  <span class="metric-label">Dividend Yield</span>
                  <strong class="metric-value">{{ formatNumber(selectedAsset.dividendyield) }}%</strong>
                  <span class="metric-sub">Indicador Anual</span>
                </div>

                <div class="metric-card highlight">
                  <span class="metric-label">Beta</span>
                  <strong class="metric-value">
                    {{ formatNumber(selectedAsset.beta, 4) }}
                  </strong>
                  <span class="metric-sub">Sensibilidade ao Ibovespa</span>
                </div>

                <div class="metric-card">
                  <span class="metric-label">P/L</span>
                  <strong class="metric-value">{{ formatNumber(selectedAsset.pl) }}</strong>
                  <span class="metric-sub">Preço / Lucro</span>
                </div>

                <div class="metric-card">
                  <span class="metric-label">Quantidade</span>
                  <strong class="metric-value">{{ selectedAsset.quantidade }}</strong>
                  <span class="metric-sub">Em Carteira</span>
                </div>

                <div class="metric-card">
                  <span class="metric-label">Valor Investido</span>
                  <strong class="metric-value font-md">{{ formatCurrency(selectedAsset.valorinvestido) }}</strong>
                  <span class="metric-sub">Custo Total</span>
                </div>

                <div class="metric-card">
                  <span class="metric-label">Última Atualização</span>
                  <strong class="metric-value font-sm">{{ formatDate(selectedAsset.dataatualizacao) }}</strong>
                  <span class="metric-sub">Data de Cotação</span>
                </div>
              </div>

              <div v-if="selectedAsset.tipo === 'Tesouro Direto'" class="metrics-grid investment-summary">
                <div class="metric-card">
                  <span class="metric-label">Quantidade</span>
                  <strong class="metric-value">{{ selectedAsset.quantidade }}</strong>
                  <span class="metric-sub">Em Carteira</span>
                </div>

                <div class="metric-card">
                  <span class="metric-label">Valor Investido</span>
                  <strong class="metric-value font-md">{{ formatCurrency(selectedAsset.valorinvestido) }}</strong>
                  <span class="metric-sub">Custo Total</span>
                </div>
              </div>
            </div>

            <div v-else class="empty-state">
              Selecione um ativo para visualizar seus dados detalhados.
            </div>
          </Transition>
        </main>
      </div>
    </template>
  </div>
</template>

<style scoped>
.analise-ativos {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.analise-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  text-align: left;
  margin-bottom: 0;
}

.carteira-select {
  min-width: 260px;
}

.analise-loading {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.analise-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.25rem;
  align-items: stretch;
}

.sidebar-card,
.details-card {
  background: rgba(15, 23, 42, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  backdrop-filter: blur(14px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
  padding: 1.25rem;
}

.sidebar-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-title {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.asset-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.asset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  border-radius: 16px;
  background: rgba(2, 6, 23, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.asset-item:hover {
  border-color: rgba(96, 165, 250, 0.3);
  background: rgba(37, 99, 235, 0.1);
}

.asset-item.active {
  background: rgba(37, 99, 235, 0.2);
  border-color: #2563eb;
}

.ticker {
  font-weight: 700;
  color: #f8fafc;
  display: block;
}

.name {
  font-size: 0.8rem;
  color: #94a3b8;
  display: block;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.asset-type-tag {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #60a5fa;
  letter-spacing: 0.05em;
}

.asset-ticker-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0.2rem 0;
}

.company-name {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
}

.price-container {
  text-align: right;
}

.price-label {
  display: block;
  font-size: 0.85rem;
  color: #94a3b8;
}

.price-value {
  font-size: 1.75rem;
  color: #f8fafc;
}

.fixed-income-summary {
  padding: 1.1rem;
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 18px;
  background: rgba(120, 53, 15, 0.12);
}

.fixed-income-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-kicker {
  display: block;
  color: #fbbf24;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.fixed-income-heading h3 {
  margin: 0.25rem 0 0;
  color: #f8fafc;
  font-size: 1.1rem;
}

.maturity-status {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  color: #fef3c7;
  background: rgba(245, 158, 11, 0.18);
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.investment-summary {
  margin-top: 1rem;
}

.divider {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 1.25rem 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 16px;
  background: rgba(2, 6, 23, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.metric-card.highlight {
  background: rgba(37, 99, 235, 0.1);
  border-color: rgba(96, 165, 250, 0.2);
}

.metric-label {
  font-size: 0.85rem;
  color: #94a3b8;
}

.metric-value {
  font-size: 1.4rem;
  color: #f8fafc;
  margin-top: 0.3rem;
}

.metric-sub {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.font-md {
  font-size: 1.15rem;
}

.font-sm {
  font-size: 0.85rem;
}

.state-container,
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 220px;
  color: #94a3b8;
  font-size: 0.95rem;
  text-align: center;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

@media (max-width: 1100px) {
  .analise-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analise-header {
    flex-direction: column;
    align-items: stretch;
  }

  .carteira-select {
    min-width: 0;
    width: 100%;
  }

  .details-header {
    flex-direction: column;
    gap: 1rem;
  }

  .price-container {
    text-align: left;
  }

  .fixed-income-heading {
    flex-direction: column;
  }
}
</style>