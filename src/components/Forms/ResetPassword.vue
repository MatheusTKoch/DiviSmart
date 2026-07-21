<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../api/main";
import Toast from "../UI/Toast.vue";
import { Motion } from "@motionone/vue";

const route = useRoute(); 
const router = useRouter();

const token = ref("");
const password = ref("");
const passwordConfirm = ref("");

const showToast = ref(false);
const toastMsg = ref("");
const toastSucesso = ref(false);

onMounted(() => {
  const routeToken = route.query.token?.toString;
  if (routeToken) {
    token.value = Array.isArray(routeToken) ? routeToken[0] : routeToken;
  } else {
    triggerToast("Token de redefinição inválido ou ausente.");
  }
});

function triggerToast(message: string, success: boolean = false) {
  toastMsg.value = message;
  toastSucesso.value = success;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
    if (success) {
      router.push("/");
    }
  }, 3000);
}

async function resetPassword() {
  if (password.value === "" || passwordConfirm.value === "") {
    triggerToast("Por favor, preencha ambos os campos de senha.");
    return;
  }
  if (password.value !== passwordConfirm.value) {
    triggerToast("As senhas não coincidem.");
    return;
  }
  if (!token.value) {
    triggerToast("Token de redefinição não encontrado.");
    return;
  }

  try {
    await api.post("/reset-password", {
      token: token.value,
      password: password.value,
    });
    triggerToast("Sua senha foi redefinida com sucesso!", true);
  } catch (err: any) {
    const msg = err.response?.data?.message || "Erro ao redefinir a senha.";
    triggerToast(msg);
  }
}
</script>

<template>
  <div class="page-center app-shell">
    <Toast v-if="showToast" :sucesso="toastSucesso" position="center">
      {{ toastMsg }}
    </Toast>

    <Motion
      tag="div"
      class="auth-card centered-card"
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6 }"
    >
      <div class="card-header">
        <h1 class="titulo">Redefinir Senha</h1>
        <p class="subtitulo">Crie uma nova senha para sua conta.</p>
      </div>

      <form class="stack" @submit.prevent="resetPassword">
        <div class="field-group">
          <label for="password" class="field-label">Nova Senha</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="••••••••"
            class="field-input"
            required
          />
        </div>
        <div class="field-group">
          <label for="passwordConfirm" class="field-label">
            Confirmar Nova Senha
          </label>
          <input
            type="password"
            id="passwordConfirm"
            v-model="passwordConfirm"
            placeholder="••••••••"
            class="field-input"
            required
          />
        </div>

        <button class="button-primary" type="submit">Redefinir Senha</button>
      </form>
    </Motion>
  </div>
</template>

<style scoped>
.card-header {
  text-align: center;
}

.card-header .titulo {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.card-header .subtitulo {
  font-size: 0.95rem;
  color: #94a3b8;
  margin-bottom: 24px;
}
</style>
