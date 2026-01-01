<script setup lang="ts">
import { Motion } from "@motionone/vue"
import Header from './UI/Header.vue';
import Footer from './UI/Footer.vue';
</script>

<template>
  <div class="app-container">
    <Header showLogin />

    <main class="hero-grid">
      <Motion 
        class="hero-content"
        :initial="{ opacity: 0, x: -30 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.8 }"
      >
        <h1 class="main-title">
          Seu Guia Inteligente de <br/>
          <span class="gradient-text">Dividendos e Investimentos</span>
        </h1>
        <p class="description">
          Acompanhe seus ganhos, visualize dividendos e maximize o retorno dos seus investimentos – tudo em um só lugar.
        </p>
        
        <div class="actions">
          <Motion tag="button" :hover="{ scale: 1.05 }" :press="{ scale: 0.95 }" class="btn-primary">
            <RouterLink to="/register" class="link">Criar Conta Gratuita</RouterLink>
          </Motion>
          <button class="btn-secondary">Ver Demonstração</button>
        </div>
      </Motion>

      <Motion 
        class="hero-visual"
        :initial="{ opacity: 0, y: 40 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 1, delay: 0.2 }"
      >
        <div class="glass-card">
          <img src="../assets/graph.png" alt="Análise de Dividendos" class="main-chart">
          <div class="chart-overlay"></div>
        </div>
      </Motion>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.app-container {
  background-color: #020617; 
  color: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 0 8%;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
}

.main-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.1;
  font-weight: 800;
  margin-top: 1.5rem;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(to right, #60a5fa, #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.description {
  font-size: 1.2rem;
  color: #94a3b8; 
  margin: 2rem 0;
  line-height: 1.6;
}

.actions { display: flex; gap: 1rem; }

.btn-primary {
  background: #3b82f6;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
}

.btn-secondary:hover { background: rgba(255,255,255,0.08); }

.link { color: white; text-decoration: none; }

.glass-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 20px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.main-chart {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
    padding-top: 6rem;
    gap: 2rem;
  }
  .actions { justify-content: center; }
  .description { margin: 1.5rem auto; }
}
</style>