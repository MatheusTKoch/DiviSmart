<script setup lang="ts">
import Modal from "../UI/Modal.vue";
import Ativos from "../Forms/Ativos.vue";
import api from "../../api/main";
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import Spinner from "../UI/Spinner.vue";

const router = useRouter();
let showCarteira = ref(false);
let carteiras = ref<any[]>([]);
let editCarteira = ref(false);
let idCarteira = ref();
let loading = ref(true);

function abrirModal() {
  showCarteira.value = true;
}

function fecharModal() {
  showCarteira.value = false;
}

function handleCarteiraCriada() {
  loadCarteira();
}

defineProps({
  cID: Number,
});

onMounted(async () => {
  try {
    await Promise.all([loadCarteira(), verifyUser()]);
    sessionStorage.removeItem("cID");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

async function verifyUser() {
  try {
    await api.get("/verify_session");
  } catch (err: any) {
    console.log(err);
    localStorage.removeItem("usID");
    localStorage.removeItem("exp");
    localStorage.removeItem("sID");
    router.push("/");
  }
}

async function loadCarteira() {
  try {
    const res = await api.post("/carteira_load", {
      userID: localStorage.getItem("usID"),
    });
    nextTick(() => {
      carteiras.value = res.data;
    });
  } catch (err) {
    console.log(err);
  }
}

async function deleteCarteira(num: number) {
  if (confirm("Tem certeza que deseja apagar a carteira?")) {
    try {
      await api.post("/carteira_delete", {
        carteiraID: num,
      });
      await loadCarteira();
    } catch (err) {
      console.log(err);
    }
  }
}

function sendID(num: number) {
  idCarteira.value = num;
  sessionStorage.setItem("cID", idCarteira.value);
}
</script>

<template>
  <div v-if="loading">
    <Spinner></Spinner>
  </div>
  <div v-else class="conteudo">
    <div v-if="!editCarteira">
      <div class="header-section">
        <div class="titulo">Carteiras</div>
        <div class="subtitulo">
          Visualize, edite ou exclua suas carteiras cadastradas!
        </div>
        <button class="btn-add" @click="abrirModal()" :disabled="showCarteira">
          Adicionar Carteira
        </button>
      </div>
      <div class="carteira-lista">
        <h3>Suas Carteiras:</h3>
        <div class="carteiras-grid">
          <div
            v-for="cart in carteiras"
            :key="cart.CarteiraID"
            class="carteira-card"
          >
            <div class="card-content">
              <span class="nome">{{ cart.Nome }}</span>
              <div class="acoes">
                <svg
                  @click="
                    ((editCarteira = true), $emit('editarCarteira'));
                    sendID(cart.CarteiraID);
                  "
                  class="icon edit-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#3b82f6"
                >
                  <path
                    d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
                  />
                </svg>
                <svg
                  @click="deleteCarteira(cart.CarteiraID)"
                  class="icon delete-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#ef4444"
                >
                  <path
                    d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal">
        <Modal
          v-if="showCarteira"
          @fecharModal="fecharModal"
          @carteiraCriada="handleCarteiraCriada"
        />
      </div>
    </div>
    <div class="ativos">
      <Ativos
        @editarCarteira="editCarteira = false"
        v-if="editCarteira"
      ></Ativos>
    </div>
  </div>
</template>

<style scoped>
.conteudo {
  position: absolute;
  top: 20%;
  transform: translateX(30%);
  color: #f8fafc;
  max-width: 70vw;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.titulo {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

.subtitulo {
  font-size: 1.2rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.btn-add {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border: none;
  color: #f8fafc;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.carteira-lista h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #f8fafc;
}

.carteiras-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.carteira-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.carteira-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  border-color: rgba(59, 130, 246, 0.2);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nome {
  font-size: 1.2rem;
  font-weight: 600;
  color: #f8fafc;
}

.acoes {
  display: flex;
  gap: 0.5rem;
}

.icon {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.25rem;
  border-radius: 8px;
}

.icon:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.edit-icon:hover {
  fill: #60a5fa;
}

.delete-icon:hover {
  fill: #f87171;
}

.ativos {
  position: absolute;
  transform: translateX(2vw);
}

.modal {
  position: relative;
  bottom: 28vh;
}

@media (max-width: 768px) {
  .conteudo {
    left: 5%;
    max-width: 90vw;
  }
  .titulo {
    font-size: 2rem;
  }
  .subtitulo {
    font-size: 1rem;
  }
  .carteiras-grid {
    grid-template-columns: 1fr;
  }
}
</style>
