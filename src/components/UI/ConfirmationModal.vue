<template>
  <div class="confirmation-modal-overlay">
    <div class="confirmation-modal">
      <div class="confirmation-modal-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="confirmation-modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="confirmation-modal-footer">
        <button @click="cancel" class="btn btn-cancel">Cancelar</button>
        <button @click="confirm" class="btn btn-confirm">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  title: {
    type: String,
    default: 'Confirmação',
  },
  message: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.confirmation-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirmation-modal {
  background: #1e293b; /* Dark background */
  color: #f8fafc; /* Light text */
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 400px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.confirmation-modal-header h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.confirmation-modal-body p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #94a3b8;
}

.confirmation-modal-footer {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.btn-confirm {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: #f8fafc;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}
</style>
