<template>
  <div class="spinner-overlay">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(2, 6, 23, 0.5);
  backdrop-filter: blur(2px);
  z-index: 10001;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-left-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.4));
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
