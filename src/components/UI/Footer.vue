<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-left">
        <p>&copy; 2024 DiviSmart. Todos os direitos reservados.</p>
      </div>

      <div class="footer-right">
        <a href="https://github.com/MatheusTKoch" target="_blank" class="github-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
            <path d="M9 18c-4.51 2-5-2-7-2"/>
          </svg>
          <span class="github-text">Github</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  background-color: transparent;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 8%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left p {
  color: #475569;
  font-size: 0.75rem;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.github-link:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.github-text {
  font-size: 0.75rem;
  font-weight: 500;
}

@media (max-width: 640px) {
  .footer-container {
    padding: 0 5%;
  }
}
</style>