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

async function verifyUser() {
  try {
    const res = await api.get("/verify_session");
    if (res.status === 200 && res.data.authenticated) {
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
    <Header showPerfil />
    <div class="menu-layout">
      <Sidebar />
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
  padding: 1.5rem;
  width: 100%;
}

.main-card {
  width: 100%;
  max-width: 1100px;
  background-color: #121824;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #1e293b;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  color: #ffffff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.greeting-section {
  flex: 1;
}

.texto-titulo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 0.75rem;
}

.text {
  color: #94a3b8;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.carteira {
  background-color: #2563eb;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.carteira:hover {
  background-color: #1d4ed8;
}

.quotes-section {
  width: 300px;
  background-color: #1a2234;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #2a364f;
}

.divider {
  border: 0;
  height: 1px;
  background: #1e293b;
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
  color: #f8fafc;
  margin: 0;
}

.carousel-controls button {
  background: #1a2234;
  border: 1px solid #2a364f;
  color: #fff;
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
  background-color: #1a2234;
  border-radius: 10px;
  padding: 1.2rem;
  border: 1px solid #2a364f;
}

.news-content h4 {
  margin: 0;
}

.news-content h4 a {
  color: #60a5fa;
  text-decoration: none;
}

.news-content h4 a:hover {
  text-decoration: underline;
}

.news-content p {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0.5rem 0 1rem 0;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
}

.news-loading,
.news-empty {
  color: #64748b;
  font-size: 0.9rem;
  padding: 1rem 0;
}
</style>