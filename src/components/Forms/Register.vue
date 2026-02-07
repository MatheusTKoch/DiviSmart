<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Header from "../UI/Header.vue";
import axios from "axios";

const router = useRouter();

let maxPass = ref(false);
let minPass = ref(false);
let numLetter = ref(false);
let like = ref(false);
let nameUndername = ref(false);

let email = ref("");
let nome = ref("");
let sobrenome = ref("");
let senha = ref("");
let senha2 = ref("");
let showPassword = ref(false);

function validarCadastrar() {
  maxPass.value = senha.value.length > 20;
  minPass.value = senha.value.length > 0 && senha.value.length < 8;
  numLetter.value =
    senha.value.length > 0 &&
    (!senha.value.match(/\d/) || !senha.value.match(/[A-Z]/));
  like.value = senha2.value.length > 0 && senha.value !== senha2.value;
  nameUndername.value =
    nome.value.trim() === "" || sobrenome.value.trim() === "";

  return (
    !maxPass.value &&
    !minPass.value &&
    !numLetter.value &&
    !like.value &&
    !nameUndername.value &&
    email.value !== ""
  );
}

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

async function register() {
  validarCadastrar();
  if (
    maxPass.value ||
    minPass.value ||
    numLetter.value ||
    like.value ||
    email.value === "" ||
    senha.value === ""
  ) {
    alert("Verifique os campos informados e tente novamente!");
  } else {
    let dados = new URLSearchParams();
    dados.append("email", email.value);
    dados.append("senha", senha.value);
    dados.append("nome", nome.value);
    dados.append("sobrenome", sobrenome.value);

    await axios
      .post("http://localhost:3000/users_register", dados)
      .then((res) => {
        if (res.status == 200) {
          localStorage.setItem("usID", res.data.usID);
          localStorage.setItem("exp", res.data.exp);
          localStorage.setItem("sID", res.data.sID);
          router.push("menu");
        }
      })
      .catch((err) => {
        alert(err.response.data);
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
          <h1 class="titulo">Crie sua conta</h1>
          <p class="subtitulo">Junte-se ao DiviSmart hoje</p>
        </div>

        <form class="conteudo" @submit.prevent="register">
          <div class="input-group">
            <label for="email">E-mail</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div class="row-inputs">
            <div class="input-group">
              <label for="nome">Nome</label>
              <input
                type="text"
                id="nome"
                v-model="nome"
                @input="validarCadastrar"
                placeholder="Nome"
                required
              />
            </div>
            <div class="input-group">
              <label for="sobrenome">Sobrenome</label>
              <input
                type="text"
                id="sobrenome"
                v-model="sobrenome"
                @input="validarCadastrar"
                placeholder="Sobrenome"
                required
              />
            </div>
          </div>

          <div class="input-group">
            <label for="password">Senha</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="senha"
              @input="validarCadastrar"
              placeholder="Mínimo 8 caracteres"
              required
            />
            <div class="alerts-container">
              <p class="alert" v-show="maxPass">Máximo 20 caracteres.</p>
              <p class="alert" v-show="minPass">Mínimo 8 caracteres.</p>
              <p class="alert" v-show="numLetter">
                Use uma letra maiúscula e um número.
              </p>
            </div>
          </div>

          <div class="input-group">
            <label for="password_confirm">Confirmar Senha</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password_confirm"
              v-model="senha2"
              @input="validarCadastrar"
              placeholder="Repita sua senha"
              required
            />
            <p class="alert" v-show="like">As senhas não coincidem.</p>
          </div>

          <div class="pass-options">
            <label class="checkbox-container">
              <input type="checkbox" @change="togglePassword" />
              <span class="checkmark"></span>
              Mostrar Senha
            </label>
          </div>

          <button class="btn-login" type="submit">
            Cadastrar
            <svg
              class="login_icon"
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="currentColor"
            >
              <path
                d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
              />
            </svg>
          </button>
        </form>

        <p class="footer-text">
          Já tem uma conta?
          <RouterLink to="/login" class="signup-link">Faça login</RouterLink>
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
  padding: 40px 20px;
}

.login-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  padding: 40px;
  border-radius: 24px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.card-header {
  margin-bottom: 32px;
  text-align: center;
}
.titulo {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.subtitulo {
  color: #94a3b8;
  font-size: 0.95rem;
}

.row-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.input-group label {
  font-size: 0.85rem;
  color: #cbd5e1;
  padding-left: 4px;
}

input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: 12px;
  color: white;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.alerts-container {
  margin-top: 4px;
}
.alert {
  color: #f87171;
  font-size: 0.75rem;
  margin: 2px 0;
}

.pass-options {
  margin: 8px 0 24px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #94a3b8;
  font-size: 0.85rem;
}

.btn-login {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition:
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s;
}

.btn-login:hover {
  background-color: #2563eb;
  transform: scale(1.02);
}

.btn-login:active {
  transform: scale(0.98);
}

.login_icon {
  flex-shrink: 0;
}

.signup-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.footer-text {
  margin-top: 24px;
  text-align: center;
  color: #94a3b8;
}

.back-wrapper {
  position: absolute;
  top: 40px;
  left: 40px;
}

.btn-back {
  background: transparent;
  border: none;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

@media (max-width: 640px) {
  .row-inputs {
    grid-template-columns: 1fr;
  }
  .back-wrapper {
    top: 20px;
    left: 20px;
  }
  .login-card {
    padding: 30px 20px;
  }
}
</style>
