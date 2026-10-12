<script setup lang="ts">
import { Motion } from "@motionone/vue";
import Header from "./UI/Header.vue";
import Footer from "./UI/Footer.vue";
import Toast from "./UI/Toast.vue";
import { ref } from "vue";
import { onMounted } from "vue";
import api from "../api/main";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  verifyUser();
});

let email = ref("");
let senha = ref("");
let showPassword = ref(false);

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

async function verifyUser() {
  try {
    const res = await api.get("/verify_session");
    if (res.status === 200) {
      if (res.data.token) {
        localStorage.setItem("auth_token", res.data.token);
      }
      router.push("menu");
    }
  } catch (err) {
    console.log("Sessão expirada ou usuário não logado");
    localStorage.removeItem("user_name");
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

async function login() {
  if (email.value === "" || senha.value === "") {
    triggerToast("Preencha todos os campos!");
    return;
  }

  try {
    const res = await api.post("/users_login", {
      email: email.value,
      senha: senha.value,
    });

    if (res.status === 200) {
      router.push("menu");
    }
  } catch (err: any) {
    const msg = err.response?.data || "Erro ao conectar ao servidor";
    triggerToast(msg);
  }
}
</script>

<template>
  <div class="app-shell">
    <Header />

    <Toast v-if="showToast" :sucesso="toastSucesso">
      {{ toastMsg }}
    </Toast>

    <main class="hero-grid">
      <Motion
        class="hero-content"
        :initial="{ opacity: 0, x: -40 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.8, easing: 'ease-out' }"
      >
        <div class="hero-visual">
          <Motion
            class="glass-card"
            :initial="{ opacity: 0, scale: 0.9 }"
            :animate="{
              opacity: 1,
              scale: 0.8,
              y: [0, -20, 0],
            }"
            :transition="{
              opacity: { duration: 1 },
              scale: { duration: 1 },
              y: { duration: 5, repeat: Infinity, easing: 'ease-in-out' },
            }"
          >
            <img
              src="../assets/graph.png"
              alt="Análise de Dividendos"
              class="main-chart"
            />
            <div class="glow-effect"></div>
          </Motion>
        </div>
        <h1 class="main-title">
          Seu Guia Inteligente de <br />
          <span class="gradient-text">Dividendos e Investimentos</span>
        </h1>
        <p class="description">
          Acompanhe seus ganhos, visualize dividendos e maximize o retorno dos
          seus investimentos – tudo em um só lugar.
        </p>

        <div class="actions">
          <Motion
            tag="button"
            :hover="{ scale: 1.05 }"
            :press="{ scale: 0.95 }"
            class="btn-primary"
          >
            <RouterLink to="/register" class="link"
              >Criar Conta Gratuita</RouterLink
            >
          </Motion>
          <button class="btn-secondary" @click="router.push('/demo')">
            Ver Demonstração
          </button>
        </div>
      </Motion>

      <Motion
        tag="div"
        class="login-card auth-card centered-card"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
      >
        <div class="card-header">
          <h1 class="titulo">Bem-vindo de volta</h1>
          <p class="subtitulo">Acesse sua conta DiviSmart</p>
        </div>

        <form class="conteudo stack" @submit.prevent="login">
          <div class="field-group input-group">
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

          <div class="field-group input-group">
            <label for="password" class="field-label">Senha</label>
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="senha"
                @keypress.enter="login"
                placeholder="••••••••"
                class="field-input"
                required
              />
            </div>
          </div>

          <div class="pass-options">
            <label class="checkbox-container">
              <input type="checkbox" @change="togglePassword" />
              <span class="checkmark"></span>
              Mostrar Senha
            </label>
            <RouterLink to="/forgot-password" class="forgot-link">Esqueceu a senha?</RouterLink>
          </div>

          <button class="button-primary btn-login" type="submit">
            Entrar
            <svg
              class="login_icon"
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="currentColor"
            >
              <path
                d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"
              />
            </svg>
          </button>
        </form>

        <p class="footer-text">
          Não é cadastrado?
          <RouterLink to="/register" class="signup-link"
            >Crie sua conta</RouterLink
          >
        </p>
      </Motion>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.hero-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  padding: 1.5rem 5% 2.5rem;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  min-height: 0;
}

.main-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1.2;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: var(--text-main);
}

.card-header .titulo {
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.card-header .subtitulo {
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
}

.gradient-text {
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.description {
  font-size: clamp(0.9rem, 1.5vw, 1.05rem);
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  line-height: 1.55;
  max-width: 480px;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--gradient-accent);
  border: none;
  padding: 0.9rem 1.8rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-main);
  padding: 0.9rem 1.8rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.16);
}

.link {
  color: white;
  text-decoration: none;
}

.hero-visual {
  display: flex;
  justify-content: center;
  position: relative;
}

.glass-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 8px;
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 2;
  box-shadow: var(--shadow-soft);
}

.main-chart {
  max-width: 320px;
  height: auto;
}

.glow-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 110%;
  height: 110%;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.12) 0%,
    transparent 70%
  );
  z-index: -1;
  pointer-events: none;
}

.login-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  backdrop-filter: blur(14px);
  padding: 1.75rem;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 400px;
  margin-left: auto;
  box-shadow: var(--shadow-soft);
}

.conteudo {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0.25rem;
  width: 100%;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-soft);
  text-align: left;
  padding-left: 4px;
}

.pass-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  width: 100%;
  gap: 0.75rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: var(--text-muted);
  user-select: none;
}

.forgot-link {
  color: var(--accent-soft);
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
}

.forgot-link:hover {
  color: var(--accent);
  text-decoration: underline;
}

.btn-login {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.footer-text {
  margin-top: 1.25rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  text-align: center;
}

.signup-link {
  color: var(--accent-soft);
  font-weight: 600;
  text-decoration: none;
}

.signup-link:hover {
  color: var(--accent);
  text-decoration: underline;
}

@media (max-width: 640px) {
  .hero-grid {
    grid-template-columns: 1fr;
    padding: 1.5rem 1rem 2rem;
    gap: 1.75rem;
  }

  .hero-content {
    width: 100%;
  }

  .hero-visual {
    order: -1;
  }

  .main-chart {
    max-width: min(240px, 70vw);
  }

  .main-title {
    font-size: 1.7rem;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    text-align: center;
  }

  .login-card {
    padding: 1.5rem 1.25rem;
    max-width: 100%;
    margin: 0;
  }

  .pass-options {
    align-items: flex-start;
    flex-wrap: wrap;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 2.5rem 5% 2.5rem;
    gap: 2.5rem;
  }

  .actions {
    justify-content: center;
  }

  .description {
    margin: 0 auto 1.75rem;
  }

  .login-card {
    margin: 0 auto;
  }

  .main-chart {
    max-width: 280px;
  }
}
</style>
