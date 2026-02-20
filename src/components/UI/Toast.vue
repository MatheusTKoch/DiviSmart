<script lang="ts" setup>
defineProps({
  sucesso: {
    type: Boolean,
    default: true,
  },
  position: {
    type: String,
    default: "right", // "right" or "center"
  },
});
</script>

<template>
  <div
    class="toast"
    :class="[
      sucesso ? 'toast-success' : 'toast-error',
      position === 'center' ? 'toast-center' : 'toast-right',
    ]"
  >
    <svg
      v-if="sucesso"
      class="toast-icon"
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 -960 960 960"
      width="24"
      fill="#4ade80"
    >
      <path
        d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170Zm56 232q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"
      />
    </svg>
    <svg
      v-else
      class="toast-icon"
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 -960 960 960"
      width="24"
      fill="#f87171"
    >
      <path
        d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"
      />
    </svg>

    <div class="toast-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 16px;
  z-index: 9999;
  min-width: 280px;
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.toast-right {
  right: 2rem;
  animation: slideInRight 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}

.toast-center {
  left: 50%;
  transform: translateX(-50%);
  animation: slideInCenter 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}

.toast-content {
  color: #f1f5f9;
  font-size: 0.9rem;
  font-weight: 500;
}

.toast-success {
  border-left: 4px solid #4ade80;
}

.toast-error {
  border-left: 4px solid #f87171;
}

@keyframes slideInRight {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInCenter {
  from {
    transform: translate(-50%, 100px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .toast {
    bottom: 1rem;
    min-width: auto;
  }

  .toast-right {
    right: 1rem;
    left: auto;
  }

  .toast-center {
    left: 1rem;
    right: 1rem;
    transform: none;
  }

  @keyframes slideInCenter {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>
