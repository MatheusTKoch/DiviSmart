<script setup lang="ts">
import { ref } from "vue";
import api from "../../api/main";
import Toast from "../UI/Toast.vue";
import { Motion } from "@motionone/vue";

const email = ref("");
const showToast = ref(false);
const toastMsg = ref("");
const toastSucesso = ref(false);

function triggerToast(message: string, success: boolean = false) {
  toastMsg.value = message;
  toastSucesso.value = success;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

async function sendResetLink() {
  if (email.value === "") {
    triggerToast("Por favor, insira seu e-mail.");
    return;
  }

  try {
    await api.post("/forgot-password", { email: email.value });
    triggerToast("Um link para redefinição de senha foi enviado para seu e-mail.", true);
  } catch (err: any) {
    const msg = err.response?.data || "Erro ao enviar o link de redefinição.";
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
        <h1 class="titulo">Esqueceu sua senha?</h1>
        <p class="subtitulo">
          Insira seu e-mail para receber um link de redefinição.
        </p>
      </div>

      <form class="stack" @submit.prevent="sendResetLink">
        <div class="field-group">
          <label for="email" class="field-label">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="seu@email.com.br"
            class="field-input"
            required
          />
        </div>

        <button class="button-primary" type="submit">
          Enviar Link de Redefinição
        </button>
      </form>

      <p class="footer-text">
        Lembrou da senha?
        <RouterLink to="/" class="login-link">Faça login</RouterLink>
      </p>
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

.footer-text {
  margin-top: 24px;
  font-size: 0.9rem;
  color: #94a3b8;
}

.login-link {
  color: #60a5fa;
  text-decoration: none;
  font-weight: 500;
}
.login-link:hover {
  text-decoration: underline;
}
</style>
