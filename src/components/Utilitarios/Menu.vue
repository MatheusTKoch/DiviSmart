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
      if (res.data.carteiraId && route.path === "/menu") {
        router.push(`/menu/carteira/${res.data.carteiraId}`);
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
  <div>
    <Header showPerfil />
    <Sidebar />
    <Cotacoes v-if="route.path === '/menu'" />
    <div v-if="loading">
      <Spinner />
    </div>
    <div v-else>
      <div v-if="route.path === '/menu'" class="conteudo">
        <div class="texto-titulo">Olá {{ nome }}, {{ horario }}!</div>
        <div class="text">
          Inicie sua carteira para fazer o acompanhamento clicando no botão
          abaixo, e após tenha acesso a relatórios personalizados!
        </div>
        <button class="carteira" @click="router.push('/menu/carteira')">
          Criar/Acompanhar Carteira
        </button>
      </div>
      <RouterView v-else />
    </div>
  </div>
</template>

<style scoped>
button.carteira {
  background-color: transparent;
  font-size: large;
  margin-top: 5%;
  margin-left: 6rem;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border: none;
  color: #f8fafc;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

button.carteira:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

div.conteudo {
  position: absolute;
  top: 20%;
  left: 30%;
  color: ghostwhite;
}

div.text {
  font-size: medium;
  padding-top: 10%;
}

div.texto-titulo {
  position: relative;
  font-size: xx-large;
  left: 5%;
  padding-bottom: 2vh;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@media screen and (max-width: 480px) {
  div.texto-titulo {
    font-size: large;
  }

  div.text {
    font-size: small;
  }

  button.carteira {
    font-size: small;
  }
}
</style>
