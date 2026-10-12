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
  padding: 1.5rem;
  background:
    radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.12) 0%, transparent 34%),
    radial-gradient(circle at 100% 100%, rgba(14, 165, 233, 0.08) 0%, transparent 34%),
    var(--bg-deep);
  font-family: inherit;
  color: var(--text-main);
}

.demo-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  padding: 2.5rem 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(14px);
  text-align: center;
  max-width: 420px;
  width: 100%;
}

.demo-card h2 {
  margin-top: 1.5rem;
  font-size: 1.25rem;
  color: var(--text-main);
  font-weight: 600;
}

.demo-card p {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.demo-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.retry-button {
  border: 0;
  border-radius: var(--radius-md);
  padding: 0.85rem 1.2rem;
  color: #ffffff;
  background: var(--gradient-accent);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.28);
}

.retry-button:hover {
  box-shadow: 0 8px 18px rgba(59, 130, 246, 0.35);
}

.home-link {
  color: var(--accent-soft);
  font-size: 0.9rem;
  text-decoration: none;
  font-weight: 500;
}

.home-link:hover {
  color: var(--accent);
  text-decoration: underline;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent);
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