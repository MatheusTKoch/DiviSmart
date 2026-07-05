<script setup lang="ts">
import Header from "../UI/Header.vue";
import Sidebar from "../UI/Sidebar.vue";
import api from "../../api/main";
import { nextTick, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Cotacoes from "./Cotacoes.vue";
import Spinner from "../UI/Spinner.vue";

const router = useRouter();
const route = useRoute();

let nome = ref("");
let horario = ref("");
let loading = ref(true);

async function verifyUser() {
  try {
    const res = await api.get("/verify_session");
    if (res.status === 200 && res.data.authenticated) {
      await getUserName();
      loadHorario();
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

function loadHorario() {
  let hora = new Date().getHours();

  if (hora <= 12) {
    horario.value = "bom dia";
  }

  if (hora > 12 && hora <= 18) {
    horario.value = "boa tarde";
  }

  if (hora >= 19) {
    horario.value = "boa noite";
  }
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
        <Cotacoes v-if="route.path === '/menu'" />
        <div v-if="loading" class="menu-state">
          <Spinner />
        </div>
        <div v-else>
          <div v-if="route.path === '/menu'" class="conteudo page-panel">
            <div class="texto-titulo">Olá {{ nome }}, {{ horario }}!</div>
            <div class="text">
              Inicie sua carteira para fazer o acompanhamento clicando no botão
              abaixo, e após tenha acesso a relatórios personalizados!
            </div>
            <button class="button-primary carteira" @click="router.push('/menu/carteira')">
              Criar/Acompanhar Carteira
            </button>
          </div>
          <RouterView v-else />
        </div>
      </main>
    </div>
  </div>
</template>
