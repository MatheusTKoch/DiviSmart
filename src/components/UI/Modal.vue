<script setup lang="ts">
import { ref, defineEmits } from "vue";
import axios from "axios";

const emit = defineEmits(["fecharModal"]);

const nomeCarteira = ref("");
const userID = ref("");
const showAlert = ref(false);

function validarCarteira() {
  showAlert.value = nomeCarteira.value.trim() === "";
}

function cadastroCarteira() {
  if (nomeCarteira.value.trim() === "") {
    showAlert.value = true;
  } else {
    let dados = new URLSearchParams();
    userID.value = localStorage.getItem("usID") || "";
    dados.append("carteira", nomeCarteira.value);
    dados.append("userID", userID.value);
    axios
      .post("http://localhost:3000/carteira", dados)
      .then(() => {
        fecharModal();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function fecharModal() {
  emit("fecharModal");
}
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div class="modal-overlay" @click.self="fecharModal">
        <div class="modal-card">
          <button class="btn-close-icon" @click="fecharModal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="currentColor"
            >
              <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
              />
            </svg>
          </button>

          <div class="modal-header">
            <h2 class="titulo">Nova Carteira</h2>
            <p class="subtitulo">Organize seus investimentos</p>
          </div>

          <div class="modal-body">
            <div class="input-group">
              <label for="nomeCarteira">Nome da Carteira</label>
              <input
                type="text"
                id="nomeCarteira"
                v-model="nomeCarteira"
                @input="validarCarteira"
                placeholder="Ex: Reserva de Emergência"
                autofocus
              />
              <transition name="slide-up">
                <p class="alert" v-if="showAlert">
                  Por favor, informe um nome válido.
                </p>
              </transition>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-voltar" @click="fecharModal">Cancelar</button>
            <button class="btn-cadastrar" @click="cadastroCarteira">
              Criar Carteira
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-card {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px;
  border-radius: 24px;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.titulo {
  color: #f8fafc;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.subtitulo {
  color: #94a3b8;
  font-size: 0.9rem;
}

.modal-body {
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  color: #cbd5e1;
  font-size: 0.85rem;
  padding-left: 4px;
}

input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
  width: 100%;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(15, 23, 42, 0.8);
}

.modal-footer {
  display: flex;
  gap: 12px;
}

button {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.btn-cadastrar {
  background: #3b82f6;
  color: white;
  border: none;
}

.btn-cadastrar:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-voltar {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.btn-voltar:hover {
  background: rgba(148, 163, 184, 0.1);
  color: #f8fafc;
}

.btn-close-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: #64748b;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.btn-close-icon:hover {
  color: #f8fafc;
}

.alert {
  color: #f87171;
  font-size: 0.75rem;
  margin-top: 4px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.3s ease-out;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>
