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
  <div class="auth-container">
    <Toast v-if="showToast" :sucesso="toastSucesso" position="center">
      {{ toastMsg }}
    </Toast>

    <Motion
      tag="div"
      class="forgot-password-card"
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

      <form class="conteudo" @submit.prevent="sendResetLink">
        <div class="input-group">
          <label for="email">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="seu@email.com.br"
            required
          />
        </div>

        <button class="btn-primary" type="submit">
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
.auth-container {
  background-color: #020617;
  color: #f8fafc;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.forgot-password-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  padding: 32px;
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
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

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 22px;
  width: 100%;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #cbd5e1;
  text-align: left;
  padding-left: 4px;
}

input[type="email"] {
  box-sizing: border-box;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 14px;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
  width: 100%;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
}

.btn-primary {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #2563eb;
  transform: scale(1.02);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
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
