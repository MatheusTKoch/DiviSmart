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
  const routeToken = route.query.token;
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
  <div class="auth-container">
    <Toast v-if="showToast" :sucesso="toastSucesso" position="center">
      {{ toastMsg }}
    </Toast>

    <Motion
      tag="div"
      class="reset-password-card"
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6 }"
    >
      <div class="card-header">
        <h1 class="titulo">Redefinir Senha</h1>
        <p class="subtitulo">Crie uma nova senha para sua conta.</p>
      </div>

      <form class="conteudo" @submit.prevent="resetPassword">
        <div class="input-group">
          <label for="password">Nova Senha</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="••••••••"
            required
          />
        </div>
        <div class="input-group">
          <label for="passwordConfirm">Confirmar Nova Senha</label>
          <input
            type="password"
            id="passwordConfirm"
            v-model="passwordConfirm"
            placeholder="••••••••"
            required
          />
        </div>

        <button class="btn-primary" type="submit">Redefinir Senha</button>
      </form>
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
}

.reset-password-card {
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

input[type="password"] {
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
</style>
