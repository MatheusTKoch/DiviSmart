<script>
import axios from "axios";

export default {
  name: "DemoLogin",
  async mounted() {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      const res = await axios.post(
        `${API_URL}/users_demo_login`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        this.$router.push("/menu");
      }
    } catch (err) {
      console.error("Erro ao acessar modo demonstração:", err);
      alert("Não foi possível carregar a demonstração. Redirecionando para a página inicial.");
      this.$router.push("/");
    }
  },
};
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <div class="spinner"></div>
      <h2>Carregando demonstração...</h2>
      <p>Aguarde um instante enquanto preparamos seu acesso ao DiviSmart.</p>
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