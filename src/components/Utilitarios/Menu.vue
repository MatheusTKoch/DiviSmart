<script setup lang="ts">
import Header from "../UI/Header.vue";
import Sidebar from "../UI/Sidebar.vue";
import api from "../../api/main";
import { nextTick, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Cotacoes from "./Cotacoes.vue";
import Spinner from "../UI/Spinner.vue";

interface Noticia {
  noticiaid: number;
  titulo: string;
  resumo: string;
  fonte: string;
  link: string;
  dataatualizacao: string;
}

const router = useRouter();
const route = useRoute();

let nome = ref("");
let horario = ref("");
let loading = ref(true);

const noticias = ref<Noticia[]>([]);
const carregandoNoticias = ref(true);
const currentNewsIndex = ref(0);
const canLogout = ref(true);
const isDemo = ref(false);

async function verifyUser() {
  try {
    const res = await api.get("/verify_session");
    if (res.status === 200 && res.data.authenticated) {
      canLogout.value = res.data.canLogout !== false;
      isDemo.value = res.data.isDemo === true;
      await getUserName();
      loadHorario();
      if (route.path === '/menu') {
        await fetchNoticias();
      }
    } else {
      router.push("/");
    }
  } catch (err) {
    console.error("Erro na verificação de sessão:", err);
    router.push("/");
  }
}

async function getUserName() {
  try {
    const res = await api.get("/get_user_name");
    if (res.status === 200) {
      nextTick(() => {
        nome.value = res.data.Nome;
      });
    }
  } catch (err) {
    console.error("Erro ao carregar nome do usuário:", err);
    router.push("/");
  }
}

async function fetchNoticias() {
  try {
    carregandoNoticias.value = true;
    const res = await api.get("/noticias");
    if (res.status === 200) {
      noticias.value = res.data;
    }
  } catch (err) {
    console.error("Erro ao carregar notícias:", err);
  } finally {
    carregandoNoticias.value = false;
  }
}

function loadHorario() {
  const hora = new Date().getHours();

  if (hora < 12) {
    horario.value = "bom dia";
  } else if (hora >= 12 && hora < 18) {
    horario.value = "boa tarde";
  } else {
    horario.value = "boa noite";
  }
}

function formatarData(dataStr: string) {
  if (!dataStr) return "";
  const date = new Date(dataStr);
  return (
    date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) +
    " às " +
    date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

function prevNews() {
  if (currentNewsIndex.value > 0) currentNewsIndex.value--;
}

function nextNews() {
  if (currentNewsIndex.value < noticias.value.length - 1) currentNewsIndex.value++;
}

onMounted(async () => {
  try {
    await verifyUser();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

watch(
  () => route.fullPath,
  async () => {
    loading.value = true;
    try {
      await verifyUser();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  },
);
</script>

<template>
  <div class="menu-shell">
    <Header :showPerfil="true" :showLogout="canLogout" />
    <div class="menu-layout">
      <Sidebar :is-demo="isDemo" />
      <main class="menu-main">
        <div v-if="loading" class="menu-state">
          <Spinner />
        </div>
        <div v-else>
          <div v-if="route.path === '/menu'" class="main-card-wrapper">
            <div class="main-card">
              
              <div class="card-header">
                <div class="greeting-section">
                  <div class="texto-titulo">Olá {{ nome }}, {{ horario }}!</div>
                  <div class="text">
                    Inicie sua carteira para fazer o acompanhamento clicando no botão
                    abaixo, e após tenha acesso a relatórios personalizados!
                  </div>
                  <button class="button-primary carteira" @click="router.push('/menu/carteira')">
                    Criar/Acompanhar Carteira
                  </button>
                </div>

                <div class="quotes-section">
                  <Cotacoes />
                </div>
              </div>

              <hr class="divider" />

              <div class="news-section">
                <div class="news-header">
                  <h3>Notícias do Mercado (B3)</h3>
                  <div class="carousel-controls" v-if="noticias.length > 0">
                    <button @click="prevNews" :disabled="currentNewsIndex === 0">‹</button>
                    <button @click="nextNews" :disabled="currentNewsIndex >= noticias.length - 1">›</button>
                  </div>
                </div>

                <div v-if="carregandoNoticias" class="news-loading">
                  <Spinner />
                </div>

                <div v-else-if="noticias.length > 0" class="carousel-container">
                  <div class="news-card">
                    <div class="news-content">
                      <h4>
                        <a :href="noticias[currentNewsIndex].link" target="_blank" rel="noopener noreferrer">
                          {{ noticias[currentNewsIndex].titulo }}
                        </a>
                      </h4>
                      <p>{{ noticias[currentNewsIndex].resumo }}</p>
                      <div class="news-footer">
                        <span class="news-source">Fonte: {{ noticias[currentNewsIndex].fonte }}</span>
                        <span class="news-date">
                          Atualizado em: {{ formatarData(noticias[currentNewsIndex].dataatualizacao) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="news-empty">
                  Nenhuma notícia encontrada para hoje.
                </div>
              </div>

            </div>
          </div>
          <RouterView v-else />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-card-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0.5rem 0 1.5rem;
  width: 100%;
}

.main-card {
  width: 100%;
  min-width: 0;
  max-width: 1100px;
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  padding: 2rem;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-soft);
  color: var(--text-main);
  backdrop-filter: blur(14px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  min-width: 0;
}

.greeting-section {
  flex: 1;
  min-width: 0;
}

.texto-titulo {
  font-size: 1.8rem;
  font-weight: 800;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.75rem;
}

.text {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.quotes-section {
  flex: 0 1 300px;
  max-width: 320px;
  width: 100%;
  background: var(--bg-surface-strong);
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.divider {
  border: 0;
  height: 1px;
  background: var(--border-subtle);
  margin: 2rem 0;
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.news-header h3 {
  font-size: 1.2rem;
  color: var(--text-main);
  margin: 0;
}

.carousel-controls button {
  background: var(--bg-surface-strong);
  border: 1px solid var(--border-subtle);
  color: var(--text-main);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  margin-left: 0.5rem;
  cursor: pointer;
}

.carousel-controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.news-card {
  background: var(--bg-surface-strong);
  border-radius: var(--radius-md);
  padding: 1.2rem;
  border: 1px solid var(--border-subtle);
}

.news-content h4 {
  margin: 0;
}

.news-content h4 a {
  color: var(--accent-soft);
  text-decoration: none;
}

.news-content h4 a:hover {
  text-decoration: underline;
}

.news-content p {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0.5rem 0 1rem 0;
  overflow-wrap: anywhere;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
  gap: 0.5rem;
}

.news-loading,
.news-empty {
  color: #64748b;
  font-size: 0.9rem;
  padding: 1rem 0;
}

@media (max-width: 1024px) {
  .card-header {
    flex-wrap: wrap;
  }

  .quotes-section {
    flex: 1 1 100%;
    max-width: none;
  }
}

@media (max-width: 768px) {
  .main-card-wrapper {
    padding: 0.75rem 0;
  }

  .main-card {
    padding: 1.25rem;
  }

  .card-header {
    flex-direction: column;
    gap: 1.25rem;
  }

  .quotes-section {
    width: 100%;
    max-width: none;
  }

  .divider {
    margin: 1.5rem 0;
  }

  .news-header {
    align-items: flex-start;
    gap: 0.75rem;
  }

  .news-header h3 {
    font-size: 1rem;
  }

  .news-footer {
    flex-direction: column;
    gap: 0.35rem;
  }
}

@media (max-width: 480px) {
  .main-card {
    padding: 1rem;
    border-radius: var(--radius-lg);
  }

  .texto-titulo {
    font-size: 1.45rem;
  }

  .text {
    font-size: 0.9rem;
  }

  .carteira {
    width: 100%;
  }
}
</style>