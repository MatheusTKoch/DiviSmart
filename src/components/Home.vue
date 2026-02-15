<script setup lang="ts">
import { Motion } from "@motionone/vue";
import Header from "./UI/Header.vue";
import Footer from "./UI/Footer.vue";
import { ref } from "vue";
import { onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

onMounted(() => {
  verifyUser();
});

const router = useRouter();
const api = axios.create({ baseURL: "http://localhost:3000", withCredentials: true });

let email = ref("");
let senha = ref("");
let showPassword = ref(false);

async function verifyUser() {
  try {
    const res = await api.get("/verify_session");
    if (res.status === 200) {
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
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const res = await api.post("/users_login", {
      email: email.value,
      senha: senha.value,
    });

    if (res.status === 200) {
      localStorage.setItem("user_name", res.data.Nome);
      router.push("menu");
    }
  } catch (err: any) {
    const msg = err.response?.data || "Erro ao conectar ao servidor";
    alert(msg);
  }
}
</script>

<template>
  <div class="app-container">
    <Header />

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
          <button class="btn-secondary">Ver Demonstração</button>
        </div>
      </Motion>

      <Motion
        tag="div"
        class="login-card"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
      >
        <div class="card-header">
          <h1 class="titulo">Bem-vindo de volta</h1>
          <p class="subtitulo">Acesse sua conta DiviSmart</p>
        </div>

        <form class="conteudo" @submit.prevent="login">
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

          <div class="input-group">
            <label for="password">Senha</label>
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="senha"
                @keypress.enter="login"
                placeholder="••••••••"
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
            <a href="#" class="forgot-link">Esqueceu a senha?</a>
          </div>

          <button class="btn-login" type="submit">
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
.app-container {
  background-color: #020617;
  color: #f8fafc;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.app-container > * {
  position: relative;
  z-index: 1;
}

.hero-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  padding: 0 5%;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  height: calc(100vh - 160px);
}

.main-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1.2;
  font-weight: 600;
  margin-bottom: 0.8rem;
}

.card-header .titulo {
  font-size: 1.5rem;
  margin-bottom: 4px;
}
.card-header .subtitulo {
  font-size: 0.9rem;
  margin-bottom: 20px;
}
.input-group {
  margin-bottom: 14px;
}

.gradient-text {
  background: linear-gradient(to right, #60a5fa, #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.description {
  font-size: clamp(0.9rem, 1.5vw, 1.05rem);
  color: #94a3b8;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  max-width: 480px;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background: #3b82f6;
  border: none;
  padding: 0.9rem 1.8rem;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  padding: 0.9rem 1.8rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
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
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 8px;
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 2;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.55);
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
    rgba(59, 130, 246, 0.1) 0%,
    transparent 70%
  );
  z-index: -1;
  pointer-events: none;
}

.auth-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.login-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  padding: 28px;
  border-radius: 20px;
  width: 100%;
  max-width: 380px;
  margin-left: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
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
  margin-bottom: 18px;
  width: 100%;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #cbd5e1;
  text-align: left;
  padding-left: 4px;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  box-sizing: border-box;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 14px;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
  width: 100%;
  margin: 0;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
}

.password-wrapper {
  width: 100%;
}

.pass-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 0.85rem;
  width: 100%;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #94a3b8;
  user-select: none;
}

.btn-login {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition:
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s,
    box-shadow 0.3s;
}

.btn-login:hover {
  background: #2563eb;
  transform: scale(1.02);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}

.btn-login:active {
  transform: scale(0.98);
}

.footer-text {
  margin-top: 20px;
  font-size: 0.9rem;
  color: #94a3b8;
  text-align: center;
}

@media (max-width: 640px) {
  .login-card {
    padding: 30px 24px;
    max-width: 90%;
    background: rgba(30, 41, 59, 0.6);
  }
  .hero-grid {
    grid-template-columns: 1fr;
    padding: 60px 5% 40px 5%;
    gap: 2.4rem;
  }
  .app-container::before {
    background: #020617;
  }
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 100px 5% 40px 5%;
    gap: 3rem;
  }
  .actions {
    justify-content: center;
  }
  .description {
    margin: 0 auto 2.5rem auto;
  }
  .main-chart {
    max-width: 100%;
  }
}
</style>
