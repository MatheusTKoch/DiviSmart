<script>
import api from "../../api/main";

export default {
  name: "DemoLogin",
  data() {
    return {
      errorMessage: "",
      isLoading: true,
    };
  },
  mounted() {
    this.accessDemo();
  },
  methods: {
    async     accessDemo() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        const res = await api.post("/users_demo_login");

        if (res.status === 200) {
          if (res.data.token) {
            localStorage.setItem("auth_token", res.data.token);
          }
          await this.$router.replace({ name: "menuHome" });
        }
      } catch (err) {
        console.error("Erro ao acessar modo demonstração:", err);
        this.isLoading = false;
        this.errorMessage =
          err.response?.data?.message ||
          "Não foi possível carregar a demonstração. Tente novamente.";
      }
    }
    },
    async retry() {
      await this.accessDemo();
    },
  };
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <template v-if="isLoading">
        <div class="spinner"></div>
        <h2>Carregando demonstração...</h2>
        <p>Aguarde um instante enquanto preparamos seu acesso ao DiviSmart.</p>
      </template>
      <template v-else>
        <h2>Não foi possível abrir a demonstração</h2>
        <p>{{ errorMessage }}</p>
        <div class="demo-actions">
          <button class="retry-button" type="button" @click="retry">
            Tentar novamente
          </button>
          <RouterLink class="home-link" to="/">Voltar para a página inicial</RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: inherit;
}

.demo-card {
  background: #ffffff;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.demo-card h2 {
  margin-top: 1.5rem;
  font-size: 1.25rem;
  color: #1e293b;
  font-weight: 600;
}

.demo-card p {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.demo-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.retry-button {
  border: 0;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  color: #ffffff;
  background: #3b82f6;
  cursor: pointer;
  font: inherit;
}

.home-link {
  color: #3b82f6;
  font-size: 0.9rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>