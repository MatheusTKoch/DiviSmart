<script lang="ts" setup>
defineProps({
  sucesso: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <div class="toast" :class="sucesso ? 'toast-success' : 'toast-error'">
    <slot></slot>
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 8rem;
  right: 1rem;
  padding: 1rem 1.5rem;
  color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
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
  from {
    transform: translateX(150%);
    opacity: 0;
  }
  to {
    transform: translateX(0%);
    opacity: 1;
  }
}
</style>