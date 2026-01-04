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
        :initial="{ opacity: 0, x: -40 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.8, easing: 'ease-out' }"
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

      <div class="hero-visual">
        <Motion 
          class="glass-card"
          :initial="{ opacity: 0, scale: 0.9 }"
          :animate="{ 
            opacity: 1, 
            scale: 1,
            y: [0, -20, 0] 
          }"
          :transition="{ 
            opacity: { duration: 1 },
            scale: { duration: 1 },
            y: { duration: 5, repeat: Infinity, easing: 'ease-in-out' } 
          }"
        >
          <img src="../assets/graph.png" alt="Análise de Dividendos" class="main-chart">
          <div class="glow-effect"></div>
        </Motion>
      </div>
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
  overflow-x: hidden;
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
  width: 100%;
}

.main-title {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(to right, #60a5fa, #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.description {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #94a3b8; 
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 540px;
}

.actions { display: flex; gap: 1.2rem; }

.btn-primary {
  background: #3b82f6;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover { background: rgba(255, 255, 255, 0.08); }
.link { color: white; text-decoration: none; }

.hero-visual {
  display: flex;
  justify-content: center;
  position: relative;
}

.glass-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  padding: 12px;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
}

.main-chart {
  width: 100%;
  max-width: 550px;
  height: auto;
  border-radius: 20px;
  display: block;
}

.glow-effect {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 120%; height: 120%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
  z-index: -1;
  pointer-events: none;
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 100px 5% 40px 5%;
    gap: 3rem;
  }
  .actions { justify-content: center; }
  .description { margin: 0 auto 2.5rem auto; }
  .main-chart { max-width: 100%; }
}
</style>