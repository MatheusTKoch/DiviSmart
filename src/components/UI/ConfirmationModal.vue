<template>
  <div class="confirmation-modal-overlay">
    <div class="confirmation-modal page-panel centered-card">
      <div class="confirmation-modal-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="confirmation-modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="confirmation-modal-footer">
        <button @click="cancel" class="button-secondary btn btn-cancel">Cancelar</button>
        <button @click="confirm" class="button-primary btn btn-confirm">Confirmar</button>
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
  text-align: center;
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
  font-size: 1rem;
  flex: 1;
}

.btn-cancel {
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-cancel:hover {
  transform: translateY(-2px);
}

.btn-confirm {
  color: #f8fafc;
}

.btn-confirm:hover {
  transform: translateY(-2px);
}
</style>
