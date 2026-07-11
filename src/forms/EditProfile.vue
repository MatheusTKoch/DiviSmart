<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Motion } from "@motionone/vue";
import api from "../api/main";
import Toast from "../components/UI/Toast.vue";
import Spinner from "../components/UI/Spinner.vue";

const router = useRouter();

const email = ref("");
const nome = ref("");
const sobrenome = ref("");
const loading = ref(true);
const saving = ref(false);

const showToast = ref(false);
const toastMsg = ref("");
const toastSucesso = ref(false);

function triggerToast(message: string, success = false) {
  toastMsg.value = message;
  toastSucesso.value = success;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

async function loadProfile() {
  try {
    const res = await api.get("/profile_load");
    email.value = res.data.email ?? "";
    nome.value = res.data.nome ?? "";
    sobrenome.value = res.data.sobrenome ?? "";
  } catch (err: any) {
    const msg = err.response?.data || "Erro ao carregar o perfil.";
    triggerToast(msg);
    if (err.response?.status === 401) {
      router.push("/");
    }
  } finally {
    loading.value = false;
  }
}

async function saveProfile() {
  if (!email.value.trim() || !nome.value.trim() || !sobrenome.value.trim()) {
    triggerToast("Preencha email, nome e sobrenome.");
    return;
  }

  saving.value = true;

  try {
    const res = await api.put("/users_update", {
      email: email.value.trim(),
      nome: nome.value.trim(),
      sobrenome: sobrenome.value.trim(),
    });

    if (res.status === 200) {
      triggerToast("Perfil atualizado com sucesso!", true);
      setTimeout(() => {
        router.push("/menu");
      }, 900);
    }
  } catch (err: any) {
    const msg = err.response?.data || "Erro ao atualizar o perfil.";
    triggerToast(msg);
  } finally {
    saving.value = false;
  }
}

onMounted(loadProfile);
</script>

<template>
  <div class="profile-page">
    <Toast v-if="showToast" :sucesso="toastSucesso" position="center">
      {{ toastMsg }}
    </Toast>

    <div v-if="loading" class="profile-state">
      <Spinner />
    </div>

    <Motion
      v-else
      tag="section"
      class="profile-card centered-card page-panel"
      :initial="{ opacity: 0, y: 18 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.45 }"
    >
      <div class="card-header">
        <h1 class="titulo">Editar perfil</h1>
        <p class="subtitulo">
          Atualize seu e-mail, nome e sobrenome vinculados à conta.
        </p>
      </div>

      <form class="profile-form stack" @submit.prevent="saveProfile">
        <div class="field-group">
          <label for="email" class="field-label">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="field-input"
            placeholder="seu@email.com"
            autocomplete="email"
            required
          />
        </div>

        <div class="row-inputs">
          <div class="field-group">
            <label for="nome" class="field-label">Nome</label>
            <input
              id="nome"
              v-model="nome"
              type="text"
              class="field-input"
              placeholder="Nome"
              autocomplete="given-name"
              required
            />
          </div>

          <div class="field-group">
            <label for="sobrenome" class="field-label">Sobrenome</label>
            <input
              id="sobrenome"
              v-model="sobrenome"
              type="text"
              class="field-input"
              placeholder="Sobrenome"
              autocomplete="family-name"
              required
            />
          </div>
        </div>

        <div class="actions-row">
          <button type="button" class="button-secondary" @click="router.push('/menu')">
            Cancelar
          </button>
          <button type="submit" class="button-primary" :disabled="saving">
            {{ saving ? "Salvando..." : "Salvar alterações" }}
          </button>
        </div>
      </form>
    </Motion>
  </div>
</template>

<style scoped>
.profile-page {
  width: 100%;
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}

.profile-state {
  width: 100%;
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-card {
  width: min(100%, 720px);
  padding: 2rem;
}

.card-header {
  margin-bottom: 1.75rem;
}

.titulo {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitulo {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.profile-form {
  gap: 1rem;
}

.row-inputs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.button-secondary,
.button-primary {
  min-width: 150px;
}

@media (max-width: 640px) {
  .profile-page {
    min-height: auto;
    padding: 0.5rem 0;
  }

  .profile-card {
    padding: 1.25rem;
  }

  .row-inputs {
    grid-template-columns: 1fr;
  }

  .actions-row {
    flex-direction: column-reverse;
  }

  .button-secondary,
  .button-primary {
    width: 100%;
  }
}
</style>
