<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import axios from 'axios';
const emit = defineEmits(['fecharModal']);

const nomeCarteira = ref('');
const userID = ref('');
const showAlert = ref(false);

function validarCarteira() {
  showAlert.value = nomeCarteira.value.trim() === '';
}

function cadastroCarteira() {
  if (nomeCarteira.value.trim() === '') {
    alert('Por favor, informe um nome para cadastro da carteira!');
  } else {
    let dados = new URLSearchParams();
    userID.value = localStorage.getItem('usID') || '';
    dados.append('carteira', nomeCarteira.value);
    dados.append('userID', userID.value);
    axios
      .post('http://localhost:8080/carteira', dados)
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
  emit('fecharModal');
}
</script>

<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="fecharModal">
      <div class="conteudo">
        <div class="titulo">
          Cadastro de Carteiras
          <a class="fechar" @click="fecharModal">X</a>
        </div>
        <label class="nome-carteira" for="nomeCarteira">Nome da Carteira:</label>
        <input type="text" id="nomeCarteira" v-model="nomeCarteira" @keyup="validarCarteira" />
        <p class="alert" v-if="showAlert">Por favor informe um nome para cadastro da carteira</p>
        <div class="botoes">
          <button class="cadastrar" @click="cadastroCarteira">Cadastrar</button>
          <button class="voltar" @click="fecharModal">Voltar</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
div.titulo, label.nome-carteira {
    color: ghostwhite;
    font-size: large;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.conteudo {
  padding: 5rem;
  text-align: center;
  white-space: nowrap;
  border: 1px solid black;
  border-radius: 25px;
  background: linear-gradient(135deg, #055db6 10%, #8ecdd3, #6755d1);
  max-width: 90vw;
}

a.fechar {
  position: absolute;
  top: 20rem;
  right: 48rem;
  color: ghostwhite;
  cursor: pointer;
}

div.botoes {
  margin-top: 1rem;
}

p.alert {
  color: red;
  font-size: small;
  text-align: center;
}

button.cadastrar,
button.voltar {
  background-color: transparent;
  color: ghostwhite;
  border: 1px solid ghostwhite;
  margin: 10px;
}

button.cadastrar:hover,
button.voltar:hover {
  color: black;
  border-color: black;
  background-color: ghostwhite;
  transition: 0.3s;
}

label {
  display: block;
  font-size: large;
  margin-top: 1rem;
}

input {
  padding: 0.5rem;
  margin-top: 0.5rem;
  width: 80%;
}
</style>