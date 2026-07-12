<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Toast from "../UI/Toast.vue";
import api from "../../api/main";
import { Motion } from "@motionone/vue";

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
    triggerToast("Verifique os campos informados e tente novamente!");
  } else {
    try {
      const res = await api.post("/users_register", {
        email: email.value,
        senha: senha.value,
        nome: nome.value,
        sobrenome: sobrenome.value,
      });

      if (res.status == 200) {
        router.push("menu");
      }
    } catch (err: any) {
      const msg = err.response?.data || "Erro ao realizar cadastro";
      triggerToast(msg);
    }
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
      class="auth-card centered-card register-card"
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6 }"
    >
      <div class="card-header">
        <h1 class="titulo">Crie sua conta</h1>
        <p class="subtitulo">Junte-se ao DiviSmart hoje</p>
      </div>

      <form class="stack" @submit.prevent="register">
        <div class="field-group">
          <label for="email" class="field-label">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="seu@email.com"
            class="field-input"
            required
          />
        </div>

        <div class="row-inputs">
          <div class="field-group">
            <label for="nome" class="field-label">Nome</label>
            <input
              type="text"
              id="nome"
              v-model="nome"
              @input="validarCadastrar"
              placeholder="Nome"
              class="field-input"
              required
            />
          </div>
          <div class="field-group">
            <label for="sobrenome" class="field-label">Sobrenome</label>
            <input
              type="text"
              id="sobrenome"
              v-model="sobrenome"
              @input="validarCadastrar"
              placeholder="Sobrenome"
              class="field-input"
              required
            />
          </div>
        </div>

        <div class="field-group">
          <label for="password" class="field-label">Senha</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="senha"
            @input="validarCadastrar"
            placeholder="Mínimo 8 caracteres"
            class="field-input"
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

        <div class="field-group">
          <label for="password_confirm" class="field-label">
            Confirmar Senha
          </label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password_confirm"
            v-model="senha2"
            @input="validarCadastrar"
            placeholder="Repita sua senha"
            class="field-input"
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

        <button class="button-primary btn-login" type="submit">
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
        <RouterLink to="/" class="signup-link">Faça login</RouterLink>
      </p>
    </Motion>
  </div>
</template>

<style scoped>
.register-card {
  width: 100%;
  max-width: 520px;
}

.card-header {
  margin-bottom: 24px;
  text-align: center;
}
.titulo {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 6px;
}
.subtitulo {
  color: #94a3b8;
  font-size: 0.9rem;
}

.row-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  margin: 4px 0 20px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #94a3b8;
  font-size: 0.8rem;
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
    background-color 0.3s;
}

.btn-login:hover {
  background-color: #2563eb;
  transform: scale(1.01);
}

.btn-login:active {
  transform: scale(0.99);
}

.login_icon {
  flex-shrink: 0;
}

.signup-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.signup-link:hover {
  color: #60a5fa;
}

.footer-text {
  margin-top: 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .row-inputs {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .register-card {
    max-width: 100%;
  }
  .card-header .titulo {
    font-size: 1.5rem;
  }
}
</style>
