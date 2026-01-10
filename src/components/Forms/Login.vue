<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";
import Header from "../UI/Header.vue";
import axios from "axios";
import { useRouter } from "vue-router";

onMounted(() => {
  verifyUser();
});

const router = useRouter();
let email = ref("");
let senha = ref("");
let showPassword = ref(false);

function verifyUser() {
  axios
    .post("http://localhost:3000/session", {
      usID: localStorage.getItem("usID"),
      sID: localStorage.getItem("sID"),
      exp: localStorage.getItem("exp"),
    })
    .then((res) => {
      if (res.status == 200) {
        router.push("menu");
      }
      console.log(res);
    })
    .catch((err) => {
      if (
        err.response.data == "Sessao expirada" &&
        err.response.status == 401
      ) {
        localStorage.removeItem("usID");
        localStorage.removeItem("exp");
        localStorage.removeItem("sID");
      }
    });
}

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

async function login() {
  if (email.value === "" || senha.value === "") {
    alert("Verifique os campos informados e tente novamente!");
  } else {
    let dados = new URLSearchParams();
    dados.append("email", email.value);
    dados.append("senha", senha.value);
    await axios
      .post("http://localhost:3000/users_login", dados)
      .then((res) => {
        if (res.status == 200) {
          router.push("menu");
        }

        if (localStorage.getItem("usID") != res.data.usID) {
          localStorage.clear();
          localStorage.setItem("usID", res.data.usID);
          localStorage.setItem("exp", res.data.exp);
          localStorage.setItem("sID", res.data.sID);
        } else if (localStorage.getItem("usID") == res.data.usID) {
          localStorage.setItem("exp", res.data.exp);
          localStorage.setItem("sID", res.data.sID);
        } else {
          localStorage.setItem("usID", res.data.usID);
          localStorage.setItem("exp", res.data.exp);
          localStorage.setItem("sID", res.data.sID);
        }
      })
      .catch((err) => {
        alert(err.response.data);
        console.log(err);
      });
  }
}
</script>

<template>
  <div class="auth-container">
    <Header />

    <main class="auth-main">
      <Motion
        :initial="{ opacity: 0, x: -20 }"
        :animate="{ opacity: 1, x: 0 }"
        class="back-wrapper"
      >
        <button @click="router.push('/')" class="btn-back">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            fill="currentColor"
          >
            <path
              d="m287-446.67 240 240L480-160 160-480l320-320 47 46.67-240 240h513v66.66H287Z"
            />
          </svg>
          <span>Voltar</span>
        </button>
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
  </div>
</template>

<style scoped>
.auth-container {
  background-color: #020617;
  min-height: 100vh;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
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

.back-wrapper {
  position: absolute;
  top: 100px;
  left: 8%;
}

.btn-back {
  background: transparent;
  border: none;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: color 0.3s;
}

.btn-back:hover {
  color: #f8fafc;
}

.login-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  padding: 40px;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
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
  margin-bottom: 20px;
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
  padding: 14px 16px;
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
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.password-wrapper {
  width: 100%;
}

.pass-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s,
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
  margin-top: 24px;
  font-size: 0.9rem;
  color: #94a3b8;
  text-align: center;
}

.back-wrapper {
  position: absolute;
  top: 40px;
  left: 40px;
}

@media (max-width: 640px) {
  .back-wrapper {
    top: 20px;
    left: 20px;
  }

  .login-card {
    padding: 30px 24px;
    max-width: 90%;
    background: rgba(30, 41, 59, 0.6);
  }
}
</style>
