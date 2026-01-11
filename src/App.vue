<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isHome = computed(() => route.path === "/");
</script>

<template>
  <div class="app-viewport">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style>
:root {
  --bg-deep: #020617;
  --accent-blue: #3b82f6;
  --glass-bg: rgba(30, 41, 59, 0.4);
  --glass-border: rgba(255, 255, 255, 0.05);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-deep);
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #f8fafc;
  overflow-x: hidden;
}

.app-viewport {
  min-height: 100vh;
  width: 100%;
  position: relative;
  background: radial-gradient(
      circle at 0% 0%,
      rgba(59, 130, 246, 0.08) 0%,
      transparent 35%
    ),
    radial-gradient(
      circle at 100% 100%,
      rgba(103, 85, 209, 0.08) 0%,
      transparent 35%
    ),
    #020617;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #020617;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
