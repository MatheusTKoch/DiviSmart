<script lang="ts" setup>
defineProps({
  sucesso: Boolean,
  erro: Boolean
})
</script>

<template>
  <div v-if="sucesso" class="toast toast-success">
    <slot></slot>
  </div>
  <div v-else-if="erro" class="toast toast-error">
    <slot></slot>
  </div>
</template>

<style scoped>
.toast {
  position: fixed;         
  top: -8rem;              
  right: -50rem;             
  padding: 1rem 1.5rem;
  color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  animation: showToast 0.5s forwards;
}

.toast-success {
  background-color: #4caf50;
}

.toast-error {
  background-color: #f44336;
}

@keyframes showToast {
  0% {
    transform: translateX(150%);
    opacity: 0;
  }
  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}
</style>